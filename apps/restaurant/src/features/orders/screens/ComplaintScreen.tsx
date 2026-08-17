import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';

const BRAND_PRIMARY = '#14532D';
const BRAND_ACCENT = '#F59E0B';

const COMPLAINT_TYPES = [
  'Order Issue',
  'Payment Issue',
  'Customer Issue',
  'Delivery Issue',
  'Menu Issue',
  'Other',
];

export function ComplaintScreen() {
  const [complaintType, setComplaintType] = useState('Order Issue');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      return;
    }

    // TODO: Connect this to backend complaint API later.
    console.log('Complaint submitted:', {
      complaintType,
      description,
      orderId,
    });

    setIsSubmitted(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}
    >
      {/* HEADER */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            color: BRAND_PRIMARY,
          }}
        >
          Raise a Complaint
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: '#64748B',
          }}
        >
          Tell us about the issue and our support team will review it.
        </Text>
      </View>

      {/* COMPLAINT FORM */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E2E8F0',
          borderRadius: 14,
          padding: 18,
          gap: 18,
        }}
      >
        {/* COMPLAINT TYPE */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#334155',
            }}
          >
            Complaint Type
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {COMPLAINT_TYPES.map((type) => {
              const selected = complaintType === type;

              return (
                <Pressable
                  key={type}
                  onPress={() => setComplaintType(type)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selected
                      ? BRAND_PRIMARY
                      : '#F8FAFC',
                    borderWidth: 1,
                    borderColor: selected
                      ? BRAND_PRIMARY
                      : '#CBD5E1',
                  }}
                >
                  <Text
                    style={{
                      color: selected ? '#FFFFFF' : '#475569',
                      fontWeight: selected ? 'bold' : '500',
                      fontSize: 13,
                    }}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ORDER ID */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#334155',
            }}
          >
            Order ID
            <Text
              style={{
                color: '#94A3B8',
                fontWeight: '400',
              }}
            >
              {' '}
              (Optional)
            </Text>
          </Text>

          <TextInput
            value={orderId}
            onChangeText={setOrderId}
            placeholder="Example: ORD-2026-0801"
            placeholderTextColor="#94A3B8"
            style={{
              borderWidth: 1,
              borderColor: '#CBD5E1',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: '#0F172A',
            }}
          />
        </View>

        {/* DESCRIPTION */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#334155',
            }}
          >
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your complaint..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{
              minHeight: 140,
              borderWidth: 1,
              borderColor: '#CBD5E1',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: '#0F172A',
            }}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <Pressable
          onPress={handleSubmit}
          disabled={!description.trim()}
          style={{
            backgroundColor: description.trim()
              ? BRAND_PRIMARY
              : '#CBD5E1',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            📝 Submit Complaint
          </Text>
        </Pressable>
      </View>

      {/* SUCCESS MESSAGE */}
      {isSubmitted && (
        <View
          style={{
            backgroundColor: '#DCFCE7',
            borderWidth: 1,
            borderColor: '#86EFAC',
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontWeight: 'bold',
            }}
          >
            ✅ Complaint submitted successfully
          </Text>

          <Text
            style={{
              color: '#166534',
              marginTop: 4,
              fontSize: 13,
            }}
          >
            Your complaint is ready to be sent to the support team.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}