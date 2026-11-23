import React, { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) return Alert.alert('Missing details', 'Enter your email and password.');
    setBusy(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      // Navigation switches automatically when Supabase returns a session.
    } catch (error) {
      Alert.alert('Unable to sign in', error.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenLayout>
      <Brand small />
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 27, marginBottom: 8 }}>Welcome back</Text>
      <Text style={{ color: colors.muted, fontSize: 16, marginBottom: 28 }}>Sign in to check your groundnut plants.</Text>
      <TextField label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" />
      <PrimaryButton title="Sign in" onPress={handleSignIn} loading={busy} />
      <Pressable onPress={() => navigation.navigate('SignUp')} style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.green, fontWeight: '700', fontSize: 15 }}>No account? Create one</Text>
      </Pressable>
      <Text style={{ color: colors.muted, marginTop: 14, lineHeight: 23 }}>Forgotten password recovery will be added with email-link handling in the next authentication milestone.</Text>
    </ScreenLayout>
  );
}
