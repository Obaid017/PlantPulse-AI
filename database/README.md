# PlantPulse AI — Supabase database and storage

**Status: implemented for authentication, scan history, and treatment reference data.** The Community Hub has not been implemented. This document describes the repository as of 25 November 2026.

## Services in use

- **Supabase Auth** — email/password sign-up and sign-in; `full_name` is saved as user metadata.
- **Supabase PostgreSQL** — `scan_history`, `diseases`, `severity_recommendations`, and `medicines`.
- **Supabase Storage** — a **private** bucket named `plant-scans` for original images, affected-region overlays, and heatmaps.
- **Row Level Security** — scan records are scoped to the signed-in user. Disease and treatment reference data can be read by authenticated users.

## SQL migrations, in execution order

Open **Supabase Dashboard → SQL Editor**. Open each file locally, copy its **SQL contents**, paste into the editor and click **Run**. A file path alone is not SQL.

1. [`migrations/20261124_create_scan_history.sql`](migrations/20261124_create_scan_history.sql) — create the `scan_history` table with per-user SELECT/INSERT RLS policies.
2. [`migrations/20261125_add_scan_image_paths.sql`](migrations/20261125_add_scan_image_paths.sql) — add `original_image_path`, `affected_overlay_path`, and `heatmap_path`. This uses `IF NOT EXISTS` and may be rerun safely.
3. [`migrations/20261124_create_recommendation_catalog.sql`](migrations/20261124_create_recommendation_catalog.sql) — create `diseases`, `severity_recommendations`, `medicines` and seed 5 plant classes, 16 severity rules and 4 medicine **research** records.

The first migration creates named policies without an existence check: **do not rerun the first script if those policies already exist**. Do not delete and recreate your database simply to apply later changes. The image-path migration is safe for installations where the columns were added manually earlier.

### Verify the tables

```sql
SELECT 'scan_history' AS table_name, COUNT(*) AS rows FROM public.scan_history
UNION ALL SELECT 'diseases', COUNT(*) FROM public.diseases
UNION ALL SELECT 'severity_recommendations', COUNT(*) FROM public.severity_recommendations
UNION ALL SELECT 'medicines', COUNT(*) FROM public.medicines;
```

Expected initial reference counts: **5** diseases/classes, **16** severity rules and **4** medicine entries; the count for `scan_history` depends on actual user scans.

Check image fields:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'scan_history'
  AND column_name IN (
    'original_image_path',
    'affected_overlay_path',
    'heatmap_path'
  )
ORDER BY column_name;
```

## Private `plant-scans` bucket

Create a bucket called **`plant-scans`** with **Public bucket turned OFF**. The mobile app stores files using a path beginning with `<auth-user-uuid>/...` and reads them using short-lived signed URLs.

**Bucket creation alone is not enough.** Configure Supabase Storage RLS policies so authenticated users can upload, read and remove **only objects inside their own user-ID prefix**. Do not create anonymous public-read or broadly writable policies for user scans. Confirm policies in Supabase Dashboard before testing with multiple accounts.

The SQL migrations above create database tables and policies; **they do not create Storage bucket access policies**. Those must be configured separately.

## How the app uses the data

- `mobile/src/services/scanSaveService.js`: uploads real scan images to Storage and inserts `scan_history`.
- `mobile/src/services/scanHistoryService.js`: reads a signed-in user's recent scan records.
- `mobile/src/services/recommendationService.js`: reads treatment catalog with bundled offline data as fallback.
- `mobile/src/screens/SavedScanDetailScreen.js`: loads an older report and its signed image URLs.

Accepted **healthy** and **diseased** predictions are stored; **uncertain** predictions are not saved as diagnoses.

## Not yet implemented

- Community posts, comments and media sharing
- Persisting field-question answers and versioned recommendation snapshots per scan
- Validated Pakistan-specific medicine label doses, spray intervals and crop-use approvals
- Backend-side JWT validation and production authorization safeguards

**Never** use a Supabase service-role/secret key in the Expo app. The `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is appropriate for the client, provided database and Storage RLS are correctly configured.
