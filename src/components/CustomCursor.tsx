import { useEffect, useRef, useState } from 'react'

interface CursorState {
  x: number
  y: number
  isHovering: boolean
  hoverText: string
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const state = useRef<CursorState>({ x: -100, y: -100, isHovering: false, hoverText: '' })
  const [hoverText, setHoverText] = useState('')
  const [isHovering, setIsHovering] = useState(false)
  // Only enable on devices with a real mouse (fine pointer + hover support).
  // Touchscreens don't fire mousemove, so the dot would just sit stuck
  // off-screen (or worse, stuck on the last-tapped element) — better to
  // not render it at all there.
  const [isFinePointer, setIsFinePointer] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const trailPosRef = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFinePointer(mql.matches)
    const onChange = () => setIsFinePointer(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isFinePointer) return

    const onMouseMove = (e: MouseEvent) => {
      state.current.x = e.clientX
      state.current.y = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const clickable = target.closest('a, button, [data-cursor], [role="button"]')
      if (clickable) {
        state.current.isHovering = true
        state.current.hoverText = (clickable as HTMLElement).getAttribute('data-cursor-text') || ''
        setIsHovering(true)
        setHoverText(state.current.hoverText)
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const clickable = target.closest('a, button, [data-cursor], [role="button"]')
      if (clickable) {
        state.current.isHovering = false
        state.current.hoverText = ''
        setIsHovering(false)
        setHoverText('')
      }
    }

    const animate = () => {
      const s = state.current
      posRef.current.x += (s.x - posRef.current.x) * 0.15
      posRef.current.y += (s.y - posRef.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`
      }

      trailPosRef.current.forEach((trail, i) => {
        const prev = i === 0 ? posRef.current : trailPosRef.current[i - 1]
        trail.x += (prev.x - trail.x) * 0.2
        trail.y += (prev.y - trail.y) * 0.2
        if (trailRefs.current[i]) {
          const scale = 1 - i * 0.25
          const opacity = 0.4 - i * 0.12
          trailRefs.current[i]!.style.transform = `translate(${trail.x}px, ${trail.y}px) translate(-50%, -50%) scale(${scale})`
          trailRefs.current[i]!.style.opacity = String(opacity)
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#C8FF00',
            opacity: 0,
          }}
        />
      ))}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-[width,height] duration-300"
        style={{
          width: isHovering ? (hoverText ? 80 : 40) : 8,
          height: isHovering ? (hoverText ? 80 : 40) : 8,
          borderRadius: '50%',
          border: isHovering ? '1.5px solid #C8FF00' : 'none',
          backgroundColor: isHovering ? 'transparent' : '#C8FF00',
          mixBlendMode: isHovering ? 'difference' : 'normal',
        }}
      >
        {hoverText && (
          <span className="text-[10px] font-mono font-medium tracking-wider text-[#C8FF00]">
            {hoverText}
          </span>
        )}
      </div>
    </>
  )
}
