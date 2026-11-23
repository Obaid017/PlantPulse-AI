import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Used on both Home and the full History screen.
export default function RecentScanCard({ scan, onPress }) {
  const healthy = scan.status === 'healthy';
  const title = healthy ? 'Healthy leaf' : scan.disease_name;
  const date = new Date(scan.created_at).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const area = scan.severity_percent == null
    ? '' : `${Number(scan.severity_percent).toFixed(1)}% of leaf affected`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${date}. Open report`}
      style={({ pressed }) => ({
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 19,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{
        width: 49, height: 49, borderRadius: 15,
        backgroundColor: healthy ? colors.lightGreen : '#FFF0E9',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
      }}>
        <Ionicons
          name={healthy ? 'checkmark-circle-outline' : 'leaf-outline'}
          color={healthy ? colors.green : colors.red} size={25}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800' }} numberOfLines={2}>
          {title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>
          {date}
        </Text>
        <Text style={{ color: healthy ? colors.green : colors.warning, fontSize: 13, marginTop: 5, fontWeight: '700' }}>
          {healthy ? 'No disease found' : area || 'Affected leaf'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}
