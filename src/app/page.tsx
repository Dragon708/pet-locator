'use client'
import { useEffect, useState } from 'react'
import MapView from '../../components/Map'
import Search from '../../components/Search'

type Feature = { id: string | number, name: string, label: string, lat: number, lon: number }
type Place = { id: string, lat: number, lon: number, name: string, category: string, tags: Record<string, string> }

export default function HomePage() {
  const [center, setCenter] = useState<{ lat: number, lon: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [radius, setRadius] = useState(4000)

  useEffect(() => {
    const load = async () => {
      if (!center) return
      const r = await fetch(`/api/places?lat=${center.lat}&lon=${center.lon}&radius=${radius}`)
      const data = await r.json()
      setPlaces(data.places || [])
    }
    load()
  }, [center, radius])

  return (
    <main>
      <section className="py-16 text-center">
        <h1 className="text-3xl font-bold mb-3">Encuentra servicios para mascotas cerca</h1>
        <Search onSelect={(f: Feature) => setCenter({ lat: f.lat, lon: f.lon })} />
        <div className="text-sm mt-3">
          Radio:
          <select className="ml-2 border rounded px-2 py-1" value={radius} onChange={e => setRadius(Number(e.target.value))}>
            <option value={2000}>2 km</option>
            <option value={4000}>4 km</option>
            <option value={8000}>8 km</option>
          </select>
        </div>
      </section>
      <section className="px-4 pb-16">
        <MapView center={center} places={places} />
      </section>
    </main>
  )
}
