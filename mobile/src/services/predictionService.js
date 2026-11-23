import { supabase } from './supabaseClient';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// This is a REAL HTTP request. The /predict model endpoint is added next.
// Never generate fake prediction results in the final app.
export async function checkLeaf(imageUri) {
  if (!apiUrl || apiUrl.includes('YOUR-LAPTOP-LAN-IP')) {
    throw new Error('Plant checking is not connected yet. Set EXPO_PUBLIC_API_URL in mobile/.env.');
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Your login expired. Please sign in again.');

  const form = new FormData();
  form.append('file', {
    uri: imageUri,
    name: 'groundnut-leaf.jpg',
    type: 'image/jpeg',
  });

  let response;
  try {
    response = await fetch(`${apiUrl.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    });
  } catch (_error) {
    throw new Error('Cannot reach the plant-checking server. Check Wi-Fi and the API address.');
  }

  let data;
  try { data = await response.json(); } catch (_error) { data = {}; }
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'The server could not check this image.');
  }
  return data;
}
