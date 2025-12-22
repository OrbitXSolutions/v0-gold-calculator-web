// HTTPS same-origin proxy for blog list
// Requires BACKEND_URL (Vercel: Project Settings → Environment Variables)
export const dynamic = "force-dynamic"

function getBackendBase(): string | null {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ""
  if (!raw) return null
  try {
    const u = new URL(raw)
    u.protocol = "http:"
    const s = u.toString()
    return s.endsWith("/") ? s : s + "/"
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const base = getBackendBase()
    if (!base) {
      return new Response(JSON.stringify({ error: "Missing BACKEND_URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      })
    }

    const incomingUrl = new URL(req.url)
    const candidates = ["Blogs", "blogs", "blog", "Blog"]
    let lastRes: Response | null = null
    for (const path of candidates) {
      const target = new URL(path, base)
      incomingUrl.searchParams.forEach((v, k) => target.searchParams.append(k, v))
      try {
        const res = await fetch(target.toString(), {
          cache: "no-store",
          headers: { Accept: req.headers.get("accept") || "application/json" },
        })
        lastRes = res
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "application/json"
          const body = await res.arrayBuffer()
          return new Response(body, {
            status: res.status,
            headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
          })
        }
        if (res.status === 404) {
          continue
        }
      } catch {
        // try next candidate
      }
    }
    if (lastRes) {
      const contentType = lastRes.headers.get("content-type") || "application/json"
      const body = await lastRes.arrayBuffer()
      return new Response(body, {
        status: lastRes.status,
        headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
      })
    }
    return new Response(JSON.stringify({ error: "Upstream fetch failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upstream fetch failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    })
  }
}
