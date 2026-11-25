
import {
  ImageManipulator,
  SaveFormat,
} from 'expo-image-manipulator';

import { File } from 'expo-file-system';

const MAX_DIMENSION = 1920;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function prepareLeafPhoto(asset) {
  if (!asset?.uri) {
    throw new Error('Please select a photo.');
  }

  const width = Number(asset.width);
  const height = Number(asset.height);

  if (!width || !height) {
    throw new Error('Could not read photo dimensions.');
  }

  // Resize without changing the aspect ratio
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(width, height)
  );

  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  // Correct Expo SDK 58 API
  const context = ImageManipulator.manipulate(asset.uri);

  if (scale < 1) {
    context.resize({
      width: newWidth,
      height: newHeight,
    });
  }

  // Process the photo
  const renderedImage = await context.renderAsync();

  // Save as JPEG to reduce file size
  const savedImage = await renderedImage.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.82,
  });

  const file = new File(savedImage.uri);

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      'This photo is still too large. Please try another.'
    );
  }

  return {
    uri: savedImage.uri,
    width: savedImage.width,
    height: savedImage.height,
    mimeType: 'image/jpeg',
    fileName: 'groundnut-leaf.jpg',
  };
}
