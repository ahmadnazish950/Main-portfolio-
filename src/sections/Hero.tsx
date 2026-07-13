import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '@/hooks/useLenis'
import ParticleField from '@/components/ParticleField'

gsap.registerPlugin(ScrollTrigger)

const rotatingWords = [
  'Modern Websites',
  'Creative Interfaces',
  'Frontend Experiences',
]

interface HeroProps {
  startAnimation?: boolean
}

export default function Hero({ startAnimation = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fire animation only when preloader is done
  useEffect(() => {
    if (!startAnimation) return

    tlRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        once: true,
      },
    })

    tlRef.current
      .to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(
        h1Ref.current,
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      )
      .to(
        subRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .to(
        badgeRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .to(
        scrollRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )

    return () => {
      tlRef.current?.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [startAnimation])

  /* typewriter */
  useEffect(() => {
    const word = rotatingWords[wordIndex]
    let charIndex = isTyping ? 0 : word.length

    intervalRef.current = setInterval(() => {
      if (isTyping) {
        if (charIndex <= word.length) {
          setDisplayText(word.slice(0, charIndex))
          charIndex++
        } else {
          setTimeout(() => setIsTyping(false), 1800)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } else {
        if (charIndex >= 0) {
          setDisplayText(word.slice(0, charIndex))
          charIndex--
        } else {
          setWordIndex((prev) => (prev + 1) % rotatingWords.length)
          setIsTyping(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      }
    }, isTyping ? 80 : 40)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [wordIndex, isTyping])

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const lenis = getLenis()
    const el = document.querySelector('#work')
    if (el && lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -80 })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center bg-[#080808]"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#080808]" />
        <div
          className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] rounded-full opacity-30 animate-float-slow will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(163,230,53,0.22) 0%, rgba(163,230,53,0.08) 35%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] rounded-full opacity-20 animate-float-reverse will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 75%)',
            filter: 'blur(140px)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(163,230,53,0.25) 0%, transparent 75%)',
          }}
        />
        <ParticleField />
        <div className="absolute inset-0 noise opacity-[0.035]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.88) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-5xl mx-auto">
        <div
          ref={labelRef}
          className="opacity-0 translate-y-6 font-mono text-[10px] font-medium tracking-[0.25em] text-lime mb-8 uppercase"
        >
          Creative Frontend Developer
        </div>

        <h1
          ref={h1Ref}
          className="opacity-0 translate-y-6 font-display leading-[1.04] tracking-[-0.03em] text-white mb-6"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
        >
          <span className="block tracking-wider font-mono text-4xl text-white/50 mb-1">
            I build
          </span>
          <span className="block text-lime" style={{ fontSize: '0.85em' }}>
            {displayText}
            <span className="inline-block w-[3px] h-[0.75em] bg-lime ml-1 animate-blink align-middle" />
          </span>
          <span
            className="block text-white/50 text-right"
            style={{ fontSize: '0.18em', letterSpacing: '0.02em', paddingRight: '0.2em' }}
          >
            — for the web
          </span>
        </h1>

        <p
          ref={subRef}
          className="opacity-0 translate-y-6 text-base lg:text-lg font-mono font-extralight text-text-secondary leading-relaxed max-w-2xl mb-10"
        >
          Building clean, interactive, and modern web experiences focused on
          smooth design, performance, and usability.
        </p>

        <div
          ref={ctaRef}
          className="opacity-0 translate-y-6 flex flex-wrap justify-center gap-4 mb-10"
        >
          <a
            href="#work"
            onClick={handleExploreClick}
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-lime text-black font-mono text-sm font-medium tracking-wide rounded transition-all duration-300 hover:bg-white"
          >
            View My Work
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/images/CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-border-subtle text-white font-mono text-sm font-medium tracking-wide rounded transition-all duration-300 hover:border-lime hover:text-lime"
          >
            Download CV
          </a>
        </div>

        <div
          ref={badgeRef}
          className="opacity-0 translate-y-6 inline-flex items-center gap-2.5 px-4 py-2 bg-surface/80 border border-border-subtle rounded"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
          </span>
          <span className="font-mono text-xs tracking-wide text-text-secondary">
            Available for work
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="opacity-0 translate-y-4 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-secondary">SCROLL</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-lime to-transparent animate-bounce-arrow" />
      </div>
    </section>
  )
}
