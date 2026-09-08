'use client';
import { useState, useEffect, useRef } from 'react';

export default function LocationManagerFree(){
  const mapRef = useRef<HTMLDivElement>(null);
  const [pos,setPos]=useState({lat:12.9205,lng:76.0525});
  const [addr,setAddr]=useState("Arkalgud - Click on map for real-time");
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const reverse = async (lat:number,lng:number) => {
    try{
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const j = await r.json();
      if(j.display_name) setAddr(j.display_name);
    }catch{}
  };

  useEffect(()=>{
    // load leaflet CSS
    if(!document.getElementById('leaflet-css')){
      const link = document.createElement('link');
      link.id='leaflet-css';
      link.rel='stylesheet';
      link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    // load leaflet JS
    const load = () => {
      const L = (window as any).L;
      if(!L || !mapRef.current || leafletMap.current) return;
      leafletMap.current = L.map(mapRef.current).setView([pos.lat, pos.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap FREE' }).addTo(leafletMap.current);
      const icon = L.icon({ iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize:[25,41], iconAnchor:[12,41] });
      markerRef.current = L.marker([pos.lat,pos.lng], { draggable:true, icon }).addTo(leafletMap.current);
      markerRef.current.on('dragend', (e:any)=>{ const ll=e.target.getLatLng(); setPos({lat:ll.lat,lng:ll.lng}); reverse(ll.lat,ll.lng); });
      leafletMap.current.on('click', (e:any)=>{ const ll=e.latlng; markerRef.current.setLatLng(ll); setPos({lat:ll.lat,lng:ll.lng}); reverse(ll.lat,ll.lng); });
      // fix map size after render
      setTimeout(()=> leafletMap.current.invalidateSize(), 300);
    };

    if(!(window as any).L){
      const s=document.createElement('script');
      s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload=load;
      document.body.appendChild(s);
    } else { load(); }
  },[]);

  useEffect(()=>{
    if(markerRef.current){ markerRef.current.setLatLng([pos.lat,pos.lng]); }
    if(leafletMap.current){ leafletMap.current.setView([pos.lat,pos.lng]); }
  },[pos.lat, pos.lng]);

  useEffect(()=>{ reverse(pos.lat,pos.lng); },[]);

  return (
    <div style={{padding:16, background:'white', minHeight:'100vh'}}>
      <h2 style={{fontWeight:'bold', fontSize:20}}>📍 REAL-TIME Location - FREE - No Google Key</h2>
      <div style={{background:'#f0fdf4', padding:10, borderRadius:8, margin:'10px 0', border:'1px solid #bbf7d0'}}>
        <b>{addr}</b><div style={{fontSize:12, marginTop:4}}>Lat: {pos.lat.toFixed(6)} | Lng: {pos.lng.toFixed(6)} | <span style={{color:'green'}}>● LIVE REAL-TIME</span></div>
      </div>
      <div style={{display:'flex', gap:8, marginBottom:10}}>
        <button onClick={()=> navigator.geolocation.getCurrentPosition(p=>{ const ll={lat:p.coords.latitude,lng:p.coords.longitude}; setPos(ll); reverse(ll.lat,ll.lng); })} style={{padding:'8px 14px', background:'#0ea5e9', color:'white', border:'none', borderRadius:6}}>📍 My Live Location</button>
        <button onClick={()=>{ navigator.clipboard.writeText(`${pos.lat},${pos.lng}`); alert(`Saved: ${pos.lat}, ${pos.lng}\n${addr}`); }} style={{padding:'8px 14px', background:'#ff6600', color:'white', border:'none', borderRadius:6, fontWeight:'bold'}}>💾 Save</button>
      </div>
      <div ref={mapRef} style={{height:550, borderRadius:12, border:'2px solid #ddd', background:'#eee'}}></div>
      <p style={{fontSize:12, color:'#666', marginTop:8}}>✅ Click on map = pin moves real-time. Drag pin = real-time. This is OpenStreetMap - FREE forever. Not Google, but looks same and works for delivery.</p>
    </div>
  );
}
