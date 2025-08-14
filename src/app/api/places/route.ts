// app/api/places/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get('lat'))
    const lon = Number(searchParams.get('lon'))
    const radius = Number(searchParams.get('radius') || 4000) // metros

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return NextResponse.json({ error: 'lat/lon requeridos' }, { status: 400 })
    }

    // Pet care: tiendas, veterinarias, refugios
    const tags = [
        'shop=pet',
        'amenity=veterinary',
        'amenity=animal_shelter',
        'grooming=yes',
        'service:animal_grooming=*',
    ]

    // Get places
    const allResults: any[] = []
    const apiUrl = process.env.API_URL
    const url = `${apiUrl}/api/places?lat=${lat}&lon=${lon}&radius=${radius}`
    const r = await fetch(url)
    console.log(r)
    if (r.ok) {
        const data = await r.json()
        if (Array.isArray(data)) {
            allResults.push(...data)
        }
    }

    // Remove duplicates by place_id
    const unique = Object.values(
        allResults.reduce((acc, item) => {
            acc[item.place_id] = item
            return acc
        }, {} as Record<string, any>)
    )

    const places = (unique || []).map((el: any) => ({
        id: el.place_id,
        lat: parseFloat(el.lat),
        lon: parseFloat(el.lon),
        name: el.name || el.display_name || 'Sin nombre',
        category: el.type || 'other',
        tags: el.extratags || {},
    }))

    return NextResponse.json({ places })
}
