'use client'
import { useEffect, useMemo, useState } from 'react'

type Feature = { id: string | number, name: string, label: string, lat: number, lon: number }

export default function Search({ onSelect }: { onSelect: (f: Feature) => void }) {
    const [q, setQ] = useState('')
    const [items, setItems] = useState<Feature[]>([])
    const [loading, setLoading] = useState(false)

    const debouncedFetch = useMemo(() => {
        let t: any
        return (value: string) => {
            clearTimeout(t)
            t = setTimeout(async () => {
                if (!value || value.length < 2) { setItems([]); return }
                setLoading(true)
                try {
                    const r = await fetch(`/api/autocomplete?q=${encodeURIComponent(value)}`)
                    const data = await r.json()
                    setItems(data.features || [])
                } finally {
                    setLoading(false)
                }
            }, 250)
        }
    }, [])

    useEffect(() => { debouncedFetch(q) }, [q, debouncedFetch])

    return (
        <div className="w-full max-w-xl mx-auto relative">
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca una ciudad, barrio o dirección…"
                className="w-full border rounded-lg px-4 py-3 shadow-sm outline-none"
            />
            {loading && <div className="absolute right-3 top-3 text-sm opacity-60">…</div>}
            {items.length > 0 && (
                <ul className="absolute z-10 mt-2 w-full bg-white text-black border rounded-lg max-h-72 overflow-auto shadow">
                    {items.map((it) => (
                        <li key={it.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { onSelect(it); setItems([]); }}>
                            {it.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
