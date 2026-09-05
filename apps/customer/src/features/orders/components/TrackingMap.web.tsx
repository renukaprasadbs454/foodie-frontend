import React from 'react';
import { View } from 'react-native';
import { Text } from 'foodie-shared-rn';
export function TrackingMap() {
  return (
    <View style={{ height: 200, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
      <Text style={{ color: '#14532D', fontWeight: '800' }}>Live tracking available on mobile app</Text>
    </View>
  );
}
