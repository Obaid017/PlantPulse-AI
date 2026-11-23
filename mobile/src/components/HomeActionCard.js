import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// A small reusable card for shortcuts on the Home screen.
export default function HomeActionCard({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 0,
        minHeight: 152,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 22,
        padding: 18,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Ionicons name={icon} size={24} color={colors.green} />
      </View>

      <Text style={{
        color: colors.text,
        fontSize: 17,
        fontWeight: '800',
        marginTop: 14,
      }}>
        {title}
      </Text>
      <Text style={{
        color: colors.muted,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 4,
      }}>
        {subtitle}
      </Text>
    </Pressable>
  );
}
