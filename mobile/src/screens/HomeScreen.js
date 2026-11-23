import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import Brand from '../components/Brand';
import RecentScanCard from '../components/RecentScanCard';
import { getScanHistory, reportNavigationParams } from '../services/scanHistoryService';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { session } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(true);
  const [scanError, setScanError] = useState(false);

  const loadRecentScans = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoadingScans(true);
    setScanError(false);
    try {
      const scans = await getScanHistory(session.user.id, 3);
      setRecentScans(scans);
    } catch (error) {
      console.warn('Recent checks could not load:', error.message);
      setScanError(true);
    } finally {
      setLoadingScans(false);
    }
  }, [session?.user?.id]);

  // Refresh when the farmer returns to Home.
  useFocusEffect(useCallback(() => { loadRecentScans(); }, [loadRecentScans]));

  function openReport(scan) {
    navigation.getParent()?.navigate(
      'SavedScanDetail',
      {
        scanId: scan.id,
      }
    );  }

  const fullName = session?.user?.user_metadata?.full_name || 'Farmer';
  const firstName = fullName.trim().split(' ')[0] || 'Farmer';

  function openScan() {
    navigation.navigate('Scan');
  }

  return (
    <ScreenLayout>
      <Brand small />

      <Text style={{
        color: colors.green,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 8,
      }}>
        WELCOME BACK
      </Text>
      <Text style={{
        color: colors.text,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: '800',
        marginTop: 8,
      }}>
        Hello, {firstName}! 👋
      </Text>
      <Text style={{
        color: colors.muted,
        fontSize: 16,
        lineHeight: 24,
        marginTop: 6,
        marginBottom: 24,
      }}>
        Keep your groundnut plants healthy, one leaf at a time.
      </Text>

      {/* Main action: the most important task for a farmer. */}
      <View style={{
        backgroundColor: colors.forest,
        borderRadius: 27,
        padding: 25,
        marginBottom: 26,
        overflow: 'hidden',
      }}>
        <View style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: '#24533F',
          position: 'absolute',
          right: -72,
          top: -70,
        }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="leaf-outline" size={21} color={colors.lime} />
          <Text style={{
            color: colors.lime,
            fontSize: 12,
            fontWeight: '800',
            marginLeft: 8,
            letterSpacing: 1,
          }}>
            GROUNDNUT LEAF CHECK
          </Text>
        </View>
        <Text style={{
          color: colors.white,
          fontSize: 30,
          lineHeight: 38,
          fontWeight: '800',
          marginTop: 20,
        }}>
          See a problem?{'\n'}Check your leaf.
        </Text>
        <Text style={{
          color: '#E0EDE2',
          fontSize: 16,
          lineHeight: 24,
          marginTop: 13,
        }}>
          Take a clear photo of a groundnut leaf to check for disease.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take a leaf photo"
          onPress={openScan}
          style={({ pressed }) => ({
            backgroundColor: colors.lime,
            borderRadius: 17,
            minHeight: 58,
            marginTop: 24,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Ionicons name="camera-outline" size={23} color={colors.forest} />
          <Text style={{ color: colors.forest, fontSize: 17, fontWeight: '800', flex: 1, marginLeft: 12 }}>
            Take a leaf photo
          </Text>
          <Ionicons name="arrow-forward" size={22} color={colors.forest} />
        </Pressable>
        <Text style={{ color: '#E0EDE2', marginTop: 11, fontSize: 14 }}>
          پتے کی تصویر لیں
        </Text>
      </View>

      {/* Actual recent leaf checks, like the approved demo. */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>
            Recent leaf checks
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
            پچھلی رپورٹس
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all past leaf checks"
          onPress={() => navigation.navigate('History')}
          style={{ paddingVertical: 12, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: colors.green, fontSize: 15, fontWeight: '800' }}>View all</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.green} />
        </Pressable>
      </View>

      {loadingScans ? (
        <View style={{ paddingVertical: 26 }}><ActivityIndicator color={colors.green} /></View>
      ) : scanError ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 18, padding: 18, marginBottom: 18 }}>
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>Reports could not load</Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 6 }}>Please try again.</Text>
          <Pressable onPress={loadRecentScans} style={{ paddingVertical: 12 }} accessibilityRole="button">
            <Text style={{ color: colors.green, fontWeight: '800' }}>Try again</Text>
          </Pressable>
        </View>
      ) : recentScans.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          {recentScans.map((scan) => (
            <RecentScanCard key={scan.id} scan={scan} onPress={() => openReport(scan)} />
          ))}
        </View>
      ) : (
        <View style={{
          backgroundColor: colors.white,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          padding: 20,
          marginBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{ backgroundColor: colors.lightGreen, borderRadius: 14, padding: 12, marginRight: 13 }}>
            <Ionicons name="document-text-outline" color={colors.green} size={25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800' }}>No checks yet</Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 4 }}>
              Your leaf reports will appear here after you check a plant.
            </Text>
          </View>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Community')}
        style={({ pressed }) => ({
          flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
          borderColor: colors.border, borderWidth: 1, borderRadius: 19,
          padding: 17, marginBottom: 6, opacity: pressed ? 0.8 : 1,
        })}
      >
        <View style={{ backgroundColor: colors.lightGreen, borderRadius: 14, padding: 12 }}>
          <Ionicons name="people-outline" size={24} color={colors.green} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800' }}>Ask other farmers</Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>دوسرے کسانوں سے پوچھیں</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </Pressable>

      <View style={{
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 18,
        marginTop: 24,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="sunny-outline" size={24} color={colors.warning} />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginLeft: 10 }}>
            Helpful tip
          </Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 10 }}>
          For a clearer leaf photo, use daylight and keep the whole leaf in view.
        </Text>
      </View>

      <Text style={{
        fontSize: 12,
        color: colors.muted,
        lineHeight: 19,
        marginTop: 18,
        marginBottom: 4,
      }}>
        PlantPulse AI is designed for groundnut leaves. If a plant looks seriously unwell, ask a local agriculture expert for advice.
      </Text>
    </ScreenLayout>
  );
}
