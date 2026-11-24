import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import colors from '../constants/colors';
import { getSavedScanDetail } from '../services/scanSaveService';

export default function CommunityDraftScreen({ navigation, route }) {
  const { scanId, diseaseName, severityPercent, status, imageUri } = route.params || {};
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(Boolean(scanId));
  const [note, setNote] = useState('');

  useEffect(() => {
    let active = true;
    if (scanId) {
      getSavedScanDetail(scanId)
        .then(scan => { if (active) setReport(scan); })
        .catch(err => console.warn('Cannot load community draft image:', err.message))
        .finally(() => { if (active) setLoading(false); });
    }
    return () => { active = false; };
  }, [scanId]);

  const actualDisease = report?.disease_name || diseaseName || 'Plant problem';
  const actualSeverity = report?.severity_percent ?? severityPercent;
  const actualStatus = report?.status || status;
  const photo = report?.images?.original || imageUri;

  async function shareText() {
    const parts = [
      'PlantPulse AI - Groundnut leaf check',
      actualStatus === 'healthy' ? 'Leaf appears healthy' : `Possible disease: ${actualDisease}`,
      actualSeverity == null || actualStatus === 'healthy'
        ? null : `Estimated affected area on scanned leaf: ${Number(actualSeverity).toFixed(1)}%`,
      note.trim() || null,
      'This is an automated image-based estimate, not a confirmed field diagnosis.',
    ].filter(Boolean);

    try {
      // Native share sends text to apps selected by the farmer; does not publish to PlantPulse.
      await Share.share({ message: parts.join('\n') });
    } catch (error) {
      console.warn('Sharing failed:', error.message);
    }
  }

  return (
    <ScreenLayout>
      <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={styles.back}>
        <Ionicons name="arrow-back" color={colors.green} size={21} />
        <Text style={styles.backText}>Back to report</Text>
      </Pressable>
      <Text style={styles.heading}>Share Your Plant Check</Text>
      <Text style={styles.urdu}>اپنی فصل کے بارے میں پوچھیں</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your report</Text>
        <Text style={styles.disease}>{actualDisease}</Text>
        {loading ? <ActivityIndicator color={colors.green} style={{ marginVertical: 12 }} /> : (
          photo ? <Image source={{ uri: photo }} resizeMode="contain" style={styles.image} /> : null
        )}
        {actualSeverity != null && actualStatus !== 'healthy' && (
          <Text style={styles.detail}>Estimated affected leaf area: {Number(actualSeverity).toFixed(1)}%</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>What would you like to ask?</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={600}
          placeholder="E.g., Has anyone seen spots like these?"
          placeholderTextColor={colors.muted}
          style={styles.input}
          accessibilityLabel="Question about your groundnut plant"
        />
      </View>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" color={colors.green} size={20} />
        <Text style={styles.noticeText}>
          The PlantPulse community posting feature is still being built.
          You can share this report summary with a trusted person using your phone.
          Nothing is posted publicly from this page.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={shareText} accessibilityRole="button">
        <Ionicons name="share-social-outline" color={colors.white} size={20} />
        <Text style={styles.buttonText}>Share Summary With Someone</Text>
      </Pressable>
      <Text style={styles.small}>
        The share sheet sends a summary as text; the photo is not attached yet. Review your message before sending.
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 9, marginBottom: 9 },
  backText: { fontSize: 16, fontWeight: '700', color: colors.green },
  heading: { color: colors.text, fontSize: 27, fontWeight: '800' },
  urdu: { color: colors.muted, fontSize: 15, marginTop: 6, marginBottom: 15 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 19, marginBottom: 15 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  disease: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 7 },
  image: { height: 220, width: '100%', backgroundColor: colors.background, borderRadius: 14, marginTop: 12 },
  detail: { color: colors.muted, fontSize: 14, marginTop: 10 },
  question: { color: colors.text, fontWeight: '800', fontSize: 17, marginBottom: 11 },
  input: { minHeight: 110, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.text, fontSize: 15, textAlignVertical: 'top' },
  notice: { backgroundColor: colors.lightGreen, padding: 14, borderRadius: 14, flexDirection: 'row', gap: 9 },
  noticeText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 21 },
  button: { backgroundColor: colors.green, borderRadius: 17, minHeight: 55, marginTop: 17, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', padding: 12 },
  buttonText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  small: { fontSize: 12, lineHeight: 19, marginTop: 11, marginBottom: 20, color: colors.muted },
});
