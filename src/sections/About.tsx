import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 3, suffix: '+', label: 'Projects' },
  { value: 2, suffix: '+', label: 'Years Learning' },
  { value: 8, suffix: '+', label: 'UI Concepts' },
]

const services = [
  'Frontend Developer',
  'Creative Development',
  'UI/UX Design',
  'Technical Direction',
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            let start = 0
            const duration = 2000
            const startTime = performance.now()

            const animate = (now: number) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              start = Math.round(eased * target)
              setCount(start)
              if (progress < 1) requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
      gsap.from(rightRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-void py-28 lg:py-36 px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <span className="font-mono text-xs tracking-[0.15em] text-text-secondary mb-4 block">
          ABOUT
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div ref={leftRef} className="relative">
            <div className="relative overflow-hidden">
              <div className="absolute -top-3 -left-3 w-full h-full border-2 border-lime z-0" />
              <img
                src="/images/IMG_1.jpeg"
                alt="About"
                className="relative z-10 w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div ref={rightRef} className="flex flex-col justify-center">
            <h2 className="font-display font-medium tracking-[-0.02em] text-white mb-8" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              Designing Modern <br />Web Experiences
            </h2>

            <p className="font-body text-base lg:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
               I'm Nazish , a frontend developer focused on building clean, responsive, and visually engaging web experiences.
  I enjoy combining modern design with interactive development using React, Tailwind CSS, GSAP, and creative UI concepts.
  My goal is to create websites that feel smooth, practical, and memorable across every device.
            </p>

            {/* Stats */}
            <div className="flex gap-10 lg:gap-16 mb-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-4xl lg:text-5xl font-medium text-lime mb-1">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <span className="font-mono text-xs tracking-wide text-text-secondary">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Services */}
            <div>
              <span className="font-mono text-xs tracking-[0.1em] text-text-secondary mb-4 block">
                WHAT I DO
              </span>
              <div className="flex flex-wrap gap-3">
                {services.map((service) => (
                  <span
                    key={service}
                    className="px-4 py-2 border border-border-subtle rounded font-mono text-xs tracking-wide text-white hover:border-lime hover:text-lime transition-colors duration-300"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
