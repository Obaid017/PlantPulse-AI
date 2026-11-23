# Supabase database

Milestone 1 uses **Supabase Authentication** only. User email and `full_name`
are stored by Supabase Auth (`full_name` in user metadata).

Later migrations will add:
- profiles (user preferences)
- scan_history (user-owned scans and results)
- diseases / recommendations (reviewed treatment reference data)
- community_posts / comments (real user content)

Every private table will require Row Level Security (RLS). No fake records are
inserted here. Storage buckets for original photos and visualizations will also
be configured with access policies in a later milestone.
