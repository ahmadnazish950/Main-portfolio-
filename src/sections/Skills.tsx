import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillsRow1 = [
  'React', 'TypeScript', 'Three.js', 'WebGL', 'GLSL', 'Node.js',
  'Next.js', 'Tailwind CSS', 'Framer Motion', 'GSAP',
]

const skillsRow2 = [
  'Figma','After Effects', 'Vite' , 
  'Docker', 'Vercel', 'Git', 'UI/UX Design', 'Creative Coding',
]

const services = [
  {
    title: 'Creative Development',
    desc: 'Interactive web experiences using WebGL, shaders, and cutting-edge frontend technologies.',
  },
  {
    title: 'Product Design',
    desc: 'End-to-end design systems, prototyping, and user experience architecture.',
  },
  {
    title: 'Technical Direction',
    desc: 'Leading engineering teams, defining architecture, and establishing workflows.',
  },
   {
  title: 'UI Development',
  desc: 'Creating responsive and modern user interfaces with attention to usability, accessibility, and smooth interactions.',
},
{
  title: 'Frontend Projects',
  desc: 'Building real-world web applications using React, Tailwind CSS, and modern development workflows.',
},
{
  title: 'Design Exploration',
  desc: 'Experimenting with layouts, animations, and visual styles to create clean and engaging digital experiences.',
},
]

function SkillPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-subtle rounded-full font-mono text-xl text-white whitespace-nowrap hover:border-lime hover:text-lime transition-all duration-300 mx-2">
      <span className="w-1.5 h-1.5 rounded-full bg-lime" />
      {name}
    </span>
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="lab"
      className="relative bg-void py-28 lg:py-36 overflow-hidden"
    >
      <div className="px-6 lg:px-12 mb-16">
        <span className="font-mono text-xs tracking-[0.15em] text-center text-text-secondary mb-4 block">
          CAPABILITIES
        </span>
        <h2 className="font-display text-center font-medium tracking-[-0.02em] text-white" style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)' }}>
          Skills & Tools
        </h2>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative mb-6 font-mono tracking-tight overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...skillsRow1, ...skillsRow1].map((skill, i) => (
            <SkillPill key={`r1-${i}`} name={skill} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Reverse */}
      <div className="relative mb-20 overflow-hidden">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...skillsRow2, ...skillsRow2].map((skill, i) => (
            <SkillPill key={`r2-${i}`} name={skill} />
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[i] = el }}
              className="group p-8 border border-border-subtle bg-surface hover:-translate-y-2 hover:border-lime/30 transition-all duration-500"
            >
              <h3 className="font-display text-xl font-medium text-white mb-4 group-hover:text-lime transition-colors duration-300">
                {service.title}
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
