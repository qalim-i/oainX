import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brand } from './Brand'
import { Button } from './Button'
import { scrollToId } from '../lib/site'

export function Hero() {
  const { scrollY } = useScroll()
  const orbY = useTransform(scrollY, [0, 700], [0, 150])
  return <section className="hero" id="home">
    <div className="hero-grid" aria-hidden="true" />
    <motion.div className="hero-orb" style={{ y: orbY }} aria-hidden="true"><i /><i /><i /></motion.div>
    <div className="hero-trace trace-one" aria-hidden="true" /><div className="hero-trace trace-two" aria-hidden="true" />
    <div className="hero-inner">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="hero-kicker"><span className="live-dot" /> A technology company in motion</motion.div>
      <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .1, ease: [0.22, 1, 0.36, 1] }}>Building <em>Beyond</em><br />What <em>Exists.</em></motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .3 }} className="hero-bottom">
        <p>Engineering intelligent digital experiences and innovative technology that move ideas forward.</p>
        <div className="hero-actions"><Button onClick={() => scrollToId('#products')}>Explore our work <ArrowDownRight size={17} /></Button><Button variant="secondary" onClick={() => scrollToId('#contact')}>Get in touch <ArrowUpRight size={16} /></Button></div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9, delay: .55 }} className="hero-brand"><span>THE NEXT</span><Brand /><span>BEGINS HERE</span></motion.div>
    </div>
    <div className="scroll-cue"><span>SCROLL TO EXPLORE</span><i /></div>
  </section>
}
