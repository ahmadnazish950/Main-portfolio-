import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectDetail, { type Project } from './ProjectDetail'

gsap.registerPlugin(ScrollTrigger)

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
    liveUrl: 'https://your-deployed-roll-link.com',
  },
]

const filters = ['All', 'Web', 'AI', 'Design']

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const previewPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

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

      rowsRef.current.forEach((row, i) => {
        if (!row) return
        gsap.from(row, {
          x: -60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [filteredProjects, selectedProject])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      if (previewRef.current && hoveredProject !== null) {
        previewPos.current.x += (mousePos.current.x - previewPos.current.x) * 0.1
        previewPos.current.y += (mousePos.current.y - previewPos.current.y) * 0.1
        previewRef.current.style.transform = `translate(${previewPos.current.x + 20}px, ${previewPos.current.y - 80}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [hoveredProject])

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
        <h2 className="font-display font-medium tracking-[-0.02em] text-white" style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}>
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

      <div className="flex flex-col">
        {filteredProjects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { rowsRef.current[i] = el }}
            className="group border-t border-border-subtle py-8 lg:py-10 cursor-pointer"
            onMouseEnter={() => {
              setHoveredProject(i)
              previewPos.current = mousePos.current
            }}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 lg:gap-10">
                <span className="font-mono text-xs text-text-secondary w-8">
                  {project.id}
                </span>
                <h3
                  className="font-display font-medium text-white group-hover:translate-x-4 transition-transform duration-500 ease-out"
                  style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}
                >
                  {project.name}
                </h3>
              </div>
              <div className="hidden lg:flex items-center gap-12">
                <span className="font-mono text-xs tracking-wide text-text-secondary px-3 py-1 border border-border-subtle rounded">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-text-secondary w-12">
                  {project.year}
                </span>
                <svg
                  className="w-5 h-5 text-text-secondary group-hover:text-lime group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-border-subtle" />
      </div>

      {hoveredProject !== null && filteredProjects[hoveredProject] && (
        <div
          ref={previewRef}
          className="fixed top-0 left-0 pointer-events-none z-30 w-72 h-44 overflow-hidden rounded border border-border-subtle"
          style={{ opacity: 0.9 }}
        >
          <img
            src={filteredProjects[hoveredProject].image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </section>
  )
}
