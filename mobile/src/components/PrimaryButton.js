import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import colors from '../constants/colors';

export default function PrimaryButton({ title, onPress, secondary = false, disabled = false, loading = false }) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => ({
        minHeight: 54,
        marginVertical: 7,
        paddingHorizontal: 18,
        borderRadius: 16,
        borderWidth: secondary ? 1.5 : 0,
        borderColor: colors.green,
        backgroundColor: secondary ? colors.white : colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inactive ? 0.6 : pressed ? 0.85 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.green : colors.white} />
      ) : (
        <Text style={{ color: secondary ? colors.green : colors.white, fontWeight: '700', fontSize: 16 }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
