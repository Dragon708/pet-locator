'use client'

import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import MapView from '../../components/Map'
import Search from '../../components/Search'

type Feature = { id: string | number, name: string, label: string, lat: number, lon: number }
type Place = { id: string, lat: number, lon: number, name: string, category: string, tags: Record<string, string> }

export default function HomePage() {
  const [center, setCenter] = useState<{ lat: number, lon: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [radius, setRadius] = useState(4000)
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const loadPlaces = useCallback(async () => {
    if (!center) return
    setLoading(true)
    try {
      const r = await fetch(`/api/places?lat=${center.lat}&lon=${center.lon}&radius=${radius}`)
      const data = await r.json()
      setPlaces(data.places || [])
      setSelectedId(null)
    } finally {
      setLoading(false)
    }
  }, [center, radius])

  useEffect(() => { loadPlaces() }, [loadPlaces])

  const handleSelectFeature = (f: Feature) => setCenter({ lat: f.lat, lon: f.lon })

  const locateMe = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => { /* ignore */ },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  return (
    <>
      {/* SEO */}
      <Head>
        <title>🐶 PetFinder — Find Vets Near You</title>
        <meta
          name="description"
          content="PetFinder helps you quickly find nearby veterinarians and pet services based on your location."
        />
      </Head>

      <main className="h-[calc(100dvh)] md:h-[100vh] relative">
        {/* Floating Title */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-[2000]">
          <span className="text-2xl">🐶</span>
          <h1 className="text-lg font-semibold text-gray-800">
            PetFinder — Find a Veterinarian Near You
          </h1>
        </div>

        <div className="grid md:grid-cols-[420px,1fr] h-full">
          {/* Map + Search */}
          <section className="relative h-full">
            <Search onSelect={handleSelectFeature} />
            <MapView center={center} places={places} />
          </section>
        </div>
      </main>
    </>
  )
}
