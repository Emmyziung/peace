import { NextRequest } from "next/server"

type TrackMetadata = {
  id: string
  title: string
  artist: string
  duration?: number
}

type YouTubeVideo = {
  id: string
  snippet?: { title?: string; channelTitle?: string }
  contentDetails?: { duration?: string }
}

function parseDuration(duration?: string) {
  const parts = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!parts) return undefined
  return Number(parts[1] || 0) * 3600 + Number(parts[2] || 0) * 60 + Number(parts[3] || 0)
}

async function fetchWithLimit<T>(values: string[], work: (value: string) => Promise<T>, limit = 8) {
  const results: T[] = []
  let index = 0
  async function worker() {
    while (index < values.length) {
      const value = values[index++]
      results.push(await work(value))
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker))
  return results
}

export async function GET(request: NextRequest) {
  const ids = [...new Set((request.nextUrl.searchParams.get("ids") || "").split(",").filter((id) => /^[\w-]{6,}$/.test(id)))].slice(0, 50)
  if (!ids.length) return Response.json({ tracks: [] }, { status: 400 })

  const apiKey = process.env.YOUTUBE_DATA_API_KEY
  if (apiKey) {
    const params = new URLSearchParams({ part: "snippet,contentDetails", id: ids.join(","), key: apiKey })
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`, {
      next: { revalidate: 60 * 60 * 24 },
    })
    if (response.ok) {
      const data = (await response.json()) as { items?: YouTubeVideo[] }
      const tracks = (data.items || []).map((video) => ({
        id: video.id,
        title: video.snippet?.title || "Untitled track",
        artist: video.snippet?.channelTitle || "YouTube Music",
        duration: parseDuration(video.contentDetails?.duration),
      }))
      return Response.json({ tracks }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } })
    }
  }

  const tracks = await fetchWithLimit(ids, async (id): Promise<TrackMetadata> => {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${id}`
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`, {
        next: { revalidate: 60 * 60 * 24 },
      })
      if (!response.ok) throw new Error("oEmbed request failed")
      const data = (await response.json()) as { title?: string; author_name?: string }
      return { id, title: data.title || "Untitled track", artist: data.author_name || "YouTube Music" }
    } catch {
      return { id, title: "Track unavailable", artist: "YouTube Music" }
    }
  })

  return Response.json({ tracks }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } })
}
