import { supabase } from './supabaseClient';

// Read ONLY saved reports belonging to the signed-in farmer.
// This table is created by the SQL migration included in the update.
export async function getScanHistory(userId, limit = 50) {
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from('scan_history')
    .select('id, disease_name, status, confidence, severity_percent, severity_level, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Convert a saved scan to the shape already understood by ResultScreen.
export function reportNavigationParams(scan) {
  return {
    result: {
      status: scan.status,
      report: {
        disease_name: scan.disease_name,
        confidence: Number(scan.confidence),
        severity_percent: scan.severity_percent,
        severity_level: scan.severity_level,
      },
    },
    imageUri: null, // Images will be linked when scan storage is implemented.
  };
}
