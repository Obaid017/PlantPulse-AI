import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../constants/colors';
import { checkLeaf } from '../services/predictionService';

export default function ScanScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [busy, setBusy] = useState(false);

  async function chooseImage(source) {
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return Alert.alert('Camera permission needed', 'Please allow the camera to take a leaf photo.');
      }
      const options = { mediaTypes: ['images'], quality: 0.85, allowsEditing: false };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets?.length) setImageUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Unable to open photos', error.message);
    }
  }

  async function handleCheck() {
    if (!imageUri) return Alert.alert('Choose a photo', 'Please select a groundnut leaf image first.');
    setBusy(true);
    try {
      const result = await checkLeaf(imageUri);
      navigation.getParent()?.navigate('Result', { result, imageUri });
    } catch (error) {
      Alert.alert('Unable to check leaf', error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 28, color: colors.text, fontWeight: '800', marginBottom: 8 }}>Check a leaf</Text>
      <Text style={{ color: colors.muted, fontSize: 16, marginBottom: 23 }}>Take a clear photo of your groundnut leaf.</Text>

      <View style={{ borderRadius: 24, borderColor: colors.border, borderWidth: 2, borderStyle: 'dashed', height: 270, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 19 }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        ) : (
          <View style={{ alignItems: 'center', padding: 25 }}>
            <Text style={{ fontSize: 60 }}>🌿</Text>
            <Text style={{ textAlign: 'center', color: colors.muted, fontSize: 16, marginTop: 9 }}>Your leaf photo will appear here.</Text>
          </View>
        )}
      </View>
      <PrimaryButton title="Take photo  •  تصویر لیں" onPress={() => chooseImage('camera')} secondary />
      <PrimaryButton title="Choose from gallery  •  گیلری" onPress={() => chooseImage('gallery')} secondary />
      <View style={{ marginTop: 10 }}>
        <PrimaryButton title="Check Leaf" onPress={handleCheck} disabled={!imageUri} loading={busy} />
      </View>
      <View style={{ backgroundColor: '#FFF8EA', padding: 18, marginTop: 25, borderRadius: 18 }}>
        <Text style={{ color: colors.warning, fontWeight: '800', marginBottom: 6 }}>Tips for a good photo</Text>
        <Text style={{ color: colors.text, fontSize: 14, lineHeight: 23 }}>• Keep the leaf in focus.\n• Take the photo in good light.\n• Try to show the complete leaf.</Text>
      </View>
    </ScreenLayout>
  );
}
