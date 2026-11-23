import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../constants/colors';

// This screen shows only information RETURNED by FastAPI.
export default function ResultScreen({ navigation, route }) {
  const { result, imageUri } = route.params;
  const report = result.report || result;
  const status = result.status || 'diseased';
  const [showHeatmap, setShowHeatmap] = useState(false);

  const healthy = status === 'healthy' || String(report.disease_name || report.disease || '').toLowerCase().includes('healthy');
  const lowConfidence = status === 'low_confidence';
  const visual = report.annotated_image || report.visualization;
  const heatmap = report.heatmap_image || report.heatmap;
  const visibleImage = showHeatmap ? heatmap : visual;
  const imageSource = typeof visibleImage === 'string' ? { uri: visibleImage } : null;
  const confidence = Number(report.confidence || 0);

  return (
    <ScreenLayout>
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.green }}>← Back</Text>
      </Pressable>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Plant health result</Text>
      <View style={{ backgroundColor: colors.white, padding: 22, borderRadius: 20, marginTop: 18, marginBottom: 18 }}>
        <Text style={{ color: lowConfidence ? colors.warning : healthy ? colors.green : colors.red, fontSize: 24, fontWeight: '800' }}>
          {lowConfidence ? 'Please try another photo' : healthy ? 'Your leaf looks healthy' : report.disease_name || report.disease || 'Disease detected'}
        </Text>
        {lowConfidence ? (
          <Text style={{ color: colors.muted, lineHeight: 24, marginTop: 10 }}>We could not identify this leaf confidently. Take a clearer photo and try again.\nبراہ کرم صاف تصویر دوبارہ لیں۔</Text>
        ) : (
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 16 }}>Model confidence: {confidence.toFixed(1)}%</Text>
        )}
        {!healthy && !lowConfidence && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>Affected leaf area: <Text style={{ fontWeight: '800' }}>{report.severity_percent ?? report.estimated_affected_area ?? '—'}%</Text></Text>
            <Text style={{ color: colors.text, marginTop: 8, fontSize: 18 }}>Level: <Text style={{ fontWeight: '800' }}>{report.severity_level || 'Not available'}</Text></Text>
          </View>
        )}
      </View>
      {imageUri && <Image source={{ uri: imageUri }} style={{ height: 225, width: '100%', borderRadius: 18, backgroundColor: colors.white }} resizeMode="contain" />}
      {!healthy && !lowConfidence && imageSource && (
        <View style={{ marginTop: 21 }}>
          <Text style={{ fontWeight: '800', fontSize: 20, color: colors.text, marginBottom: 9 }}>{showHeatmap ? 'Disease heatmap' : 'Affected areas (red)'}</Text>
          <Image source={imageSource} style={{ width: '100%', height: 270, backgroundColor: '#000', borderRadius: 17 }} resizeMode="contain" />
          {heatmap && <PrimaryButton title={showHeatmap ? 'Show affected areas' : 'View disease heatmap'} secondary onPress={() => setShowHeatmap(!showHeatmap)} />}
        </View>
      )}
      {!lowConfidence && <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 23, marginTop: 20 }}>This is an automated estimate. For treatment decisions, consult trusted local agricultural guidance.</Text>}
      <PrimaryButton title="Check another leaf" onPress={() => navigation.navigate('MainTabs', { screen: 'Scan' })} />
    </ScreenLayout>
  );
}
