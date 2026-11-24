// Pakistan-market fungicide leads with explicitly stated crop-evidence limits.
// Product names are NOT prescriptions. No automatic dose, interval or spray timing.
export const medicineCatalogVersion = '2026-11-24.v1';

export const medicines = {
  soduku: {
    name: 'Soduku SC',
    manufacturer: 'FMC Pakistan',
    active: 'Chlorothalonil 10.5% + Tebuconazole 31.5%',
    evidence: 'peanut_leaf_spot_manufacturer',
    source: 'https://ag.fmc.com/pk/en/products/fungicides/soduku',
    note: {
      en: 'FMC Pakistan lists peanut leaf spot. Confirm the EXACT product pack label, specific disease, crop stage and directions before any spray.',
      ur: 'FMC پاکستان نے مونگ پھلی کے لیف اسپاٹ کے لیے اس دوا کا ذکر کیا ہے۔ سپرے سے پہلے اصل بوتل کے لیبل، بیماری اور استعمال کی ہدایات کی تصدیق کریں۔',
    },
  },
  nativo: {
    name: 'Nativo 75 WG',
    manufacturer: 'Bayer',
    active: 'Tebuconazole + Trifloxystrobin',
    evidence: 'pakistan_extension_reference_not_label',
    source: 'https://barichakwal.punjab.gov.pk/system/files/Groundnut%20report_1.pdf',
    note: {
      en: 'Mentioned for groundnut leaf spot by BARI Chakwal. The CURRENT Pakistan pack label for groundnut use has not been verified here; do not copy the historic research dose.',
      ur: 'باری چکوال نے مونگ پھلی کے لیف اسپاٹ کے لیے اس کا ذکر کیا ہے۔ موجودہ پاکستانی لیبل کی یہاں تصدیق نہیں ہوئی؛ پرانی تحقیقی مقدار نقل نہ کریں۔',
    },
  },
  greenopas: {
    name: 'Greenopas 17% SE',
    manufacturer: 'Jaffer Agro Services',
    active: 'Refer to current pack label',
    evidence: 'pakistan_product_rust_general_not_groundnut',
    source: 'https://www.jaffer.com/jaspl/product/131/greenopas-17-se/',
    note: {
      en: 'A Pakistan-market product advertised for rust and leaf spots generally. Its GROUNDNUT RUST approval is NOT verified. Do not apply to groundnut based on this listing.',
      ur: 'پاکستان میں رسٹ اور لیف اسپاٹ کے لیے عام طور پر درج دوا ہے۔ مونگ پھلی کی رسٹ کے لیے منظوری کی تصدیق نہیں؛ اس معلومات پر سپرے نہ کریں۔',
    },
  },
  evito: {
    name: 'Evito 48% SC',
    manufacturer: 'UPL Pakistan',
    active: 'Fluoxastrobin',
    evidence: 'pakistan_product_other_crop_not_groundnut',
    source: 'https://pk.uplcorp.com/product-details/evito',
    note: {
      en: 'UPL Pakistan lists Alternaria on soybean and rust on other crops, NOT groundnut. This is a market reference only and must not be used on groundnut without approved crop labeling.',
      ur: 'UPL پاکستان نے اس دوا کو دوسری فصلوں میں الٹرنیریا یا رسٹ کے لیے درج کیا ہے، مونگ پھلی کے لیے نہیں۔ منظور شدہ لیبل کے بغیر مونگ پھلی پر استعمال نہ کریں۔',
    },
  },
};

const diseaseOptions = {
  'early leaf spot': ['soduku', 'nativo'],
  'late leaf spot': ['soduku', 'nativo'],
  rust: ['greenopas'],
  'alternaria leaf spot': ['evito'],
};

export function getMedicineCandidates(diseaseName) {
  const normalized = String(diseaseName || '').toLowerCase().replace(/[_-]/g, ' ').trim();
  const key = normalized === 'alternaria' ? 'alternaria leaf spot' : normalized;
  return (diseaseOptions[key] || []).map(id => ({ id, ...medicines[id] }));
}

export const generalSpraySafety = {
  en: 'Never increase dose because a leaf has a higher severity %. Spray only when justified by field inspection and the latest Pakistan-approved groundnut label. Follow the label for dose, dilution, timing, protective clothing, spray interval, re-entry, harvest waiting period and resistance rotation. Do not mix or repeat chemicals without instructions.',
  ur: 'پتے کے زیادہ متاثرہ فیصد کی وجہ سے دوا کی مقدار نہ بڑھائیں۔ پورے کھیت کے معائنے اور تازہ منظور شدہ پاکستانی لیبل کے مطابق ہی سپرے کریں۔ مقدار، پانی، وقت، حفاظتی لباس، اگلے سپرے، کھیت میں دوبارہ داخلے اور کٹائی سے پہلے وقفے کی ہدایات لازماً مانیں۔ بغیر ہدایات دوائیں نہ ملائیں اور نہ دہرائیں۔',
};
