import { FormEvent, useState } from 'react'
import { ArrowUpRight, Check, Mail } from 'lucide-react'
import { Reveal } from './Reveal'
import { Button } from './Button'

type Fields = { name: string; email: string; subject: string; message: string; company: string }
const initial: Fields = { name: '', email: '', subject: '', message: '', company: '' }

export function Contact() {
  const [fields, setFields] = useState(initial)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const change = (key: keyof Fields, value: string) => { setFields({ ...fields, [key]: value }); setError(''); setSent(false) }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const { name, email, subject, message } = fields
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) { setError('Please complete all fields before sending.'); return }
    if (name.trim().length > 120 || email.trim().length > 254 || subject.trim().length > 160 || message.trim().length > 5000) { setError('One or more fields are too long.'); return }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address.'); return }
    setSubmitting(true); setError(''); setSent(false)
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(fields) })
      const result: unknown = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(typeof result === 'object' && result && 'error' in result && typeof result.error === 'string' ? result.error : 'Message delivery failed. Please try again later.')
      setFields(initial); setSent(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Message delivery failed. Please try again later.')
    } finally { setSubmitting(false) }
  }

  return <section className="section contact" id="contact"><div className="section-wrap contact-grid"><div><Reveal><p className="eyebrow">05 / CONTACT</p><h2>Have an Idea?<br /><span>Let&apos;s Build It.</span></h2><p className="contact-intro">Whether you have a project, collaboration opportunity, or an interesting idea, we&apos;d like to hear from you.</p><a className="contact-email" href="mailto:hello@oainx.com"><Mail size={18} /> hello@oainx.com <ArrowUpRight size={16} /></a></Reveal></div><Reveal delay={.12}><form onSubmit={submit} noValidate aria-label="Contact form"><div className="field-row"><label htmlFor="contact-name">Name<input id="contact-name" value={fields.name} onChange={e => change('name', e.target.value)} autoComplete="name" placeholder="Your name" /></label><label htmlFor="contact-email">Email<input id="contact-email" value={fields.email} onChange={e => change('email', e.target.value)} autoComplete="email" type="email" placeholder="you@example.com" /></label></div><label htmlFor="contact-subject">Subject<input id="contact-subject" value={fields.subject} onChange={e => change('subject', e.target.value)} placeholder="What’s on your mind?" /></label><label htmlFor="contact-message">Message<textarea id="contact-message" value={fields.message} onChange={e => change('message', e.target.value)} placeholder="Tell us a little about your idea..." rows={5} /></label><div className="honeypot" aria-hidden="true"><label htmlFor="contact-company">Company<input id="contact-company" value={fields.company} onChange={e => change('company', e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>{error && <p className="form-error" role="alert">{error}</p>}{sent && <p className="form-note" role="status"><Check size={16} /> Thanks — your message has been delivered. We&apos;ll be in touch soon.</p>}<Button type="submit" disabled={submitting}>{submitting ? 'Sending message…' : 'Send message'} <ArrowUpRight size={16} /></Button><p className="form-privacy">By submitting, you agree to our <a href="/privacy">Privacy Policy</a>.</p></form></Reveal></div></section>
}
