import { motion } from 'framer-motion'
import { Reveal } from './Reveal'
export function Philosophy() { return <section className="philosophy"><div className="philosophy-line" /><div className="philosophy-wrap"><Reveal><p className="eyebrow">04 / OUR PHILOSOPHY</p><h2>Great technology<br />doesn&apos;t just <span>solve</span><br />problems. It creates<br /><em>possibilities.</em></h2></Reveal><motion.div className="philosophy-shape" animate={{ rotate: 360 }} transition={{ duration: 32, ease: 'linear', repeat: Infinity }} aria-hidden="true"><i /><i /><i /><b /></motion.div></div></section> }
