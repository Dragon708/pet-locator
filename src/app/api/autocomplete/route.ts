// app/api/autocomplete/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    const limit = Number(searchParams.get('limit') || 6)

    if (!q) return NextResponse.json({ features: [] })
    const apiUrl = process.env.API_URL
    const url = `${apiUrl}/api/autocomplete?query=${encodeURIComponent(q)}`
    console.log(url)

    let data: any[] = []
    try {
        const r = await fetch(url)
        data = await r.json()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ features: [] })
    }

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
