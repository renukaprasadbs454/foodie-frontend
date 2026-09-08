'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
const MapContainer = dynamic(() => import('react-leaflet').then(m=>m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m=>m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m=>m.Marker), { ssr: false });
function LocationPicker({ setPos, setAddr }: any) {
  const Comp = () => {
    const { useMapEvents } = require('react-leaflet');
    useMapEvents({
      click(e: any) {
        setPos(e.latlng);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`).then(r=>r.json()).then(d=>setAddr(d.display_name));
      }
    });
    return null;
  };
  return <Comp />;
}
export default function LocationManagerFree() {
  const [pos, setPos] = useState({ lat: 12.921, lng: 76.051 });
  const [addr, setAddr] = useState("Arkalgud, Karnataka - Click map to change");
  const L = typeof window !== 'undefined' ? require('leaflet') : null;
  const icon = L ? L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] }) : null;
  return (
    <div style={{padding:20}}>
      <h2 style={{fontWeight:'bold', fontSize:20, marginBottom:10}}>📍 Location Management - FREE Map</h2>
      <p style={{marginBottom:10, color:'#555'}}>{addr}</p>
      <div style={{height:'500px', width:'100%', borderRadius:12, overflow:'hidden', border:'1px solid #ddd'}}>
        <MapContainer center={pos} zoom={14} style={{height:'100%', width:'100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {icon && <Marker position={pos} icon={icon} />}
          <LocationPicker setPos={setPos} setAddr={setAddr} />
        </MapContainer>
      </div>
      <p style={{marginTop:10}}>Lat: {pos.lat.toFixed(6)} | Lng: {pos.lng.toFixed(6)}</p>
      <button onClick={()=>alert(`Saved: ${addr}`)} style={{background:'#ff6600', color:'white', padding:'10px 20px', borderRadius:8, marginTop:10, border:'none'}}>Save Location</button>
    </div>
  );
}
