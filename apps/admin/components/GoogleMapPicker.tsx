'use client'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
function ClickHandler({ onAdd }: any) {
  useMapEvents({ click(e) { onAdd({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  return null
}
export default function FreeMap({ value = [], onChange, center = { lat: 12.9716, lng: 77.5946 } }: any) {
  const zones = value || []
  const handleAdd = (latlng: any) => { onChange?.([...zones, latlng]) }
  const handleRemove = (index: number) => { onChange?.(zones.filter((_: any, i: number) => i !== index)) }
  return (
    <div>
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onAdd={handleAdd} />
        {zones.map((z: any, i: number) => (
          <Marker key={i} position={[z.lat, z.lng]} icon={icon}>
            <Popup>Zone {i+1}<br/><button onClick={() => handleRemove(i)} style={{color:'red', marginTop:5}}>Remove</button></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}