import React from 'react';
import { Text, TextInput, View } from 'react-native';
import colors from '../constants/colors';

export default function TextField({ label, value, onChangeText, secureTextEntry = false, keyboardType = 'default', placeholder = '' }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8, fontSize: 15 }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#87978D"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        autoCorrect={false}
        style={{ height: 54, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, color: colors.text, paddingHorizontal: 15, fontSize: 16 }}
      />
    </View>
  );
}
