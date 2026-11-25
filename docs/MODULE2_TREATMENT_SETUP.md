# Module 2 — Groundnut Treatment, Early Action and Prevention

**Status:** Core screen and research-informed rules implemented. Local pesticide label verification and field validation are still required.

## How this module works

1. A farmer checks a groundnut leaf with the mobile application.
2. FastAPI returns a possible disease, confidence, affected-area estimate and images.
3. **For accepted results**, the Report page offers **View Treatment & Recommendations** (or **View Care & Prevention** for a healthy leaf).
4. The treatment screen opens separately and includes a small **English / اردو** selector.
5. Treatment shows: **what to do today**, field questions, symptoms, why disease occurs, how it spreads, prevention, medicine reference entries, safety advice, and follow-up.
6. Farmer's answers to three field questions can change the urgency and precautions shown during this session. They are **not yet saved** in scan history.
7. Saved reports in History can open the treatment screen too.

## Decision rules

The four trained disease classes are **Alternaria Leaf Spot**, **Early Leaf Spot**, **Late Leaf Spot** and **Rust**, plus Healthy Leaf.

The app stores **16 action rules** = 4 diseases × 4 levels:

- **Low:** 0% < leaf-area estimate ≤ 25%
- **Mild:** 25% < estimate ≤ 50%
- **Moderate:** 50% < estimate ≤ 75%
- **Severe:** 75% < estimate ≤ 100%

Healthy does not receive disease severity or fungicide advice. An uncertain/unsupported result should not show treatment. A diseased-class prediction with 0% detected affected area becomes **uncertain**; it must not be prescribed a chemical treatment.

**Important:** These categories are project-defined descriptions of a single photo, **not approved fungicide dosage or spray decision thresholds**. Even a Low case can need prompt inspection if rust or field-wide spread is suspected.

## Medicine information and limitations

The catalog stores 4 Pakistan-market **research examples**, not automatically approved sprays:

| Candidate product | Source/evidence boundary |
| --- | --- |
| FMC Soduku | Manufacturer mentions peanut leaf spot; current pack label and exact disease instructions must be verified |
| Bayer Nativo | Groundnut leaf spot referenced in BARI Chakwal material; current Pakistan groundnut label not established here |
| Jaffer Greenopas | General rust reference; **groundnut rust use NOT verified** |
| UPL Evito | Alternaria/rust references on other crops; **NOT a verified groundnut option** |

Medicines cannot be dosed according to estimated image severity. **Do not** offer application rates, repeat intervals or harvest waiting periods until confirmed on an approved current Pakistan groundnut-specific product label.

Reference sources are linked from the relevant records in `mobile/src/data/medicineCatalog.js` and the Supabase migration.

## Data sources

- Bundled explanations: `mobile/src/data/diseaseCare.js`
- 16 action rules and field urgency: `mobile/src/data/severityRules.js`
- Research product references: `mobile/src/data/medicineCatalog.js`
- Database lookup with local fallback: `mobile/src/services/recommendationService.js`
- Farmer screen: `mobile/src/screens/TreatmentScreen.js`
- Supabase seed migration: `database/migrations/20261124_create_recommendation_catalog.sql`

The three read-only Supabase tables are `diseases`, `severity_recommendations` and `medicines`. Run the actual contents of the migration in Supabase SQL Editor if the tables are not set up.

## Community feature

**Share to Community is not active yet.** It shows **Community Coming Soon** and does not upload, publish or share a photo. The Community tab is also a coming-soon screen. The older `CommunityDraftScreen` flow has been removed.

## Validation checklist

- [ ] Check all four diseases at all four severity levels.
- [ ] Test English and Urdu text in all sections on a real phone.
- [ ] Verify Healthy Leaf receives prevention only.
- [ ] Verify uncertain result and disease + 0% do not offer treatment.
- [ ] Review older saved reports for zero-severity disease records.
- [ ] Test weather, many affected plants, and previously sprayed questions.
- [ ] Verify research-only medicine products are **not presented as approved groundnut spray instructions**.
- [ ] Verify no Community post or image is uploaded.

## Future work

- Validate crop-specific disease management in Pakistan with agricultural research/extension experts.
- Confirm actual current pesticide registrations/labels before including spray rates or application schedules.
- Save field answers, advice version and source review date with each scan.
- Add a dependable groundnut-leaf validator before using treatment advice in the field.

For installation and database details, refer to [`../README.md`](../README.md) and [`../database/README.md`](../database/README.md).
