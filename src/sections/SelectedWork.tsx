import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectDetail, { type Project } from './ProjectDetail'

gsap.registerPlugin(ScrollTrigger)


const LIME_RGB = '166, 255, 61' 

const projects: Project[] = [
  {
    id: '01',
    name: 'FUEL GAZE',
    category: 'Web App',
    year: '2024',
    image: '/images/img-4.png',
    description:
      'Fuel Gaze is a real-time fuel analytics platform that helps fleet managers monitor consumption, detect anomalies, and cut operational costs through smart dashboards and predictive alerts.',
    tools: ['REACT', 'TYPESCRIPT', 'NODE.JS', 'JAVASCRIPT', 'TAILWIND CSS', 'GSAP'],
    benefits: [
      {
        title: 'Real-time monitoring',
        body: 'Live dashboards give fleet managers instant visibility into fuel consumption across every vehicle, eliminating manual reporting delays.',
      },
      {
        title: 'Cost reduction',
        body: 'Predictive anomaly detection flags wasteful patterns early, enabling teams to act before small inefficiencies become large expenses.',
      },
      {
        title: 'Scalable architecture',
        body: 'Built on a modular backend, Fuel Gaze scales from a single depot to enterprise fleets with thousands of vehicles without a rebuild.',
      },
    ],
    liveUrl: 'https://flue-gaze-smart-fuel-tracking-for-d.vercel.app/',
  },
  {
    id: '02',
    name: 'GRANGER',
    category: 'UI Design',
    year: '2023',
    image: '/images/img-2.png',
    description:
      'Granger is a design system and component library built for content-heavy editorial products. It prioritises typographic clarity and structured information hierarchy at any viewport.',
    tools: ['HTML', 'CSS', 'JAVASCRIPT', 'SCROLLTRIGGER', 'GSAP'],
    benefits: [
      {
        title: 'Design consistency',
        body: 'A single source of truth for tokens and components means product and design teams ship faster with fewer visual inconsistencies.',
      },
      {
        title: 'Accessibility-first',
        body: "Every component is built to WCAG 2.1 AA standards, reducing audit risk and broadening the product's audience.",
      },
      {
        title: 'Developer velocity',
        body: 'Pre-built, documented components cut average feature development time by reducing repetitive UI work across squads.',
      },
    ],
    liveUrl: 'https://ahmadnazish950.github.io/Web-UI-Design/',
  },
  {
    id: '03',
    name: 'ROLL',
    category: 'Full-Stack Development',
    year: '2025',
    image: '/images/img-3.png',
    description:
      'Roll is a full-stack photo-sharing app built around a single idea: you upload the photo, an AI writes the caption. A film-darkroom theme runs through the entire experience, from a "developing" upload animation to a numbered, roll-style feed.',
    tools: ['REACT', 'TAILWIND CSS', 'NODE.JS', 'EXPRESS', 'MONGODB', 'GEMINI API', 'IMAGEKIT'],
    benefits: [
      {
        title: 'AI-driven content',
        body: 'Gemini reads every uploaded photo and generates a unique caption automatically, removing the need for users to write their own copy.',
      },
      {
        title: 'Secure, persistent sessions',
        body: 'JWT-based authentication keeps users logged in reliably across refreshes, with cookies handled correctly end to end.',
      },
      {
        title: 'Fast, reliable media delivery',
        body: 'ImageKit handles image storage and delivery, keeping the feed fast to load regardless of upload size or device.',
      },
    ],
    liveUrl: 'https://get-rolled.vercel.app/',
  },
]

const filters = ['All', 'Web', 'AI', 'Design']

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) =>
          p.category.toLowerCase().includes(activeFilter.toLowerCase()),
        )

  useEffect(() => {
    if (selectedProject) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
      })

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: (i % 3) * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [filteredProjects, selectedProject])

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-void py-28 lg:py-36 px-6 lg:px-12"
    >
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-xs tracking-[0.15em] text-text-secondary mb-4 block">
          SELECTED WORK
        </span>
        <h2
          className="font-display font-medium tracking-[-0.02em] text-white"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
        >
          Projects
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-6 mb-14">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`font-mono text-xs tracking-[0.1em] transition-colors duration-300 relative ${
              activeFilter === f
                ? 'text-lime'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {f}
            {activeFilter === f && (
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-lime" />
            )}
          </button>
        ))}
      </div>

      {/* Project grid — bento pattern: every group of 3 is 1 featured + 2 half.
          Repeats automatically as more projects are added (i=3 is featured again, i=4,5 are the half pair, etc). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {filteredProjects.map((project, i) => {
          const isFeatured = i % 3 === 0

          return (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[i] = el }}
              onClick={() => setSelectedProject(project)}
              className={`project-card group relative border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-lime/40 hover:-translate-y-1.5 ${
                isFeatured ? 'sm:col-span-2' : 'sm:col-span-1'
              }`}
            >
              {/* Glassy green grid hover layer */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(rgba(${LIME_RGB}, 0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(${LIME_RGB}, 0.16) 1px, transparent 1px)`,
                  backgroundSize: '22px 22px',
                  maskImage: 'radial-gradient(circle at 50% 40%, black, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black, transparent 75%)',
                }}
              />

              {/* Ambient lime glow on hover */}
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `0 0 40px -8px rgba(${LIME_RGB}, 0.35)`,
                }}
              />

              {/* Image */}
              <div
                className={`relative overflow-hidden ${
                  isFeatured ? 'aspect-[21/9] lg:aspect-[2.6/1]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />

                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white/80 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  {project.category}
                </span>
                <span className="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-white/60 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  {project.year}
                </span>
              </div>

              {/* Content */}
              <div className={`relative p-6 flex flex-col gap-3 ${isFeatured ? 'lg:p-8' : ''}`}>
                <h3
                  className={`font-display font-medium text-white tracking-tight group-hover:text-lime transition-colors duration-300 ${
                    isFeatured ? 'text-3xl lg:text-4xl' : 'text-2xl'
                  }`}
                >
                  {project.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed text-white/55 ${isFeatured ? 'max-w-2xl' : ''}`}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: isFeatured ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description}
                </p>

                <div className="mt-2 flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-lime opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  VIEW PROJECT
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
