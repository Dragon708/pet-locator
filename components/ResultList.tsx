'use client'

type Place = { id: string, lat: number, lon: number, name: string, category: string, tags: Record<string, string> }

export default function ResultsList({
    loading, places, selectedId, onSelect,
}: {
    loading: boolean
    places: Place[]
    selectedId: string | null
    onSelect: (id: string) => void
}) {
    return (
        <div className="flex-1 overflow-auto">
            {loading && (
                <ul className="divide-y animate-pulse">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="p-4">
                            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-1/3 bg-gray-200 rounded" />
                        </li>
                    ))}
                </ul>
            )}
            {!loading && places.length === 0 && (
                <div className="p-6 text-sm text-gray-500">No results. Change the radius or the center.</div>
            )}
            {!loading && places.length > 0 && (
                <ul className="divide-y">
                    {places.map((p, idx) => (
                        <li
                            key={p.id}
                            className={`p-4 cursor-pointer ${selectedId === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            onClick={() => onSelect(p.id)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{idx + 1}. {p.name}</h3>
                                <span className="text-xs rounded-full border px-2 py-0.5">{p.category}</span>
                            </div>
                            {p.tags?.address && <p className="text-xs text-gray-600 mt-1">{p.tags.address}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
