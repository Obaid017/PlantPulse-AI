import React from 'react';
import { Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import colors from '../constants/colors';

export default function CommunityScreen() {
  return (
    <ScreenLayout>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Farmer community</Text>
      <View style={{ marginTop: 27, borderRadius: 20, backgroundColor: colors.white, padding: 25 }}>
        <Text style={{ fontSize: 42, textAlign: 'center' }}>🌾</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 14 }}>Community is coming next</Text>
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 24, textAlign: 'center', marginTop: 10 }}>We will add real farmer questions, images and replies. No example posts will be shown as real.</Text>
      </View>
    </ScreenLayout>
  );
}
