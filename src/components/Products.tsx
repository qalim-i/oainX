import { ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'
import { Button } from './Button'

export function Products() { return <section className="section products" id="products"><div className="section-wrap">
  <Reveal><div className="section-heading"><div><p className="eyebrow">02 / OUR PRODUCTS</p><h2>Products We&apos;re<br /><span>Building.</span></h2></div><p>Ideas become meaningful when they are made useful. This is where we put our thinking into motion.</p></div></Reveal>
  <Reveal delay={.12}><article className="product-card"><div className="product-visual"><div className="life-mark"><span>o</span><i>✦</i></div><div className="visual-schedule"><span>THU · 09</span><b>Focus<br />forward.</b><i /></div><div className="orbit orbit-a" /><div className="orbit orbit-b" /></div><div className="product-content"><div className="product-meta"><span>PERSONAL OPERATING SYSTEM</span><span className="status"><i /> IN DEVELOPMENT</span></div><h3>oainX <em>Life</em></h3><p>A personal productivity and life-management experience combining habits, schedules, tasks, journaling, and AI-powered interactions.</p><Button variant="secondary" disabled title="Product details are not published yet">Explore product <ArrowUpRight size={16} /></Button></div></article></Reveal>
  <div className="product-note"><Sparkles size={17} /><span>More thoughtful products are in the works.</span></div>
</div></section> }
