
import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || ''
).replace(/\/+$/, '');

export async function predictLeaf(photo) {
  // Check if a photo is selected
  if (!photo?.uri) {
    throw new Error('Please choose a leaf photo first.');
  }

  // Check backend URL
  if (!API_URL || API_URL.includes('YOUR-LAPTOP')) {
    throw new Error(
      'Plant checking is not connected. Please check the app settings.'
    );
  }

  const mimeType = photo.mimeType || 'image/jpeg';

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new Error(
      'Please select a JPG, PNG or WebP photo.'
    );
  }

  // Create a real file using Expo FileSystem
  const imageFile = new File(photo.uri);

  if (imageFile.size > 8 * 1024 * 1024) {
    throw new Error(
      'This photo is too large. Please choose a smaller one.'
    );
  }

  // Prepare image upload for FastAPI
  const formData = new FormData();

  formData.append('file', imageFile);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 120000);

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('FastAPI response:', response.status, data);

      if (response.status === 413) {
        throw new Error(
          'This photo is too large. Please choose a smaller one.'
        );
      }

      if (response.status === 415) {
        throw new Error(
          'This photo format is not supported. Please use JPG or PNG.'
        );
      }

      if (response.status === 503) {
        throw new Error(
          'Plant checking is temporarily unavailable.'
        );
      }

      throw new Error(
        'We could not check this photo. Please try again.'
      );
    }

    if (
      !data ||
      !['healthy', 'diseased', 'uncertain'].includes(data.status)
    ) {
      throw new Error(
        'We could not read the plant result. Please try again.'
      );
    }

    return data;

  } catch (error) {
    console.error('Prediction request:', error);

    if (error.name === 'AbortError') {
      throw new Error(
        'The check took too long. Please try again.'
      );
    }

    if (
      error instanceof TypeError ||
      error.message?.includes('Network request failed')
    ) {
      throw new Error(
        'Cannot connect to plant checking. Check your Wi-Fi.'
      );
    }

    if (
      error.message?.includes('FormDataPart')
    ) {
      throw new Error(
        'Could not prepare the leaf photo. Please try again.'
      );
    }

    throw error;

  } finally {
    clearTimeout(timeout);
  }
}
