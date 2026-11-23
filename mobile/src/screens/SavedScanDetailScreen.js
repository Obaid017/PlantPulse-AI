
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getSavedScanDetail } from '../services/scanSaveService';

const GREEN = '#203D2F';
const MUTED = '#687C70';
const BACKGROUND = '#F1F5EC';

function ReportImage({ title, uri }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {uri ? (
        <Image
          source={{ uri }}
          style={styles.reportImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.muted}>
          No image was saved for this check.
        </Text>
      )}
    </View>
  );
}

export default function SavedScanDetailScreen({
  route,
  navigation,
}) {
  const scanId = route.params?.scanId;
  

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const data = await getSavedScanDetail(scanId);

        if (!cancelled) setReport(data);
      } catch (err) {
        console.error('Saved report:', err);

        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [scanId, retry]);

  const healthy = report?.status === 'healthy';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.heading}>
          Plant health result
        </Text>

        <Text style={styles.muted}>
          پودے کی صحت کی رپورٹ
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.muted}>
              Opening your saved report...
            </Text>
          </View>
        ) : error || !report ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Could not open report
            </Text>
            <Text style={styles.muted}>
              Please check your internet connection.
            </Text>

            <Pressable onPress={() => setRetry(v => v + 1)}>
              <Text style={styles.retry}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.date}>
              Checked on{' '}
              {new Date(report.created_at).toLocaleDateString(
                'en-GB',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }
              )}
            </Text>

            <View style={styles.card}>
              <Text
                style={[
                  styles.disease,
                  { color: healthy ? GREEN : '#B44E3F' },
                ]}
              >
                {report.disease_name}
              </Text>

              <Text style={styles.detail}>
                How sure we are:{' '}
                <Text style={styles.bold}>
                  {Number(report.confidence).toFixed(1)}%
                </Text>
              </Text>

              {healthy ? (
                <Text style={styles.healthy}>
                  ✓ No disease found
                </Text>
              ) : (
                <>
                  <Text style={styles.detail}>
                    Estimated affected leaf area:{' '}
                    <Text style={styles.bold}>
                      {report.severity_percent == null
                        ? 'Not available'
                        : `${Number(
                            report.severity_percent
                          ).toFixed(2)}%`}
                    </Text>
                  </Text>

                  <Text style={styles.detail}>
                    Level:{' '}
                    <Text style={styles.bold}>
                      {report.severity_level || 'Not available'}
                    </Text>
                  </Text>
                </>
              )}
            </View>

            <ReportImage
              title="Original Leaf Photo"
              uri={report.images?.original}
            />

            {!healthy && (
              <>
                <ReportImage
                  title="Affected Parts"
                  uri={report.images?.overlay}
                />

                <ReportImage
                  title="Where the Spots Are Concentrated"
                  uri={report.images?.heatmap}
                />
              </>
            )}

            <Text style={styles.note}>
              This is an automated estimate. For treatment
              decisions, consult trusted local agricultural
              guidance.
            </Text>

            <Pressable
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>
                Back to My Leaf Checks
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    padding: 22,
    paddingBottom: 45,
  },
  back: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 22,
  },
  heading: {
    color: GREEN,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  muted: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
  },
  date: {
    color: MUTED,
    fontSize: 15,
    marginTop: 16,
    marginBottom: 10,
  },
  center: {
    padding: 45,
    alignItems: 'center',
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 22,
    marginTop: 16,
  },
  disease: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 18,
  },
  detail: {
    color: GREEN,
    fontSize: 17,
    marginBottom: 14,
    lineHeight: 26,
  },
  bold: {
    fontWeight: '800',
  },
  healthy: {
    color: GREEN,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    color: GREEN,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  reportImage: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    backgroundColor: '#000000',
  },
  note: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 22,
    marginBottom: 18,
  },
  retry: {
    color: GREEN,
    fontWeight: '800',
    marginTop: 16,
  },
  button: {
    backgroundColor: GREEN,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
