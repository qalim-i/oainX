import { ArrowUpRight, Compass, Layers3, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'

const principles = [
  { icon: Sparkles, no: '01', title: 'Innovation', body: 'Exploring better ways to solve complex problems.' },
  { icon: Layers3, no: '02', title: 'Engineering', body: 'Building reliable, scalable, and thoughtful technology.' },
  { icon: Compass, no: '03', title: 'Impact', body: 'Turning ideas into useful digital experiences.' },
]
export function About() { return <section className="section about" id="about"><div className="section-wrap">
  <Reveal><p className="eyebrow">01 / ABOUT OAINX</p></Reveal>
  <div className="about-intro"><Reveal><h2>Technology<br />With <span>Purpose.</span></h2></Reveal><Reveal delay={.12}><p>oainX is a technology-driven brand focused on building digital products, intelligent systems, and software experiences that solve meaningful problems.</p></Reveal></div>
  <div className="principles">{principles.map((item, i) => { const Icon = item.icon; return <Reveal key={item.no} delay={i * .1}><article className="principle"><div className="principle-top"><span>{item.no}</span><Icon size={20} /><ArrowUpRight size={17} /></div><h3>{item.title}</h3><p>{item.body}</p></article></Reveal>})}</div>
</div></section> }
