
import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Use the same existing Supabase client as AuthContext.js.
// Adjust this import path if your project stores it elsewhere.
import { supabase } from './supabaseClient';

const BUCKET = 'plant-scans';

// Upload an image using binary data
async function uploadImage(path, base64, contentType) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, decode(base64), {
      contentType,
      upsert: false,
    });

  if (error) throw error;

  return path;
}

// Remove the "data:image/png;base64," prefix
function getBase64(dataUri) {
  if (!dataUri || !dataUri.includes(',')) {
    throw new Error('Invalid visualization image');
  }

  return dataUri.split(',')[1];
}

export async function saveCompletedScan(photo, prediction) {
  // Save only a consistent accepted result. In particular, a disease
  // label with 0% measured affected area must NOT enter History.
  const healthy = prediction?.status === 'healthy' &&
    prediction.has_leaf_mask === true;
  const diseased = prediction?.status === 'diseased' &&
    prediction.has_leaf_mask === true &&
    prediction.severity_percent != null &&
    Number.isFinite(Number(prediction.severity_percent)) &&
    Number(prediction.severity_percent) > 0 &&
    ['Low', 'Mild', 'Moderate', 'Severe'].includes(prediction.severity_level);

  if (!healthy && !diseased) {
    return null;
  }

  // Get the farmer who is currently signed in
  const { data, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;

  const user = data?.user;

  if (!user) {
    throw new Error('Please sign in to save your report.');
  }

  // Unique folder for this scan
  const scanFolder =
    `${user.id}/${Date.now()}-` +
    Math.random().toString(36).slice(2, 12);

  const mimeType = photo.mimeType || 'image/jpeg';

  const extension =
    mimeType === 'image/png' ? 'png' :
    mimeType === 'image/webp' ? 'webp' : 'jpg';

  const uploadedPaths = [];

  let originalPath = null;
  let overlayPath = null;
  let heatmapPath = null;

  try {
    // 1. Upload original leaf photo
    const originalFile = new File(photo.uri);

    if (originalFile.size > 10 * 1024 * 1024) {
      throw new Error('The photo is too large to save.');
    }

    originalPath =
      `${scanFolder}/original.${extension}`;

    const originalBase64 = await originalFile.base64();

    await uploadImage(
      originalPath,
      originalBase64,
      mimeType
    );

    uploadedPaths.push(originalPath);

    // 2. Upload disease visualizations
    // Healthy results do not have disease visualizations
    if (prediction.status === 'diseased') {
      if (prediction.affected_overlay) {
        overlayPath = `${scanFolder}/overlay.png`;

        await uploadImage(
          overlayPath,
          getBase64(prediction.affected_overlay),
          'image/png'
        );

        uploadedPaths.push(overlayPath);
      }

      if (prediction.concentration_heatmap) {
        heatmapPath = `${scanFolder}/heatmap.png`;

        await uploadImage(
          heatmapPath,
          getBase64(prediction.concentration_heatmap),
          'image/png'
        );

        uploadedPaths.push(heatmapPath);
      }
    }

    // 3. Save scan details in PostgreSQL
    const { data: savedScan, error: dbError } =
      await supabase
        .from('scan_history')
        .insert({
          user_id: user.id,
          disease_name: prediction.disease_name,
          status: prediction.status,
          confidence: prediction.confidence,
          severity_percent: prediction.severity_percent,
          severity_level: prediction.severity_level,

          original_image_path: originalPath,
          affected_overlay_path: overlayPath,
          heatmap_path: heatmapPath,
        })
        .select('id, created_at')
        .single();

    if (dbError) throw dbError;

    return savedScan;

  } catch (error) {
    console.error('Scan saving failed:', error);

    // Remove uploaded images if the operation failed
    // before the database record was saved.
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } =
        await supabase.storage
          .from(BUCKET)
          .remove(uploadedPaths);

      if (cleanupError) {
        console.warn('Image cleanup failed:', cleanupError);
      }
    }

    throw error;
  }
}
export async function getSavedScanImages(scan) {
  async function signedUrl(path) {
    if (!path) return null;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600);

    if (error) throw error;

    return data.signedUrl;
  }

  return {
    original: await signedUrl(scan.original_image_path),
    overlay: await signedUrl(scan.affected_overlay_path),
    heatmap: await signedUrl(scan.heatmap_path),
  };
}

export async function getSavedScanDetail(scanId) {
  if (!scanId) {
    throw new Error('Report not found.');
  }

  // RLS allows the farmer to read only their own report
  const { data: scan, error } = await supabase
    .from('scan_history')
    .select('*')
    .eq('id', scanId)
    .single();

  if (error) throw error;

  // Get temporary image links from private storage
  const images = await getSavedScanImages(scan);

  return {
    ...scan,
    images,
  };
}
