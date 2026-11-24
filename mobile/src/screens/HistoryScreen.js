
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenLayout from '../components/ScreenLayout';
import RecentScanCard from '../components/RecentScanCard';
import { useAuth } from '../context/AuthContext';
import { getScanHistory } from '../services/scanHistoryService';
import colors from '../constants/colors';

export default function HistoryScreen({ navigation }) {
  const { session } = useAuth();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadScans = useCallback(async () => {
    if (!session?.user?.id) {
      setScans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const reports = await getScanHistory(
        session.user.id,
        50
      );

      setScans(reports);
    } catch (err) {
      console.warn(
        'History could not load:',
        err.message
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Refresh history whenever farmer opens this tab
  useFocusEffect(
    useCallback(() => {
      loadScans();
    }, [loadScans])
  );

  // Open a complete saved report
  function openReport(scan) {
    navigation.getParent()?.navigate(
      'SavedScanDetail',
      {
        scanId: scan.id,
      }
    );
  }

  return (
    <ScreenLayout>
      <Text
        style={{
          color: colors.text,
          fontSize: 28,
          fontWeight: '800',
        }}
      >
        My leaf checks
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 15,
          marginTop: 7,
          marginBottom: 20,
        }}
      >
        میری پچھلی رپورٹس
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.green}
          style={{ marginTop: 32 }}
        />
      ) : error ? (
        <View
          style={{
            backgroundColor: colors.white,
            padding: 23,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 19,
              fontWeight: '800',
            }}
          >
            Could not load reports
          </Text>

          <Text
            style={{
              color: colors.muted,
              marginTop: 8,
            }}
          >
            Please check your internet and try again.
          </Text>

          <Pressable
            onPress={loadScans}
            accessibilityRole="button"
            style={{ paddingVertical: 16 }}
          >
            <Text
              style={{
                color: colors.green,
                fontWeight: '800',
              }}
            >
              Try again
            </Text>
          </Pressable>
        </View>
      ) : scans.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.white,
            padding: 24,
            borderRadius: 20,
            alignItems: 'center',
          }}
        >
<Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: '800',
              marginTop: 12,
            }}
          >
            No checks yet
          </Text>

          <Text
            style={{
              color: colors.muted,
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 24,
              marginTop: 9,
            }}
          >
            Your saved leaf reports will appear here
            after you check your first plant.
          </Text>

          <Pressable
            onPress={() => navigation.navigate('Scan')}
            accessibilityRole="button"
            style={{
              marginTop: 17,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: colors.green,
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              Take a leaf photo
            </Text>
          </Pressable>
        </View>
      ) : (
        scans.map((scan) => (
          <RecentScanCard
            key={scan.id}
            scan={scan}
            onPress={() => openReport(scan)}
          />
        ))
      )}
    </ScreenLayout>
  );
}
