import { handleContact, type ContactEnvironment } from '../functions/api/contact'

type AssetsBinding = { fetch(request: Request): Promise<Response> }
type Env = ContactEnvironment & { ASSETS: AssetsBinding }

const apiNotFound = () => new Response(JSON.stringify({ error: 'Not found.' }), {
  status: 404,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
})

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/contact') return handleContact({ request, env })
    if (pathname.startsWith('/api/')) return apiNotFound()
    return env.ASSETS.fetch(request)
  },
}
