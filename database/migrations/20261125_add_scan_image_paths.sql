-- PlantPulse AI — saved original photo and visualization paths
-- Run in Supabase Dashboard > SQL Editor on EXISTING installations of
-- 20261124_create_scan_history.sql. Safe to run more than once.
-- The mobile app's scanSaveService.js already writes these three fields.

ALTER TABLE public.scan_history
    ADD COLUMN IF NOT EXISTS original_image_path TEXT,
    ADD COLUMN IF NOT EXISTS affected_overlay_path TEXT,
    ADD COLUMN IF NOT EXISTS heatmap_path TEXT;

-- Image bytes are stored privately in Supabase Storage bucket 'plant-scans'.
-- These fields contain STORAGE PATHS only, never public object URLs.
-- Protect the Storage bucket with policies tied to auth.uid().
