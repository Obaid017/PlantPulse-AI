import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import {
  CARE_GUIDE_VERSION,
  getAffectedLeafNote,
  getDiseaseCare,
} from '../data/diseaseCare';

const sections = [
  { key: 'signs', icon: 'eye-outline', en: 'What does it look like?', ur: 'اس کی پہچان' },
  { key: 'cause', icon: 'help-circle-outline', en: 'Why did this happen?', ur: 'یہ بیماری کیوں ہوئی؟' },
  { key: 'spread', icon: 'cloudy-outline', en: 'How can it spread?', ur: 'یہ کیسے پھیلتی ہے؟' },
  { key: 'now', icon: 'checkmark-circle-outline', en: 'What should I do now?', ur: 'اب مجھے کیا کرنا چاہیے؟' },
  { key: 'prevent', icon: 'shield-checkmark-outline', en: 'How can I prevent it?', ur: 'اس سے بچاؤ کیسے کروں؟' },
  { key: 'medicine', icon: 'medkit-outline', en: 'Medicine information', ur: 'دوا کے بارے میں معلومات' },
  { key: 'followUp', icon: 'calendar-outline', en: 'When should I check again?', ur: 'دوبارہ کب چیک کروں؟' },
  { key: 'whenToAsk', icon: 'people-outline', en: 'When should I ask an expert?', ur: 'ماہر سے کب رابطہ کروں؟' },
];

function GuideSection({ section, content, language }) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Ionicons name={section.icon} size={22} color={colors.green} />
        <Text style={styles.sectionHeading}>
          {language === 'ur' ? section.ur : section.en}
        </Text>
      </View>
      <Text style={styles.sectionBody}>
        {content?.[language] || content?.en || ''}
      </Text>
    </View>
  );
}

export default function DiseaseCareGuide({
  diseaseName,
  status,
  severityLevel,
}) {
  const [language, setLanguage] = useState('en');

  const isUncertain =
    status === 'uncertain' || status === 'low_confidence';

  if (isUncertain) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>What should I do now?</Text>
        <Text style={styles.sectionBody}>
          We could not identify the leaf confidently. Please take another
          clear photo in daylight. If the plant is worsening, ask a local
          agriculture officer.
        </Text>
        <Text style={[styles.sectionBody, { marginTop: 8 }]}>
          صاف روشنی میں دوبارہ تصویر لیں۔ اگر بیماری بڑھ رہی ہو تو زرعی ماہر
          سے رابطہ کریں۔
        </Text>
      </View>
    );
  }

  const care = getDiseaseCare(
    status === 'healthy' ? 'healthy' : diseaseName
  );

  if (!care) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plant Care Advice</Text>
        <Text style={styles.sectionBody}>
          We don't have reviewed care guidance for this result yet.
          Please consult a local agriculture officer before applying medicine.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take Care of Your Plant</Text>
      <Text style={styles.subtitle}>اپنی فصل کی دیکھ بھال</Text>

      <View style={styles.languageRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: language === 'en' }}
          onPress={() => setLanguage('en')}
          style={[styles.languageButton, language === 'en' && styles.selectedLanguage]}
        >
          <Text style={[styles.languageText, language === 'en' && styles.selectedLanguageText]}>
            English
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: language === 'ur' }}
          onPress={() => setLanguage('ur')}
          style={[styles.languageButton, language === 'ur' && styles.selectedLanguage]}
        >
          <Text style={[styles.languageText, language === 'ur' && styles.selectedLanguageText]}>
            اردو
          </Text>
        </Pressable>
      </View>

      {status === 'diseased' && severityLevel && (
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" color={colors.green} size={20} />
          <Text style={styles.noticeText}>
            {getAffectedLeafNote(severityLevel, language)}
          </Text>
        </View>
      )}

      {sections.map((section) => (
        <GuideSection
          key={section.key}
          section={section}
          content={care[section.key]}
          language={language}
        />
      ))}

      <View style={styles.note}>
        <Text style={styles.noteText}>
          {language === 'ur'
            ? 'اہم: صرف تصویر سے سپرے کی مقدار یا ضرورت طے نہیں کی جا سکتی۔ دوا کے استعمال سے پہلے مستند پاکستانی لیبل اور مقامی زرعی ماہر کی ہدایات دیکھیں۔'
            : 'Important: The app cannot decide if or how much fungicide to spray from one photo. Check the current Pakistan-approved crop label and seek local agricultural advice before application.'}
        </Text>
        <Text style={styles.version}>Care guide {CARE_GUIDE_VERSION}</Text>
      </View>

      <Pressable
        onPress={() => care.sources?.[0] && Linking.openURL(care.sources[0])}
        accessibilityRole="link"
        style={styles.sourceButton}
      >
        <Ionicons name="book-outline" color={colors.green} size={18} />
        <Text style={styles.sourceText}>
          {language === 'ur' ? 'مزید معلومات کا حوالہ' : 'Read agricultural reference'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 19,
    marginTop: 18,
    marginBottom: 18,
  },
  title: { fontSize: 23, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 14, color: colors.muted },
  languageRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  languageButton: {
    flex: 1, paddingVertical: 13, borderRadius: 13, alignItems: 'center',
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  selectedLanguage: { backgroundColor: colors.green, borderColor: colors.green },
  languageText: { color: colors.green, fontSize: 16, fontWeight: '700' },
  selectedLanguageText: { color: colors.white },
  section: {
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  sectionHeading: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '800' },
  sectionBody: { fontSize: 15, lineHeight: 24, color: colors.muted },
  notice: {
    backgroundColor: colors.lightGreen, padding: 14, borderRadius: 13,
    flexDirection: 'row', alignItems: 'flex-start', gap: 9,
  },
  noticeText: { flex: 1, fontSize: 14, lineHeight: 22, color: colors.text },
  note: { padding: 14, marginTop: 14, backgroundColor: colors.background, borderRadius: 13 },
  noteText: { fontSize: 13, lineHeight: 21, color: colors.muted },
  version: { fontSize: 11, marginTop: 9, color: colors.muted },
  sourceButton: { marginTop: 15, minHeight: 48, flexDirection: 'row', gap: 9, alignItems: 'center' },
  sourceText: { color: colors.green, fontSize: 15, fontWeight: '700' },
});
