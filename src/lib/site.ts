export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Technology', href: '#technology' },
  { label: 'Contact', href: '#contact' },
]

export const scrollToId = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
