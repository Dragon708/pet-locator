'use client'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

type Place = { id: string, lat: number, lon: number, name: string, category: string, tags: Record<string, string> }

function FlyTo({ lat, lon, zoom = 13 }: { lat: number, lon: number, zoom?: number }) {
    const map = useMap()
    useEffect(() => { map.flyTo([lat, lon], zoom) }, [lat, lon, zoom, map])
    return null
}

export default function MapView({ center, places }: { center: { lat: number, lon: number } | null, places: Place[] }) {
    const defaultCenter = center ? [center.lat, center.lon] as [number, number] : [40.4168, -3.7038]

    return (
        <MapContainer style={{ height: '70vh', width: '100%' }} center={defaultCenter} zoom={12} scrollWheelZoom>
            <TileLayer

                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && <FlyTo lat={center.lat} lon={center.lon} />}
            {places.map(p => (
                <Marker key={p.id} position={[p.lat, p.lon]}>
                    <Popup>
                        <strong>{p.name}</strong><br />
                        {p.category}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
