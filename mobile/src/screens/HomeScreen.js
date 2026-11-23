import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import Brand from '../components/Brand';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { session } = useAuth();
  const fullName = session?.user?.user_metadata?.full_name || 'Grower';
  const firstName = fullName.split(' ')[0];

  return (
    <ScreenLayout>
      <Brand small />
      <Text style={{ fontSize: 12, color: colors.green, letterSpacing: 2, fontWeight: '700', marginTop: 14 }}>WELCOME BACK</Text>
      <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginTop: 8 }}>Hello, {firstName}! 👋</Text>
      <Text style={{ color: colors.muted, marginTop: 7, fontSize: 16 }}>A healthier harvest starts with a closer look.</Text>

      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Scan')} style={{ backgroundColor: colors.forest, borderRadius: 28, padding: 26, marginTop: 30, marginBottom: 28 }}>
        <Ionicons name="scan-outline" size={36} color={colors.lime} />
        <Text style={{ fontSize: 29, lineHeight: 36, color: colors.white, fontWeight: '800', marginTop: 20 }}>Check your groundnut leaf</Text>
        <Text style={{ color: '#DDE9D9', fontSize: 15, lineHeight: 24, marginTop: 10 }}>Take a clear photo to check for visible leaf disease.</Text>
        <View style={{ backgroundColor: colors.lime, paddingVertical: 17, paddingHorizontal: 17, borderRadius: 15, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.forest, fontSize: 17, fontWeight: '800' }}>Check Leaf  •  پتا چیک کریں</Text>
          <Ionicons name="arrow-forward" size={22} color={colors.forest} />
        </View>
      </Pressable>

      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 13 }}>How it works</Text>
      {[
        ['1', 'Take a clear photo', 'Choose one leaf with good light.'],
        ['2', 'Check the result', 'See what the model identifies.'],
        ['3', 'Read care advice', 'English and Urdu guidance will be available.'],
      ].map(([number, title, description]) => (
        <View key={number} style={{ flexDirection: 'row', padding: 16, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, marginBottom: 10, alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, backgroundColor: colors.lightGreen, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
            <Text style={{ color: colors.green, fontWeight: '800', fontSize: 18 }}>{number}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4, fontSize: 13 }}>{description}</Text>
          </View>
        </View>
      ))}
      <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 15 }}>PlantPulse AI currently supports groundnut leaves only. A prediction is not a replacement for local agricultural advice.</Text>
    </ScreenLayout>
  );
}
