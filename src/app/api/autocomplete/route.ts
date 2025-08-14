// app/api/autocomplete/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    const limit = Number(searchParams.get('limit') || 6)

    if (!q) return NextResponse.json({ features: [] })

    const url = `https://us1.locationiq.com/v1/autocomplete?key=${process.env.LOCATIONIQ_KEY}&q=${encodeURIComponent(q)}&limit=${limit}&normalizeaddress=1`

    const r = await fetch(url)
    const data = await r.json()

    const features = (data || []).map((f: any) => ({
        id: f.place_id,
        name: f.display_name,
        label: f.display_name,
        lat: parseFloat(f.lat),
        lon: parseFloat(f.lon),
        type: f.type,
    }))

    return NextResponse.json({ features })
}
