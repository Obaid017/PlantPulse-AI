// Research-informed, non-prescriptive care information for groundnut farmers.
// Versioned so advice can later be reviewed, localized and stored as a scan snapshot.
// NEVER infer a spray dose from an image or from the percentage of one affected leaf.
export const CARE_GUIDE_VERSION = '2026-11-24.v1';

const leafSpotMedicine = {
  en: 'A Pakistan-market example is FMC Soduku (chlorothalonil + tebuconazole). FMC Pakistan lists it for peanut leaf spot. This does not verify a dose or confirm separate early/late leaf-spot label claims. Before spraying, ask an authorized dealer or agriculture officer to check the current Pakistan groundnut label, timing, precautions and harvest waiting period.',
  ur: 'پاکستان میں FMC کی سوڈوکو دوا مونگ پھلی کے لیف اسپاٹ کے لیے درج ہے۔ لیکن صرف ایپ کی تصویر دیکھ کر دوا یا مقدار طے نہ کریں۔ سپرے سے پہلے زرعی ماہر یا مستند ڈیلر سے موجودہ پاکستانی لیبل، مقدار، حفاظتی ہدایات اور کٹائی سے پہلے وقفہ ضرور چیک کریں۔',
};

export const diseaseCare = {
  'early leaf spot': {
    name: 'Early Leaf Spot',
    cause: {
      en: 'A leaf-spot fungus infects groundnut leaves. The fungus can survive in infected crop remains, while warm, wet weather helps new infections develop.',
      ur: 'یہ بیماری پتوں کو لگنے والی پھپھوندی سے ہوتی ہے۔ متاثرہ فصل کی باقیات میں جراثیم رہ سکتے ہیں اور گرم، نم موسم میں بیماری بڑھ سکتی ہے۔',
    },
    signs: {
      en: 'Small brown leaf spots, often with a yellow ring. More spots may appear on lower leaves first.',
      ur: 'پتوں پر چھوٹے بھورے دھبے، اکثر اردگرد پیلا حلقہ۔ پہلے نچلے پتوں کو بھی چیک کریں۔',
    },
    spread: {
      en: 'Rain splash, wind and long periods of wet leaves can help spores spread.',
      ur: 'بارش کے چھینٹے، ہوا اور پتوں پر دیر تک نمی رہنے سے بیماری پھیل سکتی ہے۔',
    },
    now: {
      en: 'Check lower leaves and nearby plants today. Note whether fresh spots are appearing, especially after rain. If several plants are affected, seek a field-level assessment promptly.',
      ur: 'آج ہی نچلے پتوں اور آس پاس کے پودوں کو دیکھیں۔ بارش کے بعد نئے دھبوں پر نظر رکھیں۔ کئی پودے متاثر ہوں تو جلد زرعی ماہر سے کھیت کا معائنہ کروائیں۔',
    },
    prevent: {
      en: 'Rotate groundnut with other crops, manage old infected crop remains after harvest, and use locally suitable disease-tolerant varieties when available.',
      ur: 'مونگ پھلی کے بعد دوسری فصل لگائیں، کٹائی کے بعد متاثرہ باقیات مناسب طریقے سے سنبھالیں اور دستیاب ہو تو بیماری برداشت کرنے والی قسم کاشت کریں۔',
    },
    medicine: leafSpotMedicine,
    followUp: {
      en: 'Recheck the field within a few days and sooner if wet weather continues. Look for NEW spots and more affected plants; existing brown spots may not disappear.',
      ur: 'چند دن میں دوبارہ کھیت دیکھیں، اور مسلسل نمی ہو تو پہلے چیک کریں۔ نئے دھبوں اور زیادہ متاثرہ پودوں کو دیکھیں؛ پرانے بھورے دھبے فوراً ختم نہیں ہوتے۔',
    },
    whenToAsk: {
      en: 'Ask an agriculture officer if spots spread to several plants, leaves start falling, or you need a decision about fungicide use.',
      ur: 'کئی پودوں پر دھبے پھیلیں، پتے گرنے لگیں یا سپرے کا فیصلہ کرنا ہو تو زرعی ماہر سے رابطہ کریں۔',
    },
    sources: [
      'https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts',
      'https://ag.fmc.com/pk/en/products/fungicides/soduku',
    ],
  },
  'late leaf spot': {
    name: 'Late Leaf Spot',
    cause: {
      en: 'A different leaf-spot fungus infects groundnut leaves. Spores can build up when the crop canopy stays damp, especially during humid or rainy conditions.',
      ur: 'یہ دوسری قسم کی پھپھوندی سے ہونے والی پتوں کی بیماری ہے۔ مرطوب اور بارش والے موسم میں پتے دیر تک گیلے رہیں تو بیماری بڑھ سکتی ہے۔',
    },
    signs: {
      en: 'Dark brown to nearly black spots. Check leaf undersides too; severe infection may cause early leaf fall.',
      ur: 'گہرے بھورے یا تقریباً کالے دھبے۔ پتوں کی نچلی سطح بھی چیک کریں؛ زیادہ بیماری میں پتے وقت سے پہلے گر سکتے ہیں۔',
    },
    spread: {
      en: 'Spores can spread from infected leaves and crop remains through wind and rain. Dense, wet foliage increases risk.',
      ur: 'متاثرہ پتوں اور فصل کی باقیات سے جراثیم ہوا اور بارش کے ذریعے پھیل سکتے ہیں۔ گھنے اور نم پتے خطرہ بڑھاتے ہیں۔',
    },
    now: {
      en: 'Inspect several plants across the field, including lower leaves. If new spots are spreading or leaves are falling, contact a local agriculture officer without delay.',
      ur: 'کھیت کے مختلف حصوں میں کئی پودے اور نچلے پتے دیکھیں۔ نئے دھبے بڑھیں یا پتے گریں تو فوراً زرعی ماہر سے رابطہ کریں۔',
    },
    prevent: {
      en: 'Avoid growing groundnut repeatedly in the same field, manage infected residues, use suitable varieties and monitor more often during rainy weather.',
      ur: 'ایک ہی کھیت میں مسلسل مونگ پھلی نہ لگائیں، متاثرہ باقیات کا خیال رکھیں، مناسب قسم کاشت کریں اور بارش کے موسم میں زیادہ معائنہ کریں۔',
    },
    medicine: leafSpotMedicine,
    followUp: {
      en: 'Inspect again within a few days. Record whether new leaves develop spots or more plants lose leaves; act earlier if spread is rapid.',
      ur: 'چند دن بعد دوبارہ چیک کریں۔ دیکھیں نئے پتوں پر دھبے یا مزید پتے گر تو نہیں رہے؛ بیماری تیزی سے بڑھے تو جلد کارروائی کریں۔',
    },
    whenToAsk: {
      en: 'Seek prompt help if spots are increasing across the field, leaves fall, or a locally approved fungicide decision is needed.',
      ur: 'دھبے پورے کھیت میں بڑھ رہے ہوں، پتے گر رہے ہوں یا دوا کا انتخاب کرنا ہو تو جلد مدد لیں۔',
    },
    sources: [
      'https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts',
      'https://ag.fmc.com/pk/en/products/fungicides/soduku',
    ],
  },
  rust: {
    name: 'Rust',
    cause: {
      en: 'The rust fungus (Puccinia arachidis) infects groundnut plants. Moist weather helps infection and wind can carry spores to other plants.',
      ur: 'مونگ پھلی کی رسٹ بیماری ایک خاص پھپھوندی سے ہوتی ہے۔ نمی میں انفیکشن بڑھتا ہے اور ہوا جراثیم دوسرے پودوں تک پہنچاتی ہے۔',
    },
    signs: {
      en: 'Tiny orange-brown, powdery raised spots, especially on the underside of leaves.',
      ur: 'خاص طور پر پتوں کی نچلی سطح پر چھوٹے نارنجی بھورے، پاؤڈر جیسے ابھرے ہوئے دھبے۔',
    },
    spread: {
      en: 'Wind-borne spores can reach nearby plants and fields. Humid conditions can favor new infections.',
      ur: 'جراثیم ہوا سے قریبی پودوں اور کھیتوں میں جا سکتے ہیں۔ مرطوب موسم میں نئے دھبے بڑھ سکتے ہیں۔',
    },
    now: {
      en: 'Check the undersides of leaves on nearby plants today. Rust can spread quickly, so ask an agriculture officer for prompt field advice.',
      ur: 'آج ہی قریبی پودوں کے پتوں کی نچلی سطح دیکھیں۔ رسٹ جلد پھیل سکتی ہے، اس لیے فوری زرعی مشورہ حاصل کریں۔',
    },
    prevent: {
      en: 'Inspect the crop regularly, especially during humid weather, and follow locally recommended disease-management and variety guidance.',
      ur: 'خاص طور پر نمی والے موسم میں فصل کا باقاعدہ معائنہ کریں اور مقامی زرعی ہدایات کے مطابق بیماری کا انتظام کریں۔',
    },
    medicine: {
      en: 'A Pakistan-labeled fungicide specifically verified for groundnut rust has not yet been added to this guide. Do not assume every leaf-spot product controls rust. Ask a qualified agriculture officer to confirm a registered choice and its label.',
      ur: 'اس گائیڈ میں ابھی مونگ پھلی کی رسٹ کے لیے تصدیق شدہ پاکستانی لیبل والی دوا شامل نہیں۔ لیف اسپاٹ کی ہر دوا رسٹ کے لیے مناسب نہیں ہوتی۔ منظور شدہ دوا اور ہدایات زرعی ماہر سے معلوم کریں۔',
    },
    followUp: {
      en: 'Inspect again soon, especially after wet or humid weather. Watch for fresh powdery spots on additional plants.',
      ur: 'جلد دوبارہ معائنہ کریں، خاص طور پر نمی کے بعد۔ دوسرے پودوں پر نئے پاؤڈر جیسے دھبوں کو دیکھیں۔',
    },
    whenToAsk: {
      en: 'Seek prompt field advice whenever rust is suspected, especially if several plants have powdery orange-brown pustules.',
      ur: 'رسٹ کا شبہ ہو تو جلد زرعی مشورہ لیں، خاص طور پر جب کئی پودوں پر بھورے نارنجی ابھرے دھبے ہوں۔',
    },
    sources: [
      'https://apps.lucidcentral.org/ppp/text/web_full/entities/peanut_rust_034.htm',
      'https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts',
    ],
  },
  'alternaria leaf spot': {
    name: 'Alternaria Leaf Spot',
    cause: {
      en: 'Alternaria fungi can cause spots and blighted areas on groundnut leaves. Humid weather and wet foliage may favor disease development.',
      ur: 'الٹرنیریا نام کی پھپھوندی مونگ پھلی کے پتوں پر دھبے اور سوکھے حصے بنا سکتی ہے۔ نمی اور گیلے پتوں سے بیماری بڑھ سکتی ہے۔',
    },
    signs: {
      en: 'Irregular brown spots or dark damaged areas. Similar-looking leaf damage can have other causes, so check several leaves.',
      ur: 'بے ترتیب بھورے دھبے یا سوکھے حصے۔ دوسری وجوہات سے بھی ایسے نشان ہو سکتے ہیں، اس لیے کئی پتے دیکھیں۔',
    },
    spread: {
      en: 'Fungal spores may spread under favorable wet, humid conditions; infected plant material may contribute to future disease pressure.',
      ur: 'نم موسم میں پھپھوندی کے جراثیم پھیل سکتے ہیں اور متاثرہ پودوں کی باقیات اگلی فصل کے لیے خطرہ بڑھا سکتی ہیں۔',
    },
    now: {
      en: 'Check more leaves and nearby plants. Do not select a chemical only from the photo: confirm the symptoms with a local agriculture officer if damage is spreading.',
      ur: 'مزید پتے اور قریبی پودے چیک کریں۔ صرف تصویر کی بنیاد پر دوا نہ چنیں؛ نشان بڑھیں تو مقامی زرعی ماہر سے تصدیق کروائیں۔',
    },
    prevent: {
      en: 'Use healthy seed, maintain good crop hygiene, manage infected remains, and avoid repeated groundnut planting in the same field.',
      ur: 'صحت مند بیج استعمال کریں، کھیت صاف رکھیں، متاثرہ باقیات سنبھالیں اور ایک ہی کھیت میں مسلسل مونگ پھلی نہ لگائیں۔',
    },
    medicine: {
      en: 'No Pakistan-verified groundnut Alternaria fungicide label has been approved for automatic recommendation in this guide. A local agriculture officer should confirm the diagnosis and labeled product before any application.',
      ur: 'اس گائیڈ میں الٹرنیریا کے لیے تصدیق شدہ پاکستانی دوا ابھی موجود نہیں۔ سپرے سے پہلے زرعی ماہر سے بیماری اور منظور شدہ دوا کی تصدیق کریں۔',
    },
    followUp: {
      en: 'Check the crop again in a few days. Compare fresh spots on neighboring leaves rather than relying only on the old damaged areas.',
      ur: 'چند دن بعد دوبارہ چیک کریں۔ صرف پرانے نشان نہیں بلکہ قریبی پتوں پر نئے دھبے دیکھیں۔',
    },
    whenToAsk: {
      en: 'Get expert help if symptoms spread quickly, leaf tips die back, or the diagnosis is uncertain.',
      ur: 'نشان تیزی سے بڑھیں، پتے کے کنارے سوکھیں یا بیماری واضح نہ ہو تو زرعی ماہر سے مدد لیں۔',
    },
    sources: [
      'https://www.plantix.net/en/library/plant-diseases/100184/alternaria-leaf-spot-peanut/',
      'https://www.apsnet.org/edcenter/resources/commonnames/Pages/Peanut.aspx',
    ],
  },
  healthy: {
    name: 'Healthy Leaf',
    cause: {
      en: 'The model did not identify one of its trained diseases in this photo. This does not guarantee that the entire field is disease-free.',
      ur: 'اس تصویر میں ماڈل کو اپنی سیکھی ہوئی بیماریوں میں سے کوئی بیماری نظر نہیں آئی۔ اس کا مطلب یہ نہیں کہ پورا کھیت لازماً بیماری سے پاک ہے۔',
    },
    signs: {
      en: 'No recognized disease signs in this photographed leaf.',
      ur: 'اس تصویر والے پتے پر ماڈل کی پہچانی ہوئی بیماری کی علامات نہیں ملیں۔',
    },
    spread: {
      en: 'There is no confirmed disease in this scan. Continue to watch for new spots on other plants.',
      ur: 'اس سکین میں بیماری کی تصدیق نہیں ہوئی۔ دوسرے پودوں پر نئے دھبوں کو دیکھتے رہیں۔',
    },
    now: {
      en: 'Keep checking a few plants across the field, not just one leaf.',
      ur: 'صرف ایک پتے کے بجائے کھیت کے مختلف حصوں سے چند پودے چیک کرتے رہیں۔',
    },
    prevent: {
      en: 'Use healthy seed, rotate crops, keep the field well managed, and inspect leaves regularly during wet weather.',
      ur: 'صحت مند بیج لیں، فصلوں کی تبدیلی کریں، کھیت کا خیال رکھیں اور نم موسم میں پتوں کا باقاعدہ معائنہ کریں۔',
    },
    medicine: {
      en: 'No fungicide is recommended solely because a scanned leaf appears healthy.',
      ur: 'صرف اس وجہ سے سپرے کی ضرورت نہیں کہ سکین میں پتہ صحت مند نظر آیا ہے۔',
    },
    followUp: {
      en: 'Scan again if you see new spots, powdery rust pustules or unusual leaf loss.',
      ur: 'نئے دھبے، رسٹ جیسے پاؤڈر والے نشان یا غیر معمولی پتے گرنے پر دوبارہ سکین کریں۔',
    },
    whenToAsk: {
      en: 'Ask an agriculture officer if the plant looks unhealthy even though the model says healthy.',
      ur: 'اگر ماڈل صحت مند بتائے لیکن پودا بیمار لگے تو زرعی ماہر سے مشورہ کریں۔',
    },
    sources: [
      'https://extension.okstate.edu/fact-sheets/foliar-diseases-of-peanuts',
    ],
  },
};

export function getDiseaseCare(diseaseName) {
  const key = String(diseaseName || '')
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (key === 'healthy leaf' || key === 'healthy') return diseaseCare.healthy;
  if (key === 'alternaria' || key === 'alternaria leaf spot') return diseaseCare['alternaria leaf spot'];
  if (key === 'early leaf spot') return diseaseCare['early leaf spot'];
  if (key === 'late leaf spot') return diseaseCare['late leaf spot'];
  if (key === 'rust') return diseaseCare.rust;
  return null;
}

export function getAffectedLeafNote(level, language = 'en') {
  const urgent = ['moderate', 'severe'].includes(String(level || '').toLowerCase());
  if (language === 'ur') {
    return urgent
      ? 'اس ایک پتے کا زیادہ حصہ متاثر دکھائی دیتا ہے۔ پورے کھیت کا جلد معائنہ کریں۔ صرف فیصد دیکھ کر سپرے کا فیصلہ نہ کریں۔'
      : 'یہ فیصد صرف تصویر والے پتے کا ہے، پورے کھیت کا نہیں۔ قریبی پودوں میں نئے دھبے دیکھیں۔';
  }
  return urgent
    ? 'Much of this scanned leaf looks discolored. Inspect the whole field promptly; a leaf percentage alone does not decide spraying.'
    : 'This percentage describes only the photographed leaf, not the whole field. Check nearby plants for new spots.';
}
