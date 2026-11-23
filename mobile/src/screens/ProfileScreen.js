import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import Brand from '../components/Brand';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const name = session?.user?.user_metadata?.full_name || 'Farmer';

  async function handleSignOut() {
    setBusy(true);
    try { await signOut(); }
    catch (error) { Alert.alert('Sign out failed', error.message); }
    finally { setBusy(false); }
  }

  return (
    <ScreenLayout>
      <Brand small />
      <Text style={{ fontSize: 27, fontWeight: '800', color: colors.text, marginTop: 20 }}>My account</Text>
      <View style={{ padding: 21, backgroundColor: colors.white, borderRadius: 20, marginTop: 20, marginBottom: 16 }}>
        <Text style={{ color: colors.muted, marginBottom: 5 }}>Name</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 18 }}>{name}</Text>
        <Text style={{ color: colors.muted, marginBottom: 5 }}>Email</Text>
        <Text style={{ color: colors.text, fontSize: 16 }}>{session?.user?.email}</Text>
      </View>
      <PrimaryButton title="Sign out" secondary onPress={handleSignOut} loading={busy} />
      <Text style={{ marginTop: 20, color: colors.muted, fontSize: 13, lineHeight: 22 }}>PlantPulse AI currently checks groundnut leaves only. More account settings and Urdu preferences will be added in a later milestone.</Text>
    </ScreenLayout>
  );
}
