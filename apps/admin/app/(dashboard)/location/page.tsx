'use client';
import dynamic from 'next/dynamic';
const LocationManagerFree = dynamic(() => import('@/components/LocationManagerFree'), { ssr: false });
export default function Page(){ return <LocationManagerFree /> }
