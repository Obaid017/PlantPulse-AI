import { saveCompletedScan } from '../services/scanSaveService';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import ScreenLayout from '../components/ScreenLayout';
import DiagnosisResultScreen from './DiagnosisResultScreen';
import { predictLeaf } from '../services/predictionService';

const GREEN = '#183D2B';
const MUTED = '#64756B';

export default function ScanScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [checking, setChecking] = useState(false);

  async function choosePhoto(source) {
    try {
      let result;

      if (source === 'camera') {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Camera Permission',
            'Please allow camera access to take a leaf photo.'
          );
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.85,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.85,
        });
      }

      if (!result.canceled && result.assets?.length) {
        setPhoto(result.assets[0]);
        setPrediction(null);
      }
    } catch (error) {
      console.error('Photo selection:', error);

      Alert.alert(
        'Photo Unavailable',
        'Could not open the photo. Please try again.'
      );
    }
  }

  
async function checkPlant() {
  if (!photo || checking) return;

  setChecking(true);

  try {
    // 1. Get real prediction from FastAPI
    const result = await predictLeaf(photo);

    // 2. Show the result, even if saving later fails
    setPrediction(result);

    // 3. Save successful reports to Supabase
    if (result.status === 'healthy' ||
        result.status === 'diseased') {

      try {
        await saveCompletedScan(photo, result);
        console.log('Scan saved successfully');

      } catch (saveError) {
        console.error('Could not save report:', saveError);

        Alert.alert(
          'Report Not Saved',
          'Your plant check is ready, but we could not save it to Past Checks. Please check your connection.'
        );
      }
    }

  } catch (error) {
    Alert.alert(
      'Could Not Check Your Plant',
      error.message || 'Please try again.'
    );

  } finally {
    setChecking(false);
  }
}


  function checkAnotherLeaf() {
    setPhoto(null);
    setPrediction(null);
  }

  return (
    <ScreenLayout>
      {prediction ? (
        <DiagnosisResultScreen
          prediction={prediction}
          photoUri={photo.uri}
          onCheckAnother={checkAnotherLeaf}
          onViewTreatment={() => navigation.getParent()?.navigate('Treatment', {
            diseaseName: prediction.disease_name,
            status: prediction.status,
            severityLevel: prediction.severity_level,
            severityPercent: prediction.severity_percent,
          })}
          onShareCommunity={() => navigation.getParent()?.navigate('CommunityDraft', {
            diseaseName: prediction.disease_name,
            status: prediction.status,
            severityPercent: prediction.severity_percent,
            imageUri: photo.uri,
          })}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.heading}>Check Your Plant</Text>
          <Text style={styles.subtitle}>
            Take or choose a clear photo of a groundnut leaf.
          </Text>
          <Text style={styles.urdu}>
            مونگ پھلی کے پتے کی صاف تصویر لیں۔
          </Text>

          {photo ? (
            <View style={styles.photoCard}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.preview}
                resizeMode="contain"
              />

              <Pressable
                onPress={() => setPhoto(null)}
                disabled={checking}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>
                  Remove Photo
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>🌿</Text>
              <Text style={styles.placeholderTitle}>
                Your leaf photo will appear here
              </Text>
              <Text style={styles.placeholderHint}>
                Place the leaf in good light.
              </Text>
            </View>
          )}

          <Pressable
            style={styles.photoButton}
            disabled={checking}
            onPress={() => choosePhoto('camera')}
            accessibilityRole="button"
          >
            <Text style={styles.photoButtonText}>
              📷  Take Photo
            </Text>
          </Pressable>

          <Pressable
            style={styles.galleryButton}
            disabled={checking}
            onPress={() => choosePhoto('gallery')}
            accessibilityRole="button"
          >
            <Text style={styles.galleryButtonText}>
              Choose From Gallery
            </Text>
          </Pressable>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>
              For a better result
            </Text>
            <Text style={styles.tipText}>
              • Use good lighting.
            </Text>
            <Text style={styles.tipText}>
              • Keep the whole leaf visible.
            </Text>
            <Text style={styles.tipText}>
              • Avoid blurry photos.
            </Text>
          </View>

          <Pressable
            style={[
              styles.checkButton,
              (!photo || checking) && styles.disabledButton,
            ]}
            disabled={!photo || checking}
            onPress={checkPlant}
            accessibilityRole="button"
          >
            {checking ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={GREEN} />
                <Text style={styles.checkButtonText}>
                  Checking your plant...
                </Text>
              </View>
            ) : (
              <Text style={styles.checkButtonText}>
                Check My Plant
              </Text>
            )}
          </Pressable>

          {checking && (
            <Text style={styles.waitText}>
              Please keep this screen open while we check your leaf.
            </Text>
          )}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  heading: {
    color: GREEN,
    fontSize: 29,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 10,
  },
  subtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
  },
  urdu: {
    color: GREEN,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 20,
  },
  placeholder: {
    height: 230,
    backgroundColor: '#E5EDE1',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 18,
  },
  placeholderIcon: {
    fontSize: 46,
    marginBottom: 12,
  },
  placeholderTitle: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholderHint: {
    color: MUTED,
    fontSize: 14,
    marginTop: 8,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    marginBottom: 18,
  },
  preview: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    backgroundColor: '#E7EDE3',
  },
  removeButton: {
    alignItems: 'center',
    padding: 12,
  },
  removeText: {
    color: '#AA4938',
    fontSize: 15,
    fontWeight: '700',
  },
  photoButton: {
    backgroundColor: GREEN,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  galleryButton: {
    borderColor: GREEN,
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  galleryButtonText: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '700',
  },
  tips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  tipsTitle: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  tipText: {
    color: MUTED,
    fontSize: 15,
    marginBottom: 6,
  },
  checkButton: {
    backgroundColor: '#E5F0A5',
    padding: 19,
    alignItems: 'center',
    borderRadius: 18,
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkButtonText: {
    color: GREEN,
    fontSize: 18,
    fontWeight: '800',
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  waitText: {
    color: MUTED,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 12,
  },
});
