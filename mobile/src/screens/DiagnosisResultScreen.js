
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GREEN = '#183D2B';
const MUTED = '#64756B';

function ResultImage({ title, uri }) {
  if (!uri) return null;

  return (
    <View style={styles.imageCard}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <Image
        source={{ uri }}
        style={styles.resultImage}
        resizeMode="contain"
      />
    </View>
  );
}

export default function DiagnosisResultScreen({
  prediction,
  photoUri,
  onCheckAnother,
  onViewTreatment,
  onShareCommunity,
}) {
  const status = prediction?.status;

  // A usable segmentation mask is required.
  const hasLeafMask = prediction?.has_leaf_mask === true;

  const severityValue = Number(prediction?.severity_percent);

  const hasAffectedArea =
    prediction?.severity_percent != null &&
    Number.isFinite(severityValue) &&
    severityValue > 0;

  const validSeverityLevels = [
    'Low',
    'Mild',
    'Moderate',
    'Severe',
  ];

  const healthy =
    status === 'healthy' &&
    hasLeafMask;

  const validDisease =
    status === 'diseased' &&
    hasLeafMask &&
    hasAffectedArea &&
    Boolean(prediction?.disease_name) &&
    validSeverityLevels.includes(prediction?.severity_level);

  // Anything not confidently usable is treated as uncertain.
  const uncertain = !healthy && !validDisease;

  const title = uncertain
    ? 'Please take another leaf photo'
    : healthy
      ? 'Your leaf looks healthy'
      : prediction.disease_name;

  const confidenceValue = Number(prediction?.confidence);

  const confidence =
    prediction?.confidence != null &&
    Number.isFinite(confidenceValue)
      ? confidenceValue.toFixed(1)
      : null;

  const affectedArea = validDisease
    ? severityValue.toFixed(2)
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Plant Health Report
      </Text>

      <Text style={styles.urdu}>
        پودے کی صحت کی رپورٹ
      </Text>

      <Image
        source={{ uri: photoUri }}
        style={styles.originalImage}
        resizeMode="contain"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.smallLabel}>
          YOUR RESULT
        </Text>

        <Text style={styles.diseaseName}>
          {title}
        </Text>

        <Text style={styles.description}>
          {uncertain
            ? 'We could not confirm a reliable groundnut leaf result. Please take another clear photo of a groundnut leaf.'
            : healthy
              ? 'No disease was identified in this photo. Continue checking your crop regularly.'
              : 'Possible disease detected. Check the affected parts below.'}
        </Text>

        {uncertain && (
          <Text style={styles.urduMessage}>
            مونگ پھلی کے پتے کی صاف تصویر دوبارہ لیں۔
          </Text>
        )}

        {!uncertain && confidence !== null && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              How sure we are
            </Text>

            <Text style={styles.infoValue}>
              {confidence}%
            </Text>
          </View>
        )}

        {validDisease && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Leaf area affected
              </Text>

              <Text style={styles.infoValue}>
                {affectedArea}%
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Affected-area level
              </Text>

              <Text style={styles.infoValue}>
                {prediction.severity_level}
              </Text>
            </View>

            <Text style={styles.note}>
              This affected-area percentage is an estimate
              based on the photographed leaf, not the
              entire field.
            </Text>
          </>
        )}
      </View>

      {validDisease && (
        <>
          <ResultImage
            title="Affected Parts"
            uri={prediction.affected_overlay}
          />

          <ResultImage
            title="Where the Spots Are Concentrated"
            uri={prediction.concentration_heatmap}
          />
        </>
      )}

      {/* Treatment is shown only for usable results. */}
      {!uncertain && (
        <View style={styles.actionGroup}>
          <Pressable
            style={styles.treatmentButton}
            onPress={onViewTreatment}
            accessibilityRole="button"
          >
            <Text style={styles.treatmentText}>
              {healthy
                ? 'View Care & Prevention'
                : 'View Treatment & Recommendations'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.shareButton}
            onPress={onShareCommunity}
            accessibilityRole="button"
          >
            <Text style={styles.shareText}>
              Share to Community
            </Text>
          </Pressable>
        </View>
      )}

      {/* Always allow the farmer to retry. */}
      <Pressable
        style={styles.button}
        onPress={onCheckAnother}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {uncertain
            ? 'Take Another Photo'
            : 'Check Another Leaf'}
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        {uncertain
          ? 'Please photograph a groundnut leaf in good light. No disease diagnosis or treatment recommendation was made.'
          : 'Check your plants regularly. This app helps identify possible problems but does not replace an agriculture expert.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  heading: {
    color: GREEN,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 12,
  },
  urdu: {
    color: MUTED,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 18,
  },
  originalImage: {
    width: '100%',
    height: 230,
    backgroundColor: '#E4EBE0',
    borderRadius: 20,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },
  smallLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  diseaseName: {
    color: GREEN,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  urduMessage: {
    color: GREEN,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5ECE3',
  },
  infoLabel: {
    color: MUTED,
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    color: GREEN,
    fontWeight: '800',
    fontSize: 16,
  },
  note: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    color: GREEN,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 12,
  },
  resultImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#000000',
    borderRadius: 12,
  },
  actionGroup: {
    marginTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  treatmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F0A5',
    padding: 16,
    borderRadius: 17,
    minHeight: 60,
  },
  treatmentText: {
    fontSize: 16,
    fontWeight: '800',
    color: GREEN,
    textAlign: 'center',
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D8',
    borderWidth: 1,
    borderRadius: 17,
    padding: 16,
    minHeight: 60,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E5F0A5',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: GREEN,
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 18,
  },
});
