type BrandProps = { className?: string }

export function Brand({ className = '' }: BrandProps) {
  return <span className={`brand ${className}`} aria-label="oainX"><span>oain</span><b>X</b></span>
}
