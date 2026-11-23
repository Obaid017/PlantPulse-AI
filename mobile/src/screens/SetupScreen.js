import React from 'react';
import { Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import Brand from '../components/Brand';
import colors from '../constants/colors';

export default function SetupScreen() {
  return (
    <ScreenLayout>
      <Brand />
      <View style={{ marginTop: 34, backgroundColor: colors.white, borderRadius: 22, padding: 24 }}>
        <Text style={{ fontSize: 24, color: colors.text, fontWeight: '800', marginBottom: 12 }}>Connect Supabase first</Text>
        <Text style={{ fontSize: 16, color: colors.muted, lineHeight: 25 }}>
          This is the real application, so it needs your own Supabase project before anyone can sign in.\n\n1. Create mobile/.env\n2. Add your Supabase URL and publishable key\n3. Restart Expo with npx expo start --clear
        </Text>
      </View>
    </ScreenLayout>
  );
}
