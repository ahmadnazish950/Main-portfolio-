import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const IMAGE_COUNT  = 18
const SCROLL_SPEED = 0.003
const SPIRAL_R     = 1.0
const SPIRAL_TURNS = 2
const CARD_W       = 1.4
const CARD_H       = 0.93
const SPACING      = 0.65
const TOTAL_H      = IMAGE_COUNT * SPACING

const ACCENT    = '#C8FF00'
const VOID_BG   = '#080808'


const ROTATION_FACTOR = 0.12

const ORBIT_PAD_X     = 0.12  
const ORBIT_PAD_Y     = 0.08   
const ORBIT_RADIUS_X  = CARD_W / 2 + ORBIT_PAD_X
const ORBIT_RADIUS_Y  = CARD_H / 2 + ORBIT_PAD_Y
const ORBIT_SPEED     = 0.5    
const ORBIT_SEGMENTS  = 64

const DOT_BASE_RADIUS = 0.05
const DOT_SIZE_JITTER = 0.006  
const DOT_HOVER_SCALE = 2.4   
const DOT_LERP        = 0.18   

function mod(n: number, m: number) { return ((n % m) + m) % m }

function pseudoRandom(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const DESCRIPTIONS: string[] = [
  'Where it started curious, and a little lost',
  'First lines of code that actually did something',
  'Built something small and broke it a hundred times',
  'Learned that design is a language too',
  'First real project, first real deadline',
  'Discovered the tools that stuck with me',
  'Started thinking in systems, not just screens',
  'Shipped something people actually used',
  'Learned to say no to bad ideas including my own',
  'Went deeper into motion and interaction',
  'Started mentoring, realized I understood more than I thought',
  'Took on something bigger than I felt ready for',
  'Found a style that finally felt like mine',
  'Learned performance matters as much as polish',
  'Started building for scale, not just for demos',
  'Began thinking about craft as a long game',
  'Where curiosity turned into a career',
  'Still building this archive is proof',
]


function makeTextures(): THREE.CanvasTexture[] {
  return Array.from({ length: 6 }, (_, i) => {
    const cv  = document.createElement('canvas')
    cv.width  = 512
    cv.height = 340
    const ctx = cv.getContext('2d')!

    const g = ctx.createLinearGradient(0, 0, 512, 340)
    g.addColorStop(0, '#0a0a0a')
    g.addColorStop(1, ACCENT + '1a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 340)

    ctx.strokeStyle = ACCENT + '22'
    ctx.lineWidth   = 1
    for (let x = 0; x < 512; x += 64) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,340); ctx.stroke() }
    for (let y = 0; y < 340; y += 64) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(512,y); ctx.stroke() }

    ctx.strokeStyle = ACCENT + 'aa'
    ctx.lineWidth   = 2
    ctx.strokeRect(3, 3, 506, 334)

    ctx.fillStyle    = ACCENT
    ctx.font         = 'bold 96px monospace'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha  = 0.9
    ctx.fillText(String(i + 1).padStart(2, '0'), 256, 155)
    ctx.globalAlpha  = 1

    ctx.fillStyle    = '#ffffff55'
    ctx.font         = '16px monospace'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('SPATIAL / ARCHIVE', 256, 318)

    return new THREE.CanvasTexture(cv)
  })
}

function makeOrbitRing(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const a = (i / ORBIT_SEGMENTS) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(a) * ORBIT_RADIUS_X, Math.sin(a) * ORBIT_RADIUS_Y, 0.015))
  }
  return new THREE.BufferGeometry().setFromPoints(points)
}

function Scene({
  scrollRef,
  isMobile,
  overlayRef,
  overlayTextRef,
}: {
  scrollRef: React.MutableRefObject<number>
  isMobile: boolean
  overlayRef: React.MutableRefObject<HTMLDivElement | null>
  overlayTextRef: React.MutableRefObject<HTMLSpanElement | null>
}) {
  const { camera, size, gl } = useThree()

  const textures = useMemo(() => makeTextures(), [])

  const { meshes, dots } = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    const dots: THREE.Mesh[] = []
    const ringGeo = makeOrbitRing()

    for (let i = 0; i < IMAGE_COUNT; i++) {
      const texture = textures[i % textures.length]

      const geo = new THREE.PlaneGeometry(CARD_W, CARD_H)
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        toneMapped: false,
        side: THREE.FrontSide, 
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData.index = i

      // the orbit ring — a thin line that goes around all four sides of the card
      const ringMat = new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.35,
        toneMapped: false,
      })
      const ring = new THREE.LineLoop(ringGeo, ringMat)
      ring.renderOrder = 1

      // the dot that revolves around the ring, like a planet
      const radius = DOT_BASE_RADIUS + pseudoRandom(i) * DOT_SIZE_JITTER
      const dotGeo = new THREE.CircleGeometry(radius, 20)
      const dotMat = new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        toneMapped: false,
        depthTest: false,
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.z = 0.02
      dot.userData.index = i
      dot.renderOrder = 2

      mesh.add(ring)
      mesh.add(dot)
      meshes.push(mesh)
      dots.push(dot)
    }

    return { meshes, dots }
  }, [textures])

  const groupRef   = useRef<THREE.Group>(null)
  const prevScroll = useRef(0)
  const offset     = useRef(0)

  // each card's dot keeps its own orbit angle so it can pause on hover and
  // resume from the exact same spot, rather than resetting
  const orbitAngles = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(IMAGE_COUNT)
      for (let i = 0; i < IMAGE_COUNT; i++) arr[i] = pseudoRandom(i + 100) * Math.PI * 2
      return arr
    })()
  )

  // hover (desktop) / tap-to-pin (mobile) state — kept in refs, not React state,
  // so this never triggers a re-render at 60fps
  const hoverIndexRef  = useRef<number | null>(null)
  const pinnedIndexRef = useRef<number | null>(null)
  const worldPos       = useRef(new THREE.Vector3())

  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    meshes.forEach(m => g.add(m))
    return () => { meshes.forEach(m => g.remove(m)) }
  }, [meshes])

  // mobile: tap a card to pin its description open (toggle off on second tap).
  // We distinguish a real tap from the start of a scroll swipe by checking
  // movement duration on release otherwise every swipe that starts on a
  // card would accidentally toggle its pin.
  useEffect(() => {
    if (!isMobile) return
    const dom = gl.domElement
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

    const TAP_MAX_MOVE_PX = 10
    const TAP_MAX_MS       = 350
    let downX = 0, downY = 0, downT = 0

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX
      downY = e.clientY
      downT = performance.now()
    }

    const onPointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY)
      const elapsed = performance.now() - downT
      if (moved > TAP_MAX_MOVE_PX || elapsed > TAP_MAX_MS) return // was a scroll/drag, not a tap

      const rect = dom.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObjects(meshes, false)[0]
      const idx = hit ? (hit.object as THREE.Mesh).userData.index : null
      pinnedIndexRef.current = pinnedIndexRef.current === idx ? null : idx
    }

    dom.addEventListener('pointerdown', onPointerDown)
    dom.addEventListener('pointerup', onPointerUp)
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointerup', onPointerUp)
    }
  }, [isMobile, meshes, camera, gl])

  useFrame((state, delta) => {
    const cur   = scrollRef.current
    const sdelta = cur - prevScroll.current
    prevScroll.current = cur
    offset.current    += sdelta * SCROLL_SPEED

    meshes.forEach((mesh, i) => {
      const t     = mod((i / IMAGE_COUNT) + offset.current / TOTAL_H, 1)
      const y     = t * TOTAL_H - TOTAL_H / 2
      const angle = t * Math.PI * 2 * SPIRAL_TURNS

      mesh.position.x = Math.sin(angle) * SPIRAL_R
      mesh.position.y = y
      mesh.position.z = Math.cos(angle) * SPIRAL_R * 0.3

      mesh.rotation.y = -angle * ROTATION_FACTOR

      const dist  = Math.abs(y) / (TOTAL_H / 2)
      const alpha = 1 - dist * 0.55
      const opac  = Math.max(alpha, 0.18)
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = opac
    })

   
    if (!isMobile) {
      state.raycaster.setFromCamera(state.pointer, camera)
      const hit = state.raycaster.intersectObjects(meshes, false)[0]
      hoverIndexRef.current = hit ? (hit.object as THREE.Mesh).userData.index : null
    }

    const activeIndex = isMobile ? pinnedIndexRef.current : hoverIndexRef.current

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex
      const cardOpac = (meshes[i].material as THREE.MeshBasicMaterial).opacity
      const ring = meshes[i].children[0] as THREE.LineLoop

      // keep the dot orbiting continuously; freeze it in place while hovered/
      // pinned, and resume from the exact same angle when released
      if (!isActive) orbitAngles.current[i] += delta * ORBIT_SPEED
      const a = orbitAngles.current[i]
      dot.position.x = Math.cos(a) * ORBIT_RADIUS_X
      dot.position.y = Math.sin(a) * ORBIT_RADIUS_Y

      const target = isActive ? DOT_HOVER_SCALE : 1
      const next   = THREE.MathUtils.lerp(dot.scale.x, target, DOT_LERP)
      dot.scale.setScalar(next)
      ;(dot.material as THREE.MeshBasicMaterial).opacity = cardOpac
      ;(ring.material as THREE.LineBasicMaterial).opacity = cardOpac * 0.35
    })

    const overlay = overlayRef.current
    const overlayText = overlayTextRef.current
    if (!overlay) return

    if (activeIndex !== null) {
      const dot = dots[activeIndex]
      dot.updateWorldMatrix(true, false)
      dot.getWorldPosition(worldPos.current)
      const ndcPos = worldPos.current.clone().project(camera)
      const x = (ndcPos.x * 0.5 + 0.5) * size.width
      const y = (-ndcPos.y * 0.5 + 0.5) * size.height

      overlay.style.opacity = '1'
      overlay.style.transform = `translate(${x}px, ${y}px) translate(-50%, calc(-100% - 14px))`
      if (overlayText) overlayText.textContent = DESCRIPTIONS[activeIndex % DESCRIPTIONS.length]
    } else {
      overlay.style.opacity = '0'
    }
  })

  return <group ref={groupRef} />
}

// ─── Keeps the spiral fully in frame on any aspect ratio (phone portrait,
// tablet, ultrawide desktop) by pulling the camera back as the viewport
// gets narrower/taller, instead of using one fixed distance for every device.
function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    const cam = camera as THREE.PerspectiveCamera
    const baseAspect = 1.6 // aspect the original 5.5 distance / 50 fov was tuned for
    const baseDistance = 5.5

    const distance =
      aspect < baseAspect
        ? baseDistance * Math.sqrt(baseAspect / aspect)
        : baseDistance

    cam.position.z = Math.min(distance, 10)
    cam.aspect = aspect
    cam.updateProjectionMatrix()
  }, [camera, size])

  return null
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ scrollRef, maxScroll }: { scrollRef: React.MutableRefObject<number>; maxScroll: number }) {
  const fillRef  = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf: number
    const tick = () => {
      const p = Math.min(scrollRef.current / maxScroll, 1)
      if (fillRef.current)  fillRef.current.style.height = `${p * 100}%`
      if (countRef.current) countRef.current.textContent = String(Math.ceil(p * IMAGE_COUNT)).padStart(2, '0')
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollRef, maxScroll])

  return (
    <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
      <span ref={countRef} className="font-mono text-[11px] text-[#C8FF00] tabular-nums">00</span>
      <div className="relative w-px h-28 bg-white/10 rounded-full overflow-hidden">
        <div ref={fillRef} className="absolute top-0 left-0 w-full bg-[#C8FF00] rounded-full" style={{ height: '0%' }} />
      </div>
      <span className="font-mono text-[9px] text-white/20 tracking-widest">/{String(IMAGE_COUNT).padStart(2,'0')}</span>
    </div>
  )
}

// ─── Hover / tap description label ────────────────────────────────────────────
// A single DOM element reused for every dot — position, text, and opacity are
// all set imperatively inside the r3f frame loop above, so this never causes
// a React re-render and stays cheap even at 60fps.
function DescriptionOverlay({
  overlayRef,
  overlayTextRef,
}: {
  overlayRef: React.MutableRefObject<HTMLDivElement | null>
  overlayTextRef: React.MutableRefObject<HTMLSpanElement | null>
}) {
  return (
    <div
      ref={overlayRef}
      className="absolute top-0 left-0 z-30 p-3 pointer-events-none max-w-[200px] border border-lime backdrop-blur-sm "
      style={{ opacity: 0, transition: 'opacity 0.22s ease-in-out', boxShadow: '0 4px 24px rgba(0,0,0,0.6), 0 0 16px rgba(200,255,0,0.08)' }}
    >
      <span
        ref={overlayTextRef}
        className="font-bold text-[10px] tracking-tight text-white block"
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SpatialArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef  = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  const overlayRef     = useRef<HTMLDivElement>(null)
  const overlayTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = () => {
      const top = sectionRef.current?.offsetTop ?? 0
      scrollRef.current = Math.max(window.scrollY - top, 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const maxScroll = typeof window !== 'undefined' ? window.innerHeight * 4 : 3000

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative bg-void"
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Header */}
        <div className="absolute top-8 left-6 lg:left-12 z-20 pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.2em] text-text-secondary mb-2 uppercase">The Archive</p>
          <h2
            className="font-display font-medium tracking-[-0.03em] text-white leading-none"
            style={{ fontSize: 'clamp(2.25rem, 8vw, 4.5rem)' }}
          >
            SPATIAL
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse-dot inline-block" />
            <span className="font-mono text-[10px] tracking-widest text-[#C8FF00]/70 uppercase">Live</span>
          </div>
        </div>

        {/* Bottom left */}
        <div className="absolute bottom-8 left-6 lg:left-12 z-20 pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.2em] text-text-secondary uppercase">
            {String(IMAGE_COUNT).padStart(2,'0')} entries
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          <svg className="animate-bounce-arrow" width="12" height="16" viewBox="0 0 12 16" fill="none">
            <path d="M6 0v14M1 9l5 6 5-6" stroke="#8A8A8A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-[9px] tracking-[0.25em] text-text-secondary uppercase">Scroll</span>
        </div>

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map(c => (
          <div key={c} className={[
            'absolute w-5 h-5 pointer-events-none z-10 border-white/20',
            c==='tl'?'top-4 left-4 border-t border-l':'',
            c==='tr'?'top-4 right-4 border-t border-r':'',
            c==='bl'?'bottom-4 left-4 border-b border-l':'',
            c==='br'?'bottom-4 right-4 border-b border-r':'',
          ].join(' ')} />
        ))}

        {/* Progress */}
        <ProgressBar scrollRef={scrollRef} maxScroll={maxScroll} />

        {/* Hover / tap description label */}
        <DescriptionOverlay overlayRef={overlayRef} overlayTextRef={overlayTextRef} />

        {/* Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 50 }}
          dpr={isMobile ? 1 : [1, Math.min(window.devicePixelRatio, 2)]}
          gl={{ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' }}
          style={{ background: VOID_BG }}
        >
          <ResponsiveCamera />
          <Suspense fallback={null}>
            <Scene
              scrollRef={scrollRef}
              isMobile={isMobile}
              overlayRef={overlayRef}
              overlayTextRef={overlayTextRef}
            />
          </Suspense>
        </Canvas>

      </div>
    </section>
  )
}
