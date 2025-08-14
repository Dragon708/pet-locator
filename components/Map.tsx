'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

type Place = {
    id: string
    lat: number
    lon: number
    name: string
    category: string
    tags: Record<string, string>
}

function FlyTo({ lat, lon, zoom = 13 }: { lat: number, lon: number, zoom?: number }) {
    const map = useMap()
    useEffect(() => { map.flyTo([lat, lon], zoom) }, [lat, lon, zoom, map])
    return null
}

function FitToPlaces({ places }: { places: Place[] }) {
    const map = useMap()
    useEffect(() => {
        if (!places || places.length === 0) return
        const b = L.latLngBounds(places.map(p => [p.lat, p.lon] as [number, number]))
        map.fitBounds(b.pad(0.2), { animate: true })
    }, [places, map])
    return null
}

// Iconos
const iconDefault = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
    iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -30],
})
const iconSelected = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5693/5693969.png',
    iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -32],
})
const iconCenter = new L.DivIcon({
    className: 'center-pin',
    html: `<div style="width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid white;box-shadow:0 0 0 2px #2563eb"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
})

export default function MapView({
    center,
    places,
    radius,
    selectedId,
    onSelectMarker,
}: {
    center: { lat: number, lon: number } | null
    places: Place[]
    radius?: number
    selectedId?: string | null
    onSelectMarker?: (id: string) => void
}) {
    const defaultCenter = center ? [center.lat, center.lon] as [number, number] : [40.4168, -3.7038]

    const selectedPlace = useMemo(() => places.find(p => p.id === selectedId) || null, [places, selectedId])

    return (
        <MapContainer style={{ height: '100%', width: '100%' }} center={[defaultCenter[0], defaultCenter[1]]} zoom={12} scrollWheelZoom>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                subdomains={['a', 'b', 'c', 'd']} />
            {center && <FlyTo lat={center.lat} lon={center.lon} zoom={13} />}
            {!center && places.length > 0 && <FitToPlaces places={places} />}

            {/* Center + radius */}
            {center && (
                <>
                    <Marker position={[center.lat, center.lon]} icon={iconCenter} />
                    {radius && <Circle center={[center.lat, center.lon]} radius={radius} pathOptions={{ fillOpacity: 0.05 }} />}
                </>
            )}

            {/* Markers */}
            {places.map((p, idx) => {
                const isSel = p.id === selectedId
                return (
                    <Marker
                        key={p.id}
                        position={[p.lat, p.lon]}
                        icon={isSel ? iconSelected : iconDefault}
                        eventHandlers={{
                            click: () => onSelectMarker?.(p.id),
                        }}
                    >
                        <Popup>
                            <strong>{idx + 1}. {p.name}</strong><br />
                            <span className="text-xs">{p.category}</span>
                        </Popup>
                    </Marker>
                )
            })}

            {/* Fly to selected place */}
            {selectedPlace && <FlyTo lat={selectedPlace.lat} lon={selectedPlace.lon} zoom={15} />}
        </MapContainer>
    )
}
