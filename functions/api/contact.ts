export interface ContactEnvironment {
  RESEND_API_KEY?: string
  CONTACT_FROM_EMAIL?: string
  CONTACT_TO_EMAIL?: string
}

export type ContactContext = { request: Request; env: ContactEnvironment }

type ContactPayload = { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; company?: unknown }
type ContactData = { name: string; email: string; subject: string; message: string }

const MAX_BODY_BYTES = 16_384
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_SUBJECT_LENGTH = 160
const MAX_MESSAGE_LENGTH = 5_000
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map<string, number[]>()

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } })
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ')
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char))

const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return true
  try {
    const url = new URL(origin)
    return (url.protocol === 'https:' && (url.hostname === 'oainx.com' || url.hostname === 'www.oainx.com' || url.hostname.endsWith('.pages.dev'))) || (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1'))
  } catch { return false }
}

const checkRateLimit = (request: Request) => {
  const key = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const prior = (requestLog.get(key) ?? []).filter(time => now - time < RATE_LIMIT_WINDOW_MS)
  if (prior.length >= RATE_LIMIT_MAX_REQUESTS) return false
  prior.push(now); requestLog.set(key, prior)
  if (requestLog.size > 1_000) for (const [ip, times] of requestLog) if (times.every(time => now - time >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(ip)
  return true
}

const validatePayload = (payload: ContactPayload): { data?: ContactData; error?: string; status?: number } => {
  if (typeof payload.company !== 'undefined' && (typeof payload.company !== 'string' || payload.company.trim() !== '')) return { error: 'Unable to send this message.', status: 403 }
  if (![payload.name, payload.email, payload.subject, payload.message].every(value => typeof value === 'string')) return { error: 'Please complete all required fields.', status: 400 }
  const name = normalize(payload.name as string), email = normalize(payload.email as string).toLowerCase(), subject = normalize(payload.subject as string), message = (payload.message as string).trim()
  if (!name || !email || !subject || !message) return { error: 'Please complete all required fields.', status: 400 }
  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || subject.length > MAX_SUBJECT_LENGTH || message.length > MAX_MESSAGE_LENGTH) return { error: 'One or more fields are too long.', status: 413 }
  if (/[\u0000-\u001F\u007F]/.test(name) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(subject) || /[\u0000\u007F]/.test(message)) return { error: 'Please remove unsupported characters and try again.', status: 400 }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Enter a valid email address.', status: 400 }
  if ((message.match(/https?:\/\//gi) ?? []).length > 3) return { error: 'Unable to send this message.', status: 403 }
  return { data: { name, email, subject, message } }
}

const emailHtml = (data: ContactData, submittedAt: string) => {
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br>'), replyTo = encodeURIComponent(data.email), replySubject = encodeURIComponent(`Re: ${data.subject}`)
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f4f4f5"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff"><tr><td style="padding:28px 32px;background:#050505"><span style="font-size:24px;font-weight:700;letter-spacing:-1px;color:#ffffff">oain<span style="color:#ff6500;font-size:29px">X</span></span><span style="float:right;padding-top:8px;color:#a1a1aa;font-size:11px;letter-spacing:1px">WEBSITE ENQUIRY</span></td></tr><tr><td style="padding:36px 32px"><h1 style="margin:0 0 24px;font-size:25px;line-height:1.2">New website enquiry</h1><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tr><td style="padding:11px 0;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px;width:110px">FROM</td><td style="padding:11px 0;border-top:1px solid #e4e4e7;font-size:14px">${escapeHtml(data.name)}</td></tr><tr><td style="padding:11px 0;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px">EMAIL</td><td style="padding:11px 0;border-top:1px solid #e4e4e7;font-size:14px"><a href="mailto:${replyTo}" style="color:#064e3b">${escapeHtml(data.email)}</a></td></tr><tr><td style="padding:11px 0;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px">SUBJECT</td><td style="padding:11px 0;border-top:1px solid #e4e4e7;font-size:14px">${escapeHtml(data.subject)}</td></tr><tr><td style="padding:11px 0;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px;vertical-align:top">MESSAGE</td><td style="padding:11px 0;border-top:1px solid #e4e4e7;font-size:14px;line-height:1.6">${message}</td></tr></table><a href="mailto:${replyTo}?subject=${replySubject}" style="display:inline-block;margin-top:28px;padding:13px 18px;background:#ff6500;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold">Reply to ${escapeHtml(data.name)}</a><p style="margin:30px 0 0;color:#71717a;font-size:12px">Submitted ${escapeHtml(submittedAt)} via oainx.com</p></td></tr></table></td></tr></table></body></html>`
}

export const handleContact = async ({ request, env }: ContactContext) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  if (!isAllowedOrigin(request.headers.get('Origin'))) return json({ error: 'Unable to send this message.' }, 403)
  if (!checkRateLimit(request)) return json({ error: 'Please wait a few minutes before trying again.' }, 429)
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Your message is too large.' }, 413)
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return json({ error: 'Request must be JSON.' }, 415)
  let rawBody: string
  try { rawBody = await request.text() } catch { return json({ error: 'Unable to read this message.' }, 400) }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return json({ error: 'Your message is too large.' }, 413)
  let payload: ContactPayload
  try { const parsed: unknown = JSON.parse(rawBody); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ error: 'Invalid request.' }, 400); payload = parsed as ContactPayload } catch { return json({ error: 'Invalid request.' }, 400) }
  const validation = validatePayload(payload)
  if (!validation.data) return json({ error: validation.error }, validation.status ?? 400)
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) return json({ error: 'Message delivery is temporarily unavailable. Please use the email address shown on this page.' }, 503)
  const submittedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC'
  const resendResponse = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: `oainX Website <${env.CONTACT_FROM_EMAIL}>`, to: [env.CONTACT_TO_EMAIL], reply_to: validation.data.email, subject: `New Website Enquiry — ${validation.data.subject}`, html: emailHtml(validation.data, submittedAt), text: `New website enquiry\n\nFrom: ${validation.data.name}\nEmail: ${validation.data.email}\nSubject: ${validation.data.subject}\n\nMessage:\n${validation.data.message}\n\nSubmitted: ${submittedAt}` }) }).catch(() => null)
  if (!resendResponse?.ok) return json({ error: 'Message delivery failed. Please try again later or use the email address shown on this page.' }, 502)
  return json({ success: true })
}
