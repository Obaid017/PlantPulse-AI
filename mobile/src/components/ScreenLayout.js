import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';

// Keeps screen content below the phone clock and notch.
export default function ScreenLayout({ children, scroll = true }) {
  const insets = useSafeAreaInsets();
  const style = {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top + 16,
    paddingHorizontal: 22,
    paddingBottom: insets.bottom + 28,
  };

  if (scroll) {
    return <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={style}>{children}</ScrollView>;
  }

  return <View style={{ ...style, flex: 1 }}>{children}</View>;
}
