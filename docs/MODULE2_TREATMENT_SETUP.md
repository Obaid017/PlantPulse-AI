# Module 2 — Farmer-first Groundnut Treatment and Prevention

## Goal

Detect possible groundnut leaf disease early, explain likely causes and give
practical advice to inspect the field before infection spreads. A single-leaf
color-based severity estimate is not the percentage of an entire field and
**must not** determine fungicide dose or frequency.

## Implemented

- 4 disease classes × 4 severity levels = 16 early-action rules.
- Low / Mild / Moderate / Severe are the EXISTING project categories.
- Healthy leaves receive prevention advice and no automatic fungicide.
- Uncertain predictions prompt a clearer picture, not chemical advice.
- View Treatment button after Scan results; also available for saved History reports.
- Treatment screen: bilingual English/Urdu switch, causes, symptoms, spread,
  prevention, medicine candidates, follow-up and agricultural escalation.
- Three optional field questions: how many plants, wet weather, previous spray.
- Pakistan-market product examples with visible evidence limitations:
  - FMC Soduku: manufacturer lists peanut leaf spot, **current pack label still required**.
  - Bayer Nativo: referenced by BARI Chakwal for groundnut leaf spot;
    present crop-label status still needs verification.
  - Jaffer Greenopas: Pakistan-market rust product, **groundnut use not verified**.
  - UPL Evito: manufacturer lists Alternaria on other crops, **NOT for groundnut based on this evidence**.
- Separate Community Draft route offers native TEXT sharing to a trusted person.
  It does **not** publish to the in-app community or attach a photo yet.

## How to deploy safely

1. Review and merge the pull request on GitHub into main.
2. In VS Code project root:
   `git pull origin main`
3. Open Supabase SQL Editor and paste the *contents*, not filename, of:
   `database/migrations/20261124_create_recommendation_catalog.sql`
4. Click Run. Check that three new tables exist:
   `diseases`, `severity_recommendations`, `medicines`.
   These are read-only to signed-in farmers through RLS.
5. In `mobile/` run `npx expo start --clear`.
6. Check a leaf, tap **View Treatment & Recommendations**, and test English/Urdu
   and the three field questions.
7. Open a saved History report and tap the same treatment option.

The mobile app includes built-in care data and will still show the treatment
guide if the SQL migration has not yet been executed or the network is offline.
Supabase rows override matching local disease, severity and medicine fields
once the catalog is installed. This enables controlled future updates.

## Test checklist

- Test all 4 diagnoses at Low, Mild, Moderate, and Severe (16 cases).
- Low rust should prompt faster field inspection than Low early leaf spot.
- A higher leaf percentage should NOT produce a higher chemical dose.
- Rain / many affected plants / already sprayed should change the field advice.
- No disease name, confidence or images should be simulated in production.
- No medicine is shown as Pakistan-label-verified unless pack labeling is checked.
- Old scan reports should open without a new ML inference.
- No recommendation should be automatically shown in the prediction result itself.
- Native share from Community Draft is text-only; no user content is published
  without explicit sharing.

## Still to implement and verify

- Farmer field question answers are currently local to the Treatment screen;
  their persistence in scan history is a later step.
- In-app community posts, comments and photo sharing are not implemented.
- Exact product registration and label-approved dose, timing, interval,
  re-entry and harvest waiting period require manufacturer/current-pack evidence
  and local agricultural review before being enabled.
- Human testing on Android / Expo Go is still required.

## Primary Pakistan research references

- FMC Pakistan Soduku: https://ag.fmc.com/pk/en/products/fungicides/soduku
- BARI Chakwal Groundnut Production:
  https://barichakwal.punjab.gov.pk/system/files/Groundnut%20report_1.pdf
- Bayer Pakistan Nativo:
  https://www.cropscience.bayer.com.pk/en-pk/products/product---detail-page.html/fungicides/nativo_75_wg.html
- Jaffer Greenopas:
  https://www.jaffer.com/jaspl/product/131/greenopas-17-se/
- UPL Pakistan Evito: https://pk.uplcorp.com/product-details/evito
