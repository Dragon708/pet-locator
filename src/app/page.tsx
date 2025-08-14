'use client'

import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import Search from '../../components/Search'

const MapView = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>
})

type Feature = { id: string | number, name: string, label: string, lat: number, lon: number }
type Place = { id: string, lat: number, lon: number, name: string, category: string, tags: Record<string, string> }

export default function HomePage() {
  const [center, setCenter] = useState<{ lat: number, lon: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [radius,] = useState(4000)
  const [, setLoading] = useState(false)
  const [, setSelectedId] = useState<string | null>(null)

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

  return (
    <>
      {/* SEO */}
      <Head>
        <title>🐶 VetsFinder — Find Vets Near You</title>
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
            VetsFinder — Find a Veterinarian Near You
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
