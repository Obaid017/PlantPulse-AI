import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Simple photo instructions that farmers can understand.
export default function PhotoTips() {
  return (
    <View style={{
      backgroundColor: '#FFF8E9',
      borderRadius: 20,
      padding: 19,
      marginTop: 20,
      marginBottom: 16,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="bulb-outline" size={23} color={colors.warning} />
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginLeft: 9 }}>
          Tips for a clear photo
        </Text>
      </View>
      <Text style={{ color: colors.text, fontSize: 15, lineHeight: 25 }}>
        {'1. Take the photo in daylight.\n2. Keep the leaf clear and in focus.\n3. Show the whole leaf and its spots.'}
      </Text>
      <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 23, marginTop: 11 }}>
        پتے کی صاف تصویر دن کی روشنی میں لیں۔ پورا پتا نظر آنا چاہیے۔
      </Text>
    </View>
  );
}
