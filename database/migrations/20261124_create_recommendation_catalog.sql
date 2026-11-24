-- PlantPulse AI: researched recommendation catalog (read-only for signed-in farmers).
-- Run once in Supabase SQL Editor AFTER review. Existing scan history is unchanged.
-- IMPORTANT: These are scouting and early-intervention actions, NOT approved spray thresholds.
-- Product entries are leads, not prescriptions. label_dose stays NULL until
-- a Pakistan-registered groundnut-specific product label is checked.

create table if not exists public.diseases (
  code text primary key,
  name_en text not null,
  name_ur text not null,
  cause_en text not null,
  cause_ur text not null,
  prevention_en text not null,
  prevention_ur text not null,
  source_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.severity_recommendations (
  disease_code text not null references public.diseases(code) on delete cascade,
  severity_level text not null check (severity_level in ('Low','Mild','Moderate','Severe')),
  priority text not null check (priority in ('watch','prompt','urgent')),
  action_en text not null,
  action_ur text not null,
  follow_up_en text not null,
  follow_up_ur text not null,
  rule_version text not null default '2026-11-24.2',
  primary key (disease_code, severity_level)
);

create table if not exists public.medicines (
  id text primary key,
  brand_name text not null,
  manufacturer text not null,
  active_ingredient text,
  disease_codes text[] not null default '{}',
  crop_claim_status text not null check (
    crop_claim_status in (
      'manufacturer_peanut_leaf_spot',
      'extension_reference_label_unverified',
      'other_crop_only',
      'groundnut_label_unverified'
    )
  ),
  verified_pakistan_groundnut_label boolean not null default false,
  label_dose text,
  label_spray_interval text,
  precautions_en text not null,
  precautions_ur text not null,
  source_url text not null,
  last_reviewed_on date not null default current_date
);

alter table public.diseases enable row level security;
alter table public.severity_recommendations enable row level security;
alter table public.medicines enable row level security;
grant usage on schema public to authenticated;
grant select on public.diseases, public.severity_recommendations, public.medicines to authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'diseases' and policyname = 'Farmers read disease care') then
    create policy "Farmers read disease care" on public.diseases for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'severity_recommendations' and policyname = 'Farmers read severity care') then
    create policy "Farmers read severity care" on public.severity_recommendations for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'medicines' and policyname = 'Farmers read medicine information') then
    create policy "Farmers read medicine information" on public.medicines for select to authenticated using (true);
  end if;
end $$;

insert into public.diseases (code, name_en, name_ur, cause_en, cause_ur, prevention_en, prevention_ur, source_url) values
('early leaf spot','Early Leaf Spot','ارلی لیف اسپاٹ','Leaf-spot fungus; rain and humidity help infection spread.','پھپھوندی سے بیماری ہوتی ہے؛ بارش اور نمی پھیلاؤ بڑھاتی ہیں۔','Monitor lower leaves, rotate crops, and manage infected crop remains.','نچلے پتے دیکھیں، فصل بدلیں اور متاثرہ باقیات سنبھالیں۔','https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts'),
('late leaf spot','Late Leaf Spot','لیٹ لیف اسپاٹ','A fungal leaf disease that grows during wet weather and can lead to leaf fall.','یہ پھپھوندی کی بیماری ہے، نمی میں بڑھتی ہے اور پتے گرا سکتی ہے۔','Inspect lower leaves, manage crop debris, and rotate groundnut fields.','نچلے پتے دیکھیں، فصل کی باقیات سنبھالیں اور فصل بدلیں۔','https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts'),
('rust','Rust','رسٹ','Rust fungus produces wind-spread orange-brown spores.','رسٹ کی پھپھوندی کے جراثیم ہوا سے پھیل سکتے ہیں۔','Inspect the underside of leaves regularly and use locally suitable crop practices.','پتوں کی نچلی سطح دیکھیں اور مناسب مقامی زرعی طریقوں پر عمل کریں۔','https://apps.lucidcentral.org/ppp/text/web_full/entities/peanut_rust_034.htm'),
('alternaria leaf spot','Alternaria Leaf Spot','الٹرنیریا لیف اسپاٹ','Alternaria fungi may cause dark spots under favorable damp conditions.','الٹرنیریا پھپھوندی نمی میں پتوں پر گہرے دھبے بنا سکتی ہے۔','Use healthy seed, manage infected remains, rotate crops, and confirm uncertain damage.','صحت مند بیج لیں، باقیات سنبھالیں، فصل بدلیں اور مشکوک بیماری کی تصدیق کریں۔','https://www.apsnet.org/edcenter/resources/commonnames/Pages/Peanut.aspx'),
('healthy','Healthy Leaf','صحت مند پتہ','No trained disease detected in this image; the entire field may still have problems.','اس تصویر میں سیکھی ہوئی بیماری نہیں ملی؛ باقی کھیت پھر بھی متاثر ہو سکتا ہے۔','Monitor several plants and follow good planting and field hygiene practices.','کئی پودے چیک کریں اور اچھی کاشت و صفائی اختیار کریں۔','https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts')
on conflict (code) do nothing;

insert into public.severity_recommendations
(disease_code,severity_level,priority,action_en,action_ur,follow_up_en,follow_up_ur) values
('early leaf spot','Low','watch','Check lower leaves and nearby plants today; look for new spots.','آج نچلے پتے اور قریبی پودوں پر نئے دھبے دیکھیں۔','Check again after rain and in a few days.','بارش کے بعد اور چند دن میں دوبارہ دیکھیں۔'),
('early leaf spot','Mild','prompt','Inspect several parts of the field and ask whether protective treatment is needed.','کھیت کے کئی حصے دیکھیں اور حفاظتی دوا کی ضرورت پوچھیں۔','Record new spots and affected plants.','نئے دھبوں اور متاثرہ پودوں کا ریکارڈ رکھیں۔'),
('early leaf spot','Moderate','urgent','Arrange prompt whole-field assessment to protect healthy leaves.','صحت مند پتوں کی حفاظت کے لیے جلد کھیت کا معائنہ کروائیں۔','Watch for new damage or leaf fall.','نئے نقصان یا پتے گرنے پر نظر رکھیں۔'),
('early leaf spot','Severe','urgent','Seek urgent guidance on crop-wide leaf loss and remaining healthy growth.','پورے کھیت کے نقصان اور باقی صحت مند پودوں کے لیے فوری مشورہ لیں۔','Old spots will not turn green again; monitor new growth.','پرانے دھبے سبز نہیں ہوتے؛ نئی بڑھوتری چیک کریں۔'),
('late leaf spot','Low','prompt','Inspect the lower canopy across the field promptly.','جلد کھیت کے نچلے پتوں کو چیک کریں۔','Look for new dark spots after wet weather.','نمی کے بعد نئے گہرے دھبے چیک کریں۔'),
('late leaf spot','Mild','prompt','Check many plants and seek timely advice if spots or leaf fall increase.','زیادہ پودے دیکھیں؛ دھبے یا پتے گرنے بڑھیں تو جلد مشورہ لیں۔','Recheck new symptoms and leaf fall.','نئی علامات اور پتے گرنے کو دوبارہ دیکھیں۔'),
('late leaf spot','Moderate','urgent','Seek prompt field advice to protect remaining healthy foliage.','باقی صحت مند پتوں کی حفاظت کے لیے جلد زرعی مشورہ لیں۔','Track infections and leaf loss throughout the field.','کھیت میں نئے دھبوں اور پتے گرنے کا ریکارڈ رکھیں۔'),
('late leaf spot','Severe','urgent','Request urgent crop assessment of widespread disease and defoliation.','شدید بیماری اور پتے گرنے کے لیے فوری فصل کا معائنہ کروائیں۔','Monitor remaining growth for new infection.','باقی بڑھوتری پر نئے دھبے دیکھیں۔'),
('rust','Low','prompt','Check nearby leaf undersides immediately for orange powdery spots.','فوراً قریبی پتوں کی نچلی سطح پر نارنجی دھبے دیکھیں۔','Inspect nearby plants again soon.','قریبی پودے جلد دوبارہ چیک کریں۔'),
('rust','Mild','urgent','Seek prompt rust confirmation and approved protection advice.','رسٹ کی جلد تصدیق اور منظور شدہ حفاظت کا مشورہ لیں۔','Track newly affected plants and powdery spots.','نئے متاثرہ پودوں اور پاؤڈر والے دھبوں کو دیکھیں۔'),
('rust','Moderate','urgent','Arrange urgent rust assessment and ask about protecting healthy growth.','فوری رسٹ معائنہ کروائیں اور صحت مند پودوں کی حفاظت پوچھیں۔','Monitor rapid spread; a leaf-spot spray may not control rust.','تیز پھیلاؤ دیکھیں؛ لیف اسپاٹ کی دوا رسٹ کے لیے ضروری نہیں کہ درست ہو۔'),
('rust','Severe','urgent','Request immediate field-level guidance to protect remaining plants.','باقی پودوں کی حفاظت کے لیے فوری کھیت کا مشورہ لیں۔','Watch remaining healthy leaves for rust pustules.','باقی صحت مند پتوں پر رسٹ کے دھبے دیکھیں۔'),
('alternaria leaf spot','Low','watch','Check more leaves today to confirm the appearance of spots.','آج مزید پتوں پر دھبوں کی تصدیق کریں۔','Look for new damage in a few days.','چند دن بعد نیا نقصان دیکھیں۔'),
('alternaria leaf spot','Mild','prompt','Inspect neighboring plants and confirm disease before spraying.','قریبی پودے چیک کریں اور سپرے سے پہلے بیماری کی تصدیق کریں۔','Record new damaged areas.','نئے خراب حصوں کا ریکارڈ رکھیں۔'),
('alternaria leaf spot','Moderate','urgent','Seek prompt diagnosis and protection advice; other causes may look similar.','جلد تشخیص اور حفاظت کا مشورہ لیں؛ دوسری وجوہات بھی ہو سکتی ہیں۔','Inspect new leaves and tips.','نئے پتوں اور سروں کو چیک کریں۔'),
('alternaria leaf spot','Severe','urgent','Request urgent confirmation and field assessment for heavy damage.','شدید نقصان کے لیے فوری تصدیق اور کھیت کا معائنہ کروائیں۔','Track new damage and remaining healthy growth.','نئے نقصان اور باقی صحت مند بڑھوتری کو دیکھیں۔')
on conflict (disease_code,severity_level) do nothing;

insert into public.medicines
(id,brand_name,manufacturer,active_ingredient,disease_codes,crop_claim_status,verified_pakistan_groundnut_label,label_dose,label_spray_interval,precautions_en,precautions_ur,source_url) values
('soduku','Soduku SC','FMC Pakistan','Chlorothalonil 10.5% + Tebuconazole 31.5%',array['early leaf spot','late leaf spot'],'manufacturer_peanut_leaf_spot',false,null,null,
 'FMC Pakistan lists peanut leaf spot; verify the bottle label, actual use and precautions before applying.',
 'FMC پاکستان نے مونگ پھلی کے لیف اسپاٹ کو درج کیا ہے؛ استعمال سے پہلے اصل بوتل کا لیبل چیک کریں.',
 'https://ag.fmc.com/pk/en/products/fungicides/soduku'),
('nativo','Nativo 75 WG','Bayer','Tebuconazole + Trifloxystrobin',array['early leaf spot','late leaf spot'],'extension_reference_label_unverified',false,null,null,
 'BARI Chakwal referenced this for groundnut leaf spot; current groundnut crop label still needs verification.',
 'باری چکوال نے اس کا ذکر کیا ہے مگر موجودہ پاکستانی لیبل کی تصدیق درکار ہے.',
 'https://barichakwal.punjab.gov.pk/system/files/Groundnut%20report_1.pdf'),
('greenopas','Greenopas 17% SE','Jaffer Agro Services','Check current product label',array['rust'],'groundnut_label_unverified',false,null,null,
 'Pakistan-market general rust product; use on groundnut is NOT verified. Do not spray from this listing.',
 'پاکستان میں رسٹ کے لیے عام دوا مگر مونگ پھلی کے استعمال کی تصدیق نہیں۔ اس بنیاد پر سپرے نہ کریں.',
 'https://www.jaffer.com/jaspl/product/131/greenopas-17-se/'),
('evito','Evito 48% SC','UPL Pakistan','Fluoxastrobin',array['alternaria leaf spot'],'other_crop_only',false,null,null,
 'UPL lists Alternaria on soybean and other crops, not groundnut. Not a groundnut recommendation.',
 'UPL کی فہرست میں دوسری فصلیں ہیں، مونگ پھلی نہیں۔ یہ مونگ پھلی کے لیے تجویز نہیں۔',
 'https://pk.uplcorp.com/product-details/evito')
on conflict (id) do nothing;

-- Review the actual Pakistani product label and registration before ever
-- setting verified_pakistan_groundnut_label = true or providing a dose.
-- No app feature should automatically prescribe based on severity % alone.
