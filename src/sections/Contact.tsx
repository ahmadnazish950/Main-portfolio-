import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const socials = [
  { name: 'GitHub', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Twitter', href: '#' },
  { name: 'Dribbble', href: '#' },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-content', {
        y: 60,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-void py-28 lg:py-36 px-6 lg:px-12"
    >
      <div className="contact-content max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: CTA */}
          <div>
            <span className="font-mono text-xs tracking-[0.15em] text-text-secondary mb-4 block">
              CONTACT
            </span>
            <h2 className="font-display font-medium tracking-[-0.02em] text-white mb-8 leading-[1.05]" style={{ fontSize: 'clamp(2.25rem, 7vw, 4.5rem)' }}>
              Let's Work<br />Together
            </h2>
            <a
            href="https://mail.google.com/mail/?view=cm&to=ahmadnazish950@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-block font-mono text-lg lg:text-xl text-lime hover:text-white transition-colors duration-300 mb-12 relative"
>
  ahmadnazish950@gmail.com
  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-lime group-hover:bg-white transition-colors duration-300" />
</a>

            {/* Socials */}
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-11 h-11 flex items-center justify-center border border-border-subtle rounded hover:border-lime hover:-translate-y-1 transition-all duration-300"
                  aria-label={social.name}
                >
                  <span className="font-mono text-[10px] tracking-wide text-text-secondary hover:text-lime transition-colors">
                    {social.name.slice(0, 2).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="font-mono text-xs tracking-wide text-text-secondary mb-2 block">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border-subtle py-3 font-body text-white placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors duration-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="font-mono text-xs tracking-wide text-text-secondary mb-2 block">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border-subtle py-3 font-body text-white placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="font-mono text-xs tracking-wide text-text-secondary mb-2 block">
                  MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-border-subtle py-3 font-body text-white placeholder:text-text-secondary/50 focus:border-lime focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project"
                />
              </div>
              <button
                type="submit"
                className="group self-start mt-4 inline-flex items-center gap-3 px-8 py-4 bg-lime text-void font-mono text-sm font-medium tracking-wide rounded overflow-hidden relative"
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">
                  {submitted ? 'Message Sent!' : 'Send Message'}
                </span>
                <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
