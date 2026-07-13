import { useEffect, useState, useRef } from 'react'
import { getLenis } from '@/hooks/useLenis'

const navLinks = [
  { label: 'WORK',    href: '#work'    },
  { label: 'LAB',     href: '#lab'     },
  { label: 'ARCHIVE', href: '#archive' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [activeSection, setActiveSection] = useState('')
  /* how many px the pill has moved up (0 → fully visible, -96 → hidden) */
  const [pillY, setPillY]               = useState(0)
  const lastScrollY                     = useRef(0)
  const navRef                          = useRef<HTMLElement>(null)

  /* ── scroll direction → auto-hide pill ── */
  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY
      setScrolled(cur > 50)

      if (cur > 80) {
        const delta = cur - lastScrollY.current
        /* scrolling down → slide up, scrolling up → reveal */
        setPillY((prev) => Math.min(0, Math.max(-96, prev - delta * 0.6)))
      } else {
        setPillY(0)
      }
      lastScrollY.current = cur
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── active section ── */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection('#' + e.target.id) }),
      { threshold: 0.3 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const lenis = getLenis()
    const el = document.querySelector(href)
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Floating pill nav ── */}
      <div
        className="fixed top-5 left-1/2 z-50 -translate-x-1/2"
        style={{
          transform: `translateX(-50%) translateY(${pillY}px)`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <nav
          ref={navRef}
          className={`
            flex items-center gap-1 px-3 py-2 border border-white/[0.10]
            transition-all duration-500
            ${scrolled
              ? 'bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-white/[0.08]'
              : 'bg-void/60 backdrop-blur-md'}
          `}
          style={{ minHeight: 52 }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              const lenis = getLenis()
              if (lenis) lenis.scrollTo(0)
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="font-mono text-sm font-medium tracking-widest text-lime mr-4 pl-2 hover:text-white transition-colors duration-300"
          >
            NAZISH
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`
                  relative px-4 py-1.5 rounded-full
                  font-mono text-[11px] font-medium tracking-[0.08em]
                  transition-all duration-300 hover:tracking-[0.12em]
                  ${activeSection === link.href
                    ? 'bg-lime text-void'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'}
                `}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger inside pill */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-[1.5px] bg-white transition-transform duration-300"
              style={{ transform: menuOpen ? 'translateY(3.75px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-[1.5px] bg-white transition-transform duration-300"
              style={{ transform: menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </nav>
      </div>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className={`fixed inset-0 z-40 bg-void transition-opacity duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* ambient background glow, consistent with the rest of the site */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/3 -right-1/4 w-[36rem] h-[36rem] rounded-full opacity-[0.12]"
            style={{
              background: 'radial-gradient(circle, rgba(200,255,0,0.6) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative h-full w-full flex flex-col px-6 sm:px-10 py-8">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.3em] text-text-secondary uppercase">
              Menu
            </span>
          </div>

          {/* Nav list */}
          <nav className="flex-1 flex flex-col justify-center -mt-8">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group flex items-center gap-5 sm:gap-8 border-t border-border-subtle py-5 sm:py-6 first:border-t-0"
                style={{
                  transitionDelay: menuOpen ? `${i * 70 + 100}ms` : '0ms',
                  transform: menuOpen ? 'translateY(0)' : 'translateY(24px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease',
                }}
              >
                <span className="font-mono text-xs text-lime/60 group-hover:text-lime transition-colors duration-300 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-4xl sm:text-5xl font-medium text-white/90 group-hover:text-lime group-hover:translate-x-3 transition-all duration-400 ease-out">
                  {link.label}
                </span>
                <svg
                  className="ml-auto w-5 h-5 text-lime opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ))}
          </nav>

          {/* Bottom strip: contact + socials + status */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-border-subtle"
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 70 + 150}ms` : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease',
            }}
          >
            <a
              href="https://mail.google.com/mail/?view=cm&to=ahmadnazish950@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-text-secondary hover:text-lime transition-colors duration-300"
            >
              ahmadnazish950@gmail.com
            </a>

            <div className="flex items-center gap-6">
              {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-mono text-[11px] tracking-[0.1em] text-text-secondary hover:text-lime transition-colors duration-300"
                >
                  {social.toUpperCase()}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
              </span>
              <span className="font-mono text-[10px] tracking-wide text-text-secondary uppercase">
                Available for work
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
