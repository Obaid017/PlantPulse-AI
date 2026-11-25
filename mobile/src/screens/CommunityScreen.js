import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import colors from '../constants/colors';

export default function CommunityScreen({ navigation }) {
  return (
    <ScreenLayout>
      <Text style={styles.heading}>Community</Text>
      <Text style={styles.urdu}>دوسرے کسانوں سے رابطہ</Text>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>COMING SOON</Text>
        <Text style={styles.title}>A place for farmers to help each other</Text>
        <Text style={styles.description}>
          Soon you will be able to share your leaf checks, ask questions,
          and learn from other groundnut farmers.
        </Text>
        <Text style={styles.descriptionUrdu}>
          جلد آپ اپنی فصل کی تصاویر اور سوالات دوسرے کسانوں کے ساتھ شیئر کر سکیں گے۔
        </Text>
        <View style={styles.divider} />
        <Text style={styles.notice}>Community posting is not available yet. No reports are shared automatically.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Scan')}
        style={styles.action}
      >
        <Text style={styles.actionText}>Check a Leaf</Text>
      </Pressable>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 29, fontWeight: '800', color: colors.text, marginTop: 10 },
  urdu: { color: colors.muted, fontSize: 16, marginTop: 9, marginBottom: 22 },
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 24 },
  eyebrow: { fontSize: 12, letterSpacing: 1.6, fontWeight: '800', color: colors.green },
  title: { fontSize: 24, lineHeight: 33, fontWeight: '800', color: colors.text, marginTop: 13 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25, marginTop: 12 },
  descriptionUrdu: { color: colors.muted, fontSize: 16, lineHeight: 27, marginTop: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 19 },
  notice: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  action: { marginTop: 19, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderRadius: 18, minHeight: 56 },
  actionText: { color: colors.white, fontSize: 17, fontWeight: '800' },
});
