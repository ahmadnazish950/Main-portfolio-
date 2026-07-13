import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  category: string
  year: string
  image: string
  description: string
  tools: string[]
  benefits: { title: string; body: string }[]
  liveUrl?: string
}

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(heroRef.current, { y: 40, opacity: 0, duration: 0.9 })
        .from(metaRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
        .from(bodyRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
    }, wrapRef)

    return () => ctx.revert()
  }, [project.id])

  return (
    <div
      ref={wrapRef}
      className="min-h-screen bg-void text-white px-6 lg:px-12 py-10 lg:py-16"
    >
      <button
        onClick={onBack}
        className="group flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-text-secondary hover:text-white transition-colors duration-300 mb-14"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        BACK TO WORK
      </button>

      {/* ── Hero image ── */}
      <div
        ref={heroRef}
        className="w-full aspect-[16/7] overflow-hidden rounded border border-border-subtle mb-12"
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Project meta ── */}
      <div ref={metaRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 border-b border-border-subtle pb-10">
        <div>
          <span className="font-mono text-xs tracking-[0.15em] text-text-secondary block mb-3">
            {project.id} — {project.year}
          </span>
          <h1 className="font-display font-medium tracking-[-0.02em]" style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)' }}>
            {project.name}
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-xs tracking-wide text-text-secondary px-3 py-1 border border-border-subtle rounded">
            {project.category}
          </span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-lime border border-lime px-4 py-2 rounded hover:bg-lime hover:text-void transition-all duration-300"
            >
              VIEW LIVE
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div ref={bodyRef} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">

        {/* Left column */}
        <div className="flex flex-col gap-14">

          {/* Description */}
          <div>
            <span className="font-mono text-xs tracking-[0.15em] text-text-secondary block mb-5">
              OVERVIEW
            </span>
            <p className=" font-bold text-xl leading-relaxed tracking-tight text-white/80 max-w-2xl">
              {project.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <span className="font-mono text-xs tracking-[0.15em] text-text-secondary block mb-8">
              KEY BENEFITS
            </span>
            <div className="flex flex-col">
              {project.benefits.map((b, i) => (
                <div
                  key={i}
                  className="border-t border-border-subtle py-7 grid grid-cols-[28px_1fr] gap-6 lg:gap-10"
                >
                  <span className="font-mono text-xs text-text-secondary pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-2">
                      {b.title}
                    </h4>
                    <p className="text-sm tracking-tight leading-relaxed text-white/60">{b.body}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-border-subtle" />
            </div>
          </div>
        </div>

        {/* Right sidebar — tools */}
        <div className="lg:pt-0">
          <span className="font-mono text-xs tracking-[0.15em] text-text-secondary block mb-8">
            TOOLS & TECH
          </span>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="font-mono text-xs tracking-wide text-white/70 px-3 py-2 border border-border-subtle rounded hover:border-lime hover:text-lime transition-colors duration-300 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
