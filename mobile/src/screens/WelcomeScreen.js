import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import Brand from '../components/Brand';
import colors from '../constants/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenLayout>
      <Brand />
      <View style={{ backgroundColor: colors.forest, borderRadius: 27, padding: 28, marginTop: 20, marginBottom: 25 }}>
        <Ionicons name="leaf-outline" size={43} color={colors.lime} />
        <Text style={{ fontSize: 30, fontWeight: '800', color: colors.white, marginTop: 26, lineHeight: 38 }}>
          Healthy leaves.{'\n'}Stronger harvests.
        </Text>
        <Text style={{ color: '#DCE9D7', fontSize: 16, lineHeight: 25, marginTop: 16 }}>
          Check your groundnut leaves and find helpful plant care advice.\nاپنی مونگ پھلی کی فصل کا خیال رکھیں
        </Text>
      </View>
      <Text style={{ fontSize: 25, fontWeight: '800', color: colors.text, marginBottom: 8 }}>Welcome to PlantPulse</Text>
      <Text style={{ fontSize: 16, color: colors.muted, lineHeight: 24, marginBottom: 21 }}>Sign in or create your account to get started.</Text>
      <PrimaryButton title="Sign in" onPress={() => navigation.navigate('SignIn')} />
      <PrimaryButton title="Create an account" secondary onPress={() => navigation.navigate('SignUp')} />
      <Text style={{ fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 23 }}>Your reports will belong to your account. No demo login is used.</Text>
    </ScreenLayout>
  );
}
