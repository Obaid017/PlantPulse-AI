import React from 'react';
import { Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import colors from '../constants/colors';

// Community posts will be connected to the database in a later milestone.
export default function CommunityScreen() {
  return (
    <ScreenLayout>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Ask other farmers</Text>
      <Text style={{ color: colors.muted, fontSize: 15, marginTop: 8 }}>دوسرے کسانوں سے پوچھیں</Text>
      <View style={{ marginTop: 25, borderRadius: 22, backgroundColor: colors.white, padding: 25, alignItems: 'center' }}>
        <Text style={{ fontSize: 44 }}>🌾</Text>
        <Text style={{ fontSize: 21, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 12 }}>
          Farmer community coming soon
        </Text>
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 24, textAlign: 'center', marginTop: 12 }}>
          Soon you will be able to share plant photos, ask questions and learn from other farmers.
        </Text>
      </View>
    </ScreenLayout>
  );
}
