import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function Brand({ small = false }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
      <View style={{ width: small ? 42 : 54, height: small ? 42 : 54, backgroundColor: colors.green, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
        <Ionicons name="leaf-outline" color={colors.lime} size={small ? 24 : 31} />
      </View>
      <View>
        <Text style={{ color: colors.forest, fontSize: small ? 24 : 28, fontWeight: '800' }}>PlantPulse <Text style={{ color: '#60914E' }}>AI</Text></Text>
        <Text style={{ color: colors.muted, fontSize: 11, letterSpacing: 1, fontWeight: '600' }}>GROUNDNUT CARE ASSISTANT</Text>
      </View>
    </View>
  );
}
