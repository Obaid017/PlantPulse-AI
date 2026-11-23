
import React, { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSignUp() {

    // 1. Check name and email
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing details', 'Enter your name and email.');
      return;
    }

    // 2. Check email format
    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid Email', 'Enter a valid email address.');
      return;
    }

    // 3. Minimum 8 characters
    if (password.length < 8) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 8 characters.'
      );
      return;
    }

    // 4. At least one letter
    if (!/[a-zA-Z]/.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least one letter.'
      );
      return;
    }

    // 5. At least one number
    if (!/[0-9]/.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least one number.'
      );
      return;
    }

    // 6. Confirm passwords match
    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Please enter the same password twice.'
      );
      return;
    }

    // 7. Register user in Supabase
    setBusy(true);

    try {
      const data = await signUp(
        name.trim(),
        cleanEmail,
        password
      );

      // Email confirmation is enabled in Supabase
      if (!data.session) {
        Alert.alert(
          'Check Your Email',
          'If this email can be registered, a verification link will be sent. If you already have an account, please sign in.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SignIn'),
            },
          ]
        );
      }

    } catch (error) {

      const message = error.message || '';

      if (message.toLowerCase().includes('password')) {
        Alert.alert(
          'Check Your Password',
          'Use at least 8 characters with letters and numbers.'
        );

      } else if (message.toLowerCase().includes('rate limit')) {
        Alert.alert(
          'Please Wait',
          'Too many attempts. Please try again later.'
        );

      } else {
        Alert.alert(
          'Sign Up Failed',
          'Unable to create your account. Please check your details and try again.'
        );

        console.log('Sign up error:', message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenLayout>
      <Brand small />

      <Text
        style={{
          color: colors.text,
          fontSize: 30,
          fontWeight: '800',
          marginTop: 22,
          marginBottom: 8,
        }}
      >
        Create an account
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 16,
          marginBottom: 22,
        }}
      >
        Start taking better care of your groundnut crop.
      </Text>

      <TextField
        label="Your name"
        value={name}
        onChangeText={setName}
        placeholder="Full name"
      />

      <TextField
        label="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
      />
      <Text
      style={{
        color: colors.muted,
        fontSize: 14,
        marginBottom: 15,
      }}
    >
      Use 8 or more characters with letters and numbers.

      {'\n'}

      پاس ورڈ میں انگریزی حروف اور نمبر استعمال کریں۔
    </Text>

      

      <TextField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <PrimaryButton
        title="Create account"
        onPress={handleSignUp}
        loading={busy}
      />

      <Pressable
        onPress={() => navigation.navigate('SignIn')}
        style={{
          padding: 18,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.green,
            fontWeight: '700',
          }}
        >
          Already have an account? Sign in
        </Text>
      </Pressable>
    </ScreenLayout>
  );
}
