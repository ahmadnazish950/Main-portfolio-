import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
{
  quote: "Really liked the attention to detail in the UI. The animations felt smooth without affecting performance.",
  name: 'Jason Miller',
  role: 'Frontend Engineer',
  company: 'PixelNorth',
},
{
  quote: "Clean development workflow and easy communication throughout the project. Everything was delivered on time.",
  name: 'Emma Collins',
  role: 'Product Designer',
  company: 'Lunex Studio',
},
{
  quote: "The overall website experience felt modern and responsive across devices. Solid balance between visuals and usability.",
  name: 'Noah Bennett',
  role: 'Creative Developer',
  company: 'Frame Labs',
},
{
  quote: "What stood out most was the consistency in design and interaction quality across the entire project.",
  name: 'Sophia Turner',
  role: 'UI Consultant',
  company: 'Nova Interactive',
},
{
  quote: "Fast implementation, clean code structure, and a strong understanding of modern frontend practices.",
  name: 'Liam Carter',
  role: 'Technical Lead',
  company: 'Vertex Digital',
},
{
  quote: "The interface looked polished and professional without feeling overloaded. Great overall execution.",
  name: 'Ava Mitchell',
  role: 'Brand Strategist',
  company: 'MotionCraft',
},
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          x: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-void py-28 lg:py-36 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <span className="font-mono text-xs tracking-[0.15em] text-text-secondary mb-4 block">
          TESTIMONIALS
        </span>
        <h2 className="font-display font-medium tracking-[-0.02em] text-white mb-16" style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)' }}>
          Kind Words
        </h2>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el }}
              className="p-8 border border-border-subtle bg-surface hover:border-lime/30 transition-all duration-500"
            >
              <svg className="w-8 h-8 text-lime mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-body text-sm text-text-secondary leading-relaxed mb-8">
                {t.quote}
              </p>
              <div>
                <p className="font-mono text-sm font-medium text-white">{t.name}</p>
                <p className="font-mono text-xs text-text-secondary">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 p-6 border border-border-subtle bg-surface">
                  <svg className="w-6 h-6 text-lime mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="font-body text-sm text-text-secondary leading-relaxed mb-6">
                    {t.quote}
                  </p>
                  <div>
                    <p className="font-mono text-sm font-medium text-white">{t.name}</p>
                    <p className="font-mono text-xs text-text-secondary">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-lime w-6' : 'bg-border-subtle'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
