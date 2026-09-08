import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from '@react-google-maps/api';
import { type WebSocketLocation } from 'foodie-shared-rn';

type Props = {
  location: WebSocketLocation | null;
  orderStatus: string;
  restaurantLocation?: { latitude: number; longitude: number };
  customerLocation?: { latitude: number; longitude: number };
  onEtaUpdate?: (etaMins: number) => void;
};

const mapContainerStyle = { width: '100%', height: '100%' };

export function TrackingMap({ location, orderStatus, restaurantLocation, customerLocation, onEtaUpdate }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAijy9SaRVvpovkb5lW_Fc7uqvfvFhMhlo",
  });

  const [routeCoords, setRouteCoords] = useState<google.maps.LatLngLiteral[]>([]);

  const isDriverToResto = orderStatus === 'ASSIGNED' || orderStatus === 'READY_FOR_PICKUP';
  let originLocation = location? { lat: location.lat, lng: location.lng } : null;
  let targetLocation = isDriverToResto? restaurantLocation : customerLocation;

  if (!originLocation && restaurantLocation) {
    originLocation = { lat: restaurantLocation.latitude + 0.015, lng: restaurantLocation.longitude + 0.015 };
  }

  useEffect(() => {
    if (originLocation && targetLocation) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/bike/${originLocation!.lng},${originLocation!.lat};${targetLocation!.longitude},${targetLocation!.latitude}?overview=full&geometries=geojson`
          );
          const data = await res.json();
          if (data?.routes?.[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
            setRouteCoords(coords);
            const eta = Math.ceil(data.routes[0].duration / 60);
            onEtaUpdate?.(eta);
          }
        } catch (e) {
          console.warn(e);
        }
      };
      void fetchRoute();
    }
  }, [originLocation?.lat, originLocation?.lng, targetLocation?.latitude, targetLocation?.longitude]);

  const center = originLocation || (restaurantLocation? { lat: restaurantLocation.latitude, lng: restaurantLocation.longitude } : { lat: 12.9716, lng: 77.5946 });

  if (!isLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#14532D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14} options={{ disableDefaultUI: false, zoomControl: true }}>
          {originLocation && <MarkerF position={originLocation} />}
          {restaurantLocation && <MarkerF position={{ lat: restaurantLocation.latitude, lng: restaurantLocation.longitude }} />}
          {customerLocation && <MarkerF position={{ lat: customerLocation.latitude, lng: customerLocation.longitude }} />}
          {routeCoords.length > 0 && <PolylineF path={routeCoords} options={{ strokeColor: "#14532D", strokeWeight: 5 }} />}
        </GoogleMap>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: -20, marginBottom: 8 },
  mapWrapper: { height: Dimensions.get('window').height * 0.45, borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: '#F59E0B' },
  loader: { height: 300, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 24 },
});