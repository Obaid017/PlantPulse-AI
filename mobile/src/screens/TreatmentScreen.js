import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import colors from '../constants/colors';
import { getDiseaseCare } from '../data/diseaseCare';
import { getMedicineCandidates, generalSpraySafety } from '../data/medicineCatalog';
import { evaluateFieldRisk, getSeverityRule } from '../data/severityRules';
import { fetchTreatmentCatalog } from '../services/recommendationService';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'اردو' },
];

function CareCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function FieldQuestion({ title, value, onChange, options }) {
  return (
    <View style={styles.question}>
      <Text style={styles.questionTitle}>{title}</Text>
      <View style={styles.optionRow}>
        {options.map(option => (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: value === option.value }}
            style={[styles.option, value === option.value && styles.selectedOption]}
          >
            <Text style={[styles.optionText, value === option.value && styles.selectedOptionText]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RuleText({ children }) {
  return <Text style={styles.body}>{children}</Text>;
}

export default function TreatmentScreen({ navigation, route }) {
  const {
    diseaseName,
    status = 'diseased',
    severityLevel = null,
    severityPercent = null,
  } = route.params || {};

  const [language, setLanguage] = useState('en');
  const [spread, setSpread] = useState('unknown');
  const [wetWeather, setWetWeather] = useState('unknown');
  const [previousSpray, setPreviousSpray] = useState('unknown');

  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let mounted = true;
    setCatalog(null);
    fetchTreatmentCatalog(status === 'healthy' ? 'healthy' : diseaseName, severityLevel)
      .then(data => { if (mounted) setCatalog(data); })
      .catch(error => console.warn('Using built-in care guide:', error.message));
    return () => { mounted = false; };
  }, [diseaseName, severityLevel, status]);

  const healthy = status === 'healthy';
  const uncertain =
    status === 'uncertain' ||
    status === 'invalid_image' ||
    status === 'low_confidence' ||
    (
      status === 'diseased' &&
      (
        severityPercent == null ||
        Number(severityPercent) <= 0
      )
    ); 
  const localCare = getDiseaseCare(healthy ? 'healthy' : diseaseName);
  const care = localCare && catalog?.disease
    ? { ...localCare, ...catalog.disease }
    : localCare;
  const rule = catalog?.rule || getSeverityRule(diseaseName, severityLevel);
  const medicines = catalog?.medicines?.length
    ? catalog.medicines
    : getMedicineCandidates(diseaseName);

  const risk = useMemo(
    () => evaluateFieldRisk({ spread, wetWeather, previousSpray }, diseaseName, severityLevel),
    [spread, wetWeather, previousSpray, diseaseName, severityLevel]
  );

  const urdu = language === 'ur';
  const translated = (en, ur) => urdu ? ur : en;
  const textOf = value => value?.[language] || value?.en || '';

  const answerOptions = [
    { value: 'few', label: translated('Few', 'چند') },
    { value: 'many', label: translated('Many', 'زیادہ') },
    { value: 'unknown', label: translated('Not sure', 'معلوم نہیں') },
  ];
  const yesNo = [
    { value: 'yes', label: translated('Yes', 'جی ہاں') },
    { value: 'no', label: translated('No', 'نہیں') },
    { value: 'unknown', label: translated('Not sure', 'معلوم نہیں') },
  ];

  return (
    <ScreenLayout>
      <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>{translated('Back to report', 'رپورٹ پر واپس')}</Text>
      </Pressable>
      <Text style={styles.heading}>{translated('Treatment & Plant Care', 'علاج اور فصل کی دیکھ بھال')}</Text>
      <Text style={styles.subheading}>
        {translated('Early action to help stop new infections', 'نئے انفیکشن کو پھیلنے سے روکنے کے لیے بروقت قدم')}
      </Text>

      <View style={styles.languageRow}>
        {languageOptions.map(option => (
          <Pressable
            key={option.value}
            onPress={() => setLanguage(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: language === option.value }}
            style={[styles.languageButton, language === option.value && styles.selectedLanguage]}
          >
            <Text style={[styles.languageText, language === option.value && styles.selectedLanguageText]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summarySmall}>{translated('YOUR LEAF RESULT', 'آپ کے پتے کا نتیجہ')}</Text>
        <Text style={styles.summaryName}>{healthy ? translated('Healthy Leaf', 'صحت مند پتہ') : diseaseName || translated('Uncertain', 'واضح نہیں')}</Text>
        {severityLevel && !healthy && !uncertain && (
          <Text style={styles.summarySeverity}>
            {translated('Affected area', 'متاثرہ حصہ')}: {severityPercent == null ? '—' : Number(severityPercent).toFixed(1) + '%'}  •  {severityLevel}
          </Text>
        )}
      </View>

      {uncertain ? (
        <CareCard title={translated('What to do first', 'پہلا قدم')}>
          <RuleText>{translated(
            'Please take another clear photo in daylight. Do not select medicine from an uncertain prediction. If plants are worsening, contact an agriculture officer.',
            'دن کی روشنی میں صاف تصویر دوبارہ لیں۔ غیر یقینی نتیجے سے دوا نہ چنیں۔ فصل خراب ہو رہی ہو تو زرعی ماہر سے رابطہ کریں۔'
          )}</RuleText>
        </CareCard>
      ) : !care ? (
        <CareCard title={translated('Care advice is not ready', 'مشورہ دستیاب نہیں')}>
          <RuleText>{translated('This disease needs expert confirmation before treatment.', 'علاج سے پہلے زرعی ماہر سے بیماری کی تصدیق کروائیں۔')}</RuleText>
        </CareCard>
      ) : (
        <>
          <CareCard title={translated('1. What to do today', '۱۔ آج کیا کریں؟')}>
            <RuleText>{textOf(rule?.action) || textOf(care.now)}</RuleText>
            {!healthy && <Text style={styles.helper}>
              {translated(
                'The percentage is from this ONE leaf, not the whole field. Do not decide a spray from this number alone.',
                'فیصد صرف اسی ایک پتے کا ہے، پورے کھیت کا نہیں۔ صرف اس نمبر سے سپرے کا فیصلہ نہ کریں۔'
              )}
            </Text>}
          </CareCard>

          {!healthy && (
            <CareCard title={translated('2. Tell us about your field', '۲۔ کھیت کے بارے میں بتائیں')}>
              <Text style={styles.helper}>
                {translated('Three quick answers help us prioritize early action.', 'تین آسان جواب بروقت احتیاط کا مشورہ بہتر بناتے ہیں۔')}
              </Text>
              <FieldQuestion
                title={translated('Are many plants showing these spots?', 'کیا بہت سے پودوں پر یہی دھبے ہیں؟')}
                value={spread} onChange={setSpread} options={answerOptions}
              />
              <FieldQuestion
                title={translated('Has the weather been rainy or humid?', 'کیا بارش ہوئی یا موسم نم ہے؟')}
                value={wetWeather} onChange={setWetWeather} options={yesNo}
              />
              <FieldQuestion
                title={translated('Have you already used a disease spray?', 'کیا آپ پہلے سپرے کر چکے ہیں؟')}
                value={previousSpray} onChange={setPreviousSpray} options={yesNo}
              />
              <View style={[styles.riskPanel, risk.needsPromptHelp && styles.urgentPanel]}>
                <Text style={styles.riskTitle}>
                  {risk.needsPromptHelp
                    ? translated('Please get help promptly', 'جلد زرعی مشورہ لیں')
                    : translated('Keep checking your crop', 'فصل کو چیک کرتے رہیں')}
                </Text>
                {risk.messages.map((message, i) => (
                  <Text key={i} style={styles.body}>{textOf(message)}</Text>
                ))}
                {!risk.messages.length && (
                  <Text style={styles.body}>{translated(
                    'Inspect nearby plants for new spots. If symptoms spread, get field-level advice.',
                    'قریبی پودوں پر نئے دھبے دیکھیں۔ بیماری پھیلے تو کھیت کا معائنہ کروائیں۔'
                  )}</Text>
                )}
              </View>
            </CareCard>
          )}

          <CareCard title={translated('3. Why it happens', '۳۔ بیماری کیوں ہوتی ہے؟')}>
            <RuleText>{textOf(care.cause)}</RuleText>
          </CareCard>

          <CareCard title={translated('4. Signs to look for', '۴۔ بیماری کی پہچان')}>
            <RuleText>{textOf(care.signs)}</RuleText>
          </CareCard>

          <CareCard title={translated('5. How to prevent spread', '۵۔ پھیلاؤ کیسے روکیں؟')}>
            <RuleText>{textOf(care.prevent)}</RuleText>
            <Text style={styles.helper}>{textOf(care.spread)}</Text>
          </CareCard>

          <CareCard title={translated('6. Medicine & spray', '۶۔ دوا اور سپرے')}>
            {healthy ? (
              <RuleText>{textOf(care.medicine)}</RuleText>
            ) : medicines.length ? (
              medicines.map(item => {
                const groundnutListed = item.evidence === 'peanut_leaf_spot_manufacturer';
                return (
                  <View key={item.id} style={styles.medicine}>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.productInfo}>{item.manufacturer} • {item.active}</Text>
                    <Text style={[styles.verification, groundnutListed ? styles.listed : styles.unverified]}>
                      {groundnutListed
                        ? translated('Peanut leaf spot listed by Pakistani manufacturer — label check still needed', 'پاکستانی کمپنی نے مونگ پھلی کے لیف اسپاٹ کو درج کیا ہے — لیبل پھر بھی چیک کریں')
                        : translated('NOT verified for groundnut application — information only', 'مونگ پھلی پر استعمال کی تصدیق نہیں — صرف معلومات')}
                    </Text>
                    <RuleText>{textOf(item.note)}</RuleText>
                    <Pressable
                      accessibilityRole="link"
                      onPress={() => Linking.openURL(item.source)}
                      style={styles.source}
                    >
                      <Text style={styles.sourceText}>{translated('Product / research source', 'دوا یا تحقیق کا حوالہ')}</Text>
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <RuleText>{translated(
                'No groundnut-verified medicine is available in this guide yet. Please confirm a labeled product locally.',
                'اس گائیڈ میں ابھی مونگ پھلی کے لیے تصدیق شدہ دوا نہیں ہے۔ مقامی زرعی ماہر سے منظور شدہ دوا پوچھیں۔'
              )}</RuleText>
            )}
            <Text style={styles.safety}>{textOf(generalSpraySafety)}</Text>
          </CareCard>

          <CareCard title={translated('7. When to check again', '۷۔ دوبارہ کب دیکھیں؟')}>
            <RuleText>{textOf(rule?.followUp) || textOf(care.followUp)}</RuleText>
            <Text style={styles.helper}>{textOf(care.whenToAsk)}</Text>
          </CareCard>
        </>
      )}
      <Text style={styles.footer}>
        {translated(
          'PlantPulse AI is an early-warning aid, not a prescription. Any medicine must be approved for groundnut and its specific disease in Pakistan.',
          'پلانٹ پلس ایک ابتدائی انتباہ ہے، نسخہ نہیں۔ دوا پاکستان میں مونگ پھلی اور متعلقہ بیماری کے لیے منظور شدہ ہونی چاہیے۔'
        )}
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  back: { paddingVertical: 9, marginBottom: 12, alignSelf: 'flex-start' },
  backText: { color: colors.green, fontSize: 16, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 27, fontWeight: '800', lineHeight: 35 },
  subheading: { color: colors.muted, fontSize: 15, marginTop: 7, marginBottom: 14, lineHeight: 23 },
  languageRow: { flexDirection: 'row', alignSelf: 'flex-end', gap: 7, marginBottom: 12 },
  languageButton: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  selectedLanguage: { backgroundColor: colors.green },
  languageText: { color: colors.green, fontWeight: '700', fontSize: 14 },
  selectedLanguageText: { color: colors.white },
  summary: { backgroundColor: colors.lightGreen, borderRadius: 18, padding: 18, marginBottom: 12 },
  summarySmall: { color: colors.green, fontSize: 11, letterSpacing: 1, fontWeight: '800' },
  summaryName: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 5 },
  summarySeverity: { color: colors.muted, marginTop: 7, fontSize: 15 },
  card: { padding: 18, backgroundColor: colors.white, borderRadius: 20, marginBottom: 13 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10, lineHeight: 26 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 24, marginTop: 4 },
  helper: { color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 8 },
  question: { marginTop: 15 },
  questionTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  option: { borderColor: colors.border, borderWidth: 1, backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 12 },
  selectedOption: { borderColor: colors.green, backgroundColor: colors.lightGreen },
  optionText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  selectedOptionText: { color: colors.green },
  riskPanel: { backgroundColor: colors.background, padding: 14, borderRadius: 14, marginTop: 17 },
  urgentPanel: { backgroundColor: '#FFF0E8' },
  riskTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  medicine: { borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 14, marginTop: 11 },
  medicineName: { color: colors.text, fontSize: 19, fontWeight: '800' },
  productInfo: { color: colors.muted, fontSize: 13, marginTop: 5, lineHeight: 20 },
  verification: { fontSize: 13, fontWeight: '700', lineHeight: 21, marginTop: 9 },
  listed: { color: colors.green },
  unverified: { color: colors.red },
  source: { minHeight: 44, justifyContent: 'center', marginTop: 7 },
  sourceText: { color: colors.green, fontSize: 14, fontWeight: '700' },
  safety: { color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 15, padding: 12, backgroundColor: colors.background, borderRadius: 12 },
  footer: { color: colors.muted, fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 10, marginBottom: 25 },
});
