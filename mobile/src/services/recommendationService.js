import { supabase } from './supabaseClient';
import { normalizeDiseaseName } from '../data/severityRules';

// Supabase is editable by project maintainers. Local rules remain an offline
// fallback until the migration has been run and a catalog row is present.
export async function fetchTreatmentCatalog(diseaseName, severityLevel) {
  if (!supabase) return null;

  const diseaseCode = normalizeDiseaseName(diseaseName);
  if (!diseaseCode) return null;

  const [diseaseResult, ruleResult, medicineResult] = await Promise.all([
    supabase.from('diseases')
      .select('code, name_en, cause_en, cause_ur, prevention_en, prevention_ur')
      .eq('code', diseaseCode).maybeSingle(),

    supabase.from('severity_recommendations')
      .select('priority, action_en, action_ur, follow_up_en, follow_up_ur')
      .eq('disease_code', diseaseCode)
      .eq('severity_level', severityLevel || '')
      .maybeSingle(),

    supabase.from('medicines')
      .select('id, brand_name, manufacturer, active_ingredient, crop_claim_status, verified_pakistan_groundnut_label, precautions_en, precautions_ur, source_url')
      .contains('disease_codes', [diseaseCode]),
  ]);

  // Missing tables / no internet must never block opening a report.
  if (diseaseResult.error || ruleResult.error || medicineResult.error) {
    return null;
  }

  const disease = diseaseResult.data;
  const rule = ruleResult.data;
  const medicine = medicineResult.data || [];

  return {
    disease: disease ? {
      cause: { en: disease.cause_en, ur: disease.cause_ur },
      prevent: { en: disease.prevention_en, ur: disease.prevention_ur },
    } : null,

    rule: rule ? {
      priority: rule.priority,
      action: { en: rule.action_en, ur: rule.action_ur },
      followUp: { en: rule.follow_up_en, ur: rule.follow_up_ur },
    } : null,

    medicines: medicine.map(item => ({
      id: item.id,
      name: item.brand_name,
      manufacturer: item.manufacturer,
      active: item.active_ingredient,
      evidence: item.crop_claim_status === 'manufacturer_peanut_leaf_spot'
        ? 'peanut_leaf_spot_manufacturer'
        : 'unverified_groundnut',
      note: { en: item.precautions_en, ur: item.precautions_ur },
      source: item.source_url,
    })),
  };
}
