'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Loader2, MapPin, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Feature = { id: string | number, name: string, label: string, lat: number, lon: number }

export default function Search({ onSelect }: { onSelect: (f: Feature) => void }) {
    const [q, setQ] = useState('')
    const [items, setItems] = useState<Feature[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchResults = async (value: string) => {
        if (!value || value.trim().length < 2) { setItems([]); return }
        setLoading(true)
        try {
            const r = await fetch(`/api/autocomplete?q=${encodeURIComponent(value)}`)
            const data = await r.json()
            setItems(data.features || [])
        } finally {
            setLoading(false)
        }
    }

    const onValueChange = (val: string) => {
        setQ(val)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => fetchResults(val), 250)
        if (!open) setOpen(true)
    }

    useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

    return (
        <div className="absolute top-4 left-[5%] z-[1000] w-80">
            {/* Input */}
            <Command className="border rounded-lg shadow-md bg-white relative">
                <div className="flex items-center gap-2 px-2 w-full pt-2 pb-1">
                    <MapPin className="h-4 w-4 opacity-70" />
                    <CommandInput
                        value={q}
                        onValueChange={onValueChange}
                        className="text-sm w-full"
                        placeholder="Search for an address…"
                        onFocus={() => setOpen(true)}
                    />
                    {q && (
                        <button
                            type="button"
                            onClick={() => { setQ(''); setItems([]) }}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </Command>

            {/* Floating list */}
            {open && (
                <div className="absolute mt-1 w-full border rounded-lg bg-white shadow-lg max-h-64 overflow-auto">
                    <Command>
                        <CommandList>
                            {loading && (
                                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                                </div>
                            )}
                            {!loading && items.length === 0 && <CommandEmpty>No results</CommandEmpty>}
                            {items.length > 0 && (
                                <CommandGroup heading="Suggestions">
                                    {items.map((it) => (
                                        <CommandItem
                                            key={it.id}
                                            value={String(it.label)}
                                            onSelect={() => { onSelect(it); setQ(it.label); setOpen(false) }}
                                            className="cursor-pointer"
                                        >
                                            {it.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </div>
            )}


        </div>
    )
}
