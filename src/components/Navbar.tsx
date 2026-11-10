import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Brand } from './Brand'
import { navItems, scrollToId } from '../lib/site'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    handler(); window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  const go = (href: string) => { setOpen(false); scrollToId(href) }
  return <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
    <div className="nav-shell">
      <button className="brand-button" onClick={() => go('#home')} aria-label="Go to top"><Brand /></button>
      <nav className="nav-links" aria-label="Main navigation">{navItems.map(item => <button key={item.href} onClick={() => go(item.href)}>{item.label}</button>)}</nav>
      <button className="nav-cta" onClick={() => go('#contact')}>Let&apos;s Connect <span>↗</span></button>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    </div>
    <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>{navItems.map(item => <button key={item.href} onClick={() => go(item.href)}>{item.label}<span>↗</span></button>)}<button className="mobile-connect" onClick={() => go('#contact')}>Let&apos;s Connect</button></div>
  </header>
}
