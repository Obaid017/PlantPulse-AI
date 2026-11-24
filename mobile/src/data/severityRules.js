// Early-action guidance, NOT pesticide treatment thresholds.
// One photographed leaf's color-based severity is not field-level incidence.
// Each of the 16 disease × severity combinations has a distinct action.
export const RULES_VERSION = '2026-11-24.2';
export const SEVERITY_LEVELS = ['Low', 'Mild', 'Moderate', 'Severe'];

export const severityRules = {
  'early leaf spot': {
    Low: {
      priority: 'watch', 
      action: { en: 'Check lower leaves and nearby plants today. Mark any new spots and inspect again after rain.',
        ur: 'آج ہی نچلے پتے اور قریبی پودے دیکھیں۔ نئے دھبوں پر نظر رکھیں، خاص طور پر بارش کے بعد۔' },
      followUp: { en: 'Recheck within a few days; look for NEW spots, not just the old brown marks.',
        ur: 'چند دن بعد نئے دھبے چیک کریں۔ صرف پرانے نشان نہ دیکھیں۔' },
    },
    Mild: {
      priority: 'prompt',
      action: { en: 'Inspect several locations in the field for increasing spots. Ask an agriculture officer whether protective treatment is needed.',
        ur: 'کھیت کے مختلف حصے چیک کریں۔ دھبے بڑھ رہے ہوں تو زرعی ماہر سے حفاظتی سپرے کی ضرورت پوچھیں۔' },
      followUp: { en: 'Keep a simple record of new spots and affected plants; inspect more often in humid weather.',
        ur: 'نئے دھبوں اور متاثرہ پودوں کا ریکارڈ رکھیں۔ نم موسم میں زیادہ بار چیک کریں۔' },
    },
    Moderate: {
      priority: 'urgent',
      action: { en: 'Arrange a prompt field assessment. Check how many plants and lower leaves are affected; protect healthy growth using verified local advice.',
        ur: 'جلد کھیت کا معائنہ کروائیں۔ دیکھیں کتنے پودے متاثر ہیں اور درست مشورے سے صحت مند پتوں کو بچائیں۔' },
      followUp: { en: 'Watch for fresh lesions or leaf fall and seek help promptly if the area of infection increases.',
        ur: 'نئے دھبے یا پتے گرنے کو دیکھیں۔ بیماری بڑھے تو فوری مشورہ لیں۔' },
    },
    Severe: {
      priority: 'urgent',
      action: { en: 'Seek urgent agricultural assessment. Evaluate crop-wide leaf loss and whether remaining healthy foliage can be protected.',
        ur: 'فوری زرعی معائنہ کروائیں۔ پورے کھیت میں پتوں کے نقصان اور باقی صحت مند پودوں کو بچانے کا جائزہ لیں۔' },
      followUp: { en: 'Monitor the remaining healthy foliage; damaged spots do not turn green again after treatment.',
        ur: 'باقی صحت مند پتوں کو دیکھتے رہیں؛ پرانے خراب دھبے دوا سے دوبارہ سبز نہیں ہوتے۔' },
    },
  },
  'late leaf spot': {
    Low: {
      priority: 'prompt',
      action: { en: 'Check lower leaves throughout the field today; late leaf spot can build up during prolonged damp weather.',
        ur: 'آج ہی کھیت میں نچلے پتے دیکھیں۔ دیر تک نمی ہو تو لیٹ لیف اسپاٹ بڑھ سکتا ہے۔' },
      followUp: { en: 'Inspect again after wet weather and watch for new dark spots on surrounding plants.',
        ur: 'بارش یا نمی کے بعد دوبارہ چیک کریں اور قریبی پودوں پر نئے گہرے دھبے دیکھیں۔' },
    },
    Mild: {
      priority: 'prompt',
      action: { en: 'Inspect many plants and check whether spots are spreading or leaves dropping. Discuss approved protection promptly if spread is confirmed.',
        ur: 'زیادہ پودوں کو دیکھیں، دھبے پھیلیں یا پتے گریں تو جلد منظور شدہ حفاظتی دوا کا مشورہ لیں۔' },
      followUp: { en: 'Recheck soon for fresh spots and early leaf fall, especially after rainy days.',
        ur: 'جلد نئے دھبے اور پتے گرنے کو دیکھیں، خاص طور پر بارش کے بعد۔' },
    },
    Moderate: {
      priority: 'urgent',
      action: { en: 'Seek prompt field-level advice to protect remaining green leaves and review whether an approved fungicide is needed.',
        ur: 'باقی سبز پتوں کو بچانے کے لیے جلد زرعی مشورہ لیں اور منظور شدہ سپرے کی ضرورت معلوم کریں۔' },
      followUp: { en: 'Track new infections and leaf loss across several parts of the field.',
        ur: 'کھیت کے مختلف حصوں میں نئے دھبوں اور پتوں کے گرنے کا ریکارڈ رکھیں۔' },
    },
    Severe: {
      priority: 'urgent',
      action: { en: 'Request urgent crop assessment. Widespread leaf fall may require a different management decision than early leaf spot symptoms.',
        ur: 'فوری فصل کا معائنہ کروائیں۔ بہت زیادہ پتے گرنا ابتدائی بیماری سے مختلف انتظام مانگ سکتا ہے۔' },
      followUp: { en: 'Review whether new leaves are becoming infected; severe old damage cannot be repaired.',
        ur: 'دیکھیں نئے پتے متاثر تو نہیں ہو رہے۔ پرانا شدید نقصان واپس ٹھیک نہیں ہوتا۔' },
    },
  },
  rust: {
    Low: {
      priority: 'prompt',
      action: { en: 'Check leaf undersides on several nearby plants immediately for orange powdery spots. Rust can spread quickly by wind.',
        ur: 'فوراً قریبی پودوں کے پتوں کی نچلی سطح پر نارنجی پاؤڈر والے دھبے دیکھیں۔ رسٹ ہوا سے تیزی سے پھیل سکتی ہے۔' },
      followUp: { en: 'Check neighboring plants soon, particularly during humid weather.',
        ur: 'قریبی پودوں کو جلد دوبارہ دیکھیں، خاص طور پر نمی کے موسم میں۔' },
    },
    Mild: {
      priority: 'urgent',
      action: { en: 'Contact a local agriculture officer promptly; inspect several parts of the crop and confirm rust before choosing a labeled product.',
        ur: 'جلد زرعی ماہر سے رابطہ کریں۔ مختلف حصے دیکھیں اور منظور شدہ دوا سے پہلے رسٹ کی تصدیق کریں۔' },
      followUp: { en: 'Track newly affected plants and powdery pustules on leaf undersides.',
        ur: 'نئے متاثرہ پودوں اور پتوں کے نیچے پاؤڈر جیسے دھبوں کو دیکھیں۔' },
    },
    Moderate: {
      priority: 'urgent',
      action: { en: 'Arrange urgent rust assessment. Ask about protecting healthy foliage with a Pakistan-approved groundnut-rust product if available.',
        ur: 'رسٹ کا فوری معائنہ کروائیں۔ اگر مونگ پھلی کی رسٹ کے لیے منظور شدہ دوا دستیاب ہو تو صحت مند پتوں کی حفاظت کا مشورہ لیں۔' },
      followUp: { en: 'Monitor rapid spread and leaf loss. Do not assume a leaf-spot spray controls rust.',
        ur: 'بیماری کے تیز پھیلاؤ اور پتے گرنے کو دیکھیں۔ لیف اسپاٹ کی ہر دوا رسٹ کے لیے مناسب نہیں۔' },
    },
    Severe: {
      priority: 'urgent',
      action: { en: 'Seek immediate field-level guidance on extensive rust, crop stage and protection of remaining healthy plants.',
        ur: 'شدید رسٹ، فصل کے مرحلے اور باقی صحت مند پودوں کی حفاظت کے لیے فوری مشورہ لیں۔' },
      followUp: { en: 'Check remaining green plants for new rust pustules; treatment cannot restore dead leaf tissue.',
        ur: 'باقی سبز پودوں پر نئے رسٹ دھبے دیکھیں؛ سپرے مردہ پتے کو واپس ٹھیک نہیں کرتا۔' },
    },
  },
  'alternaria leaf spot': {
    Low: {
      priority: 'watch',
      action: { en: 'Compare more leaves today. Similar-looking spots can have other causes; mark the locations of fresh damage.',
        ur: 'آج مزید پتے دیکھیں۔ ایک جیسے دھبوں کی دوسری وجوہات بھی ہو سکتی ہیں، نئے نقصان کی جگہ نوٹ کریں۔' },
      followUp: { en: 'Recheck for new spots in a few days, particularly after prolonged damp weather.',
        ur: 'چند دن میں نئے دھبے چیک کریں، خاص طور پر مسلسل نمی کے بعد۔' },
    },
    Mild: {
      priority: 'prompt',
      action: { en: 'Inspect surrounding plants and confirm symptoms before any chemical decision. Ask a local expert if spots increase.',
        ur: 'قریبی پودے چیک کریں اور سپرے سے پہلے بیماری کی تصدیق کریں۔ دھبے بڑھیں تو ماہر سے پوچھیں۔' },
      followUp: { en: 'Record new dark areas and whether more plants are affected.',
        ur: 'نئے گہرے دھبوں اور زیادہ متاثرہ پودوں کا ریکارڈ رکھیں۔' },
    },
    Moderate: {
      priority: 'urgent',
      action: { en: 'Get prompt diagnosis to rule out other damage and review field hygiene and protection of healthy leaves.',
        ur: 'جلد بیماری کی درست تشخیص کروائیں، دوسری وجوہات دیکھیں اور صحت مند پتوں کی حفاظت کریں۔' },
      followUp: { en: 'Inspect new growth and leaf tips for worsening symptoms.',
        ur: 'نئے پتوں اور پتوں کے سروں پر بڑھتی علامات دیکھیں۔' },
    },
    Severe: {
      priority: 'urgent',
      action: { en: 'Request urgent agricultural review. Severe discoloration may have several causes and needs field confirmation.',
        ur: 'فوری زرعی معائنہ کروائیں۔ بہت زیادہ خراب پتے کئی وجوہات سے ہو سکتے ہیں، کھیت میں تصدیق ضروری ہے۔' },
      followUp: { en: 'Track new damage, leaf loss and remaining healthy growth.',
        ur: 'نئے نقصان، پتے گرنے اور باقی صحت مند بڑھوتری کو دیکھیں۔' },
    },
  },
};

export function normalizeDiseaseName(value) {
  const key = String(value || '').toLowerCase()
    .replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (key === 'alternaria') return 'alternaria leaf spot';
  return key;
}

export function getSeverityRule(diseaseName, severityLevel) {
  const disease = normalizeDiseaseName(diseaseName);
  const level = SEVERITY_LEVELS.find(
    item => item.toLowerCase() === String(severityLevel || '').toLowerCase()
  );
  return severityRules[disease]?.[level] || null;
}

export function evaluateFieldRisk(field, diseaseName, severityLevel) {
  const rule = getSeverityRule(diseaseName, severityLevel);
  const disease = normalizeDiseaseName(diseaseName);
  const many = field.spread === 'many';
  const rain = field.wetWeather === 'yes';
  const alreadySprayed = field.previousSpray === 'yes';

  const needsPromptHelp =
    many || rule?.priority === 'urgent' ||
    (disease === 'rust' && rain);

  return {
    needsPromptHelp,
    messages: [
      ...(many ? [{
        en: 'Several plants have symptoms: request a whole-field assessment promptly.',
        ur: 'کئی پودے متاثر ہیں: جلد پورے کھیت کا معائنہ کروائیں۔',
      }] : []),
      ...(rain ? [{
        en: 'Recent wet weather may favor fungal spread. Inspect nearby plants more often.',
        ur: 'حالیہ نمی سے بیماری بڑھ سکتی ہے۔ قریبی پودوں کو زیادہ بار چیک کریں۔',
      }] : []),
      ...(alreadySprayed ? [{
        en: 'You have already sprayed: check the product and date with an expert. Do not repeat or mix sprays without label instructions.',
        ur: 'آپ پہلے سپرے کر چکے ہیں: دوا اور تاریخ زرعی ماہر کو بتائیں۔ لیبل کے بغیر سپرے نہ دہرائیں اور دوائیں نہ ملائیں۔',
      }] : []),
    ],
  };
}
