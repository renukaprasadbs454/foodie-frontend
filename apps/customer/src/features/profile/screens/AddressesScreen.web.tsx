import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, EmptyState, Text, TextInput, Modal, Toast, trackAnalyticsEvent, useApiErrorHandler, useConnectivity, useTheme } from 'foodie-shared-rn';
import { useAddAddressMutation, useGetAddressesQuery, useRemoveAddressMutation } from '../../../api/endpoints/addressesApi';
import { toUnwrappedApiError } from '../../auth/apiError';
import type { BrowseStackParamList, ProfileStackParamList } from '../../../navigation/types';
import { AddressCard } from '../components/AddressCard';
import { AddressListSkeleton } from '../components/AddressListSkeleton';
import { validateAddressForm } from '../types';
type Props = any;
export function AddressesScreen({ navigation, route }: Props) {
  const { tokens } = useTheme(); const { isConnected } = useConnectivity(); const selectMode = Boolean((route.params as any)?.selectMode);
  const addressesQuery = useGetAddressesQuery(); const [addAddress, addState] = useAddAddressMutation(); const [removeAddress, removeState] = useRemoveAddressMutation();
  const [formVisible, setFormVisible] = useState(false); const [removingId, setRemovingId] = useState<string | null>(null);
  const [label, setLabel] = useState(''); const [line1, setLine1] = useState(''); const [line2, setLine2] = useState(''); const [city, setCity] = useState(''); const [pincode, setPincode] = useState(''); const [latitude, setLatitude] = useState('12.9716'); const [longitude, setLongitude] = useState('77.5946');
  const [toast, setToast] = useState<{ message: string; variant: any } | null>(null);
  const handleError = useApiErrorHandler({ onToast: (e) => setToast({ message: e.message, variant: 'error' }), onModalBlocking: (e) => setToast({ message: e.message, variant: 'error' }), onInlineField: (e) => setToast({ message: e.message, variant: 'error' }), onFullScreen: (e) => setToast({ message: e.message, variant: 'error' }), onGeneric: (e) => setToast({ message: e.message, variant: 'error' }), });
  useEffect(() => { trackAnalyticsEvent('customer_addresses_viewed'); }, []);
  const resetForm = () => { setLabel('Home'); setLine1(''); setLine2(''); setCity(''); setPincode(''); setLatitude('12.9716'); setLongitude('77.5946'); };
  const openAddForm = () => { resetForm(); setFormVisible(true); };
  const onAdd = async () => {
    const validated = validateAddressForm({ label, line1, line2, city, pincode, latitude, longitude, isDefault: true });
    if (!validated.ok) { setToast({ message: validated.message, variant: 'error' }); return; }
    if (!isConnected) { setToast({ message: 'Connect to internet to add address.', variant: 'warning' }); return; }
    try { const created = await addAddress(validated.value).unwrap(); trackAnalyticsEvent('address_added', { addressId: created.addressId }); setFormVisible(false); resetForm(); setToast({ message: 'Address added.', variant: 'success' }); if (selectMode) navigation.goBack(); } catch (error) { handleError(toUnwrappedApiError(error)); }
  };
  const onRemove = async (addressId: string) => { if (!isConnected) { setToast({ message: 'Connect to internet.', variant: 'warning' }); return; } setRemovingId(addressId); try { await removeAddress(addressId).unwrap(); setToast({ message: 'Address removed.', variant: 'success' }); } catch (e) { handleError(toUnwrappedApiError(e)); } finally { setRemovingId(null); } };
  const addresses = addressesQuery.data?? [];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#14532D' }} edges={['top','left','right']}>
      <View style={{ flex: 1, backgroundColor: tokens.color.background }}>
        <FlatList style={{ flex: 1 }} data={addresses} keyExtractor={(i) => i.addressId} contentContainerStyle={{ paddingBottom: 48, flexGrow: 1 }} refreshControl={<RefreshControl refreshing={addressesQuery.isFetching} onRefresh={() => { void addressesQuery.refetch(); }} />}
          ListHeaderComponent={<View style={{ paddingTop: 12, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#14532D', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 16 }}><Text style={{ color: '#FCD34D', fontWeight: '900', fontSize: 24 }}>Delivery Addresses</Text></View>}
          ListEmptyComponent={<View style={{ paddingHorizontal: tokens.spacing.md }}><EmptyState title="No addresses yet" description="Add a delivery address." actionLabel="Add New Address" onAction={openAddForm} /></View>}
          ListFooterComponent={<View style={{ paddingHorizontal: tokens.spacing.md, marginTop: 16 }}><Pressable onPress={openAddForm} style={{ backgroundColor: '#14532D', borderRadius: 12, padding: 14, alignItems: 'center' }}><Text style={{ color: '#FFF', fontWeight: '900' }}>+ Add New Address</Text></Pressable></View>}
          renderItem={({ item }) => (<View style={{ paddingHorizontal: tokens.spacing.md, marginVertical: tokens.spacing.xs }}><AddressCard address={item} selectMode={selectMode} removing={removingId===item.addressId} onRemove={() => { void onRemove(item.addressId); }} onSelect={selectMode? () => { navigation.goBack(); } : undefined} /></View>)} />
        <Modal visible={formVisible} onRequestClose={() => setFormVisible(false)} title="Add Delivery Address"><ScrollView style={{ maxHeight: 600 }}><View style={{ gap: tokens.spacing.md }}><View style={{ flexDirection: 'row', gap: 8 }}>{['Home','Work','Other'].map(l => (<Pressable key={l} onPress={() => setLabel(l)} style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: label===l? '#14532D' : tokens.color.border, backgroundColor: label===l? '#14532D' : tokens.color.surface, alignItems: 'center' }}><Text style={{ color: label===l? '#FFF' : tokens.color.textSecondary, fontWeight: '800' }}>{l}</Text></Pressable>))}</View><TextInput label="Address" value={line1} onChangeText={setLine1} /><TextInput label="Landmark" value={line2} onChangeText={setLine2} /><View style={{ flexDirection: 'row', gap: 8 }}><View style={{ flex: 1 }}><TextInput label="City" value={city} onChangeText={setCity} /></View><View style={{ flex: 1 }}><TextInput label="Pincode" value={pincode} onChangeText={setPincode} /></View></View><Button label="Save Address" loading={addState.isLoading} onPress={() => { void onAdd(); }} /></View></ScrollView></Modal>
        <Toast visible={Boolean(toast)} message={toast?.message??''} variant={toast?.variant??'info'} onDismiss={() => setToast(null)} />
      </View>
    </SafeAreaView>
  );
}
