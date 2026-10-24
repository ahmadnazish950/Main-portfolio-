import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { UnrealBloomPass } from 'three-stdlib'
import * as THREE from 'three'

extend({ UnrealBloomPass })

declare module '@react-three/fiber' {
  interface ThreeElements {
    unrealBloomPass: any
  }
}

const shellThickSafe = (n: number) => 200 / Math.max(n, 1)
const wrapHue = (h: number) => ((h % 1) + 1) % 1

interface SwarmProps {
  themeColor: string
  count: number
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

const ParticleSwarm = ({ themeColor, count, mouse }: SwarmProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const base = useMemo(() => {
    const hsl = { h: 0, s: 0, l: 0 }
    new THREE.Color(themeColor).getHSL(hsl)
    return hsl
  }, [themeColor])

  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = []
    for (let i = 0; i < count; i++)
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      )
    return pos
  }, [count])

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), [])
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), [])

  const blastRadius = 70
  const shockSpeed = 6
  const coreFlash = 5
  const debris = 1.8
  const shellCount = 2.84
  const orbitGap = 12
  const orbitSpeed = 1.5

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()

    // cursor ke hisaab se rotation (smooth)
    if (groupRef.current) {
      const targetY = mouse.current.x * 0.9 + time * 0.05
      const targetX = mouse.current.y * 0.6
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04
    }

    for (let i = 0; i < count; i++) {
      const isRemnant = i / count < 0.03 ? 1 : 0
      const seedA = Math.sin(i * 12.9898) * 43758.5453
      const randA = seedA - Math.floor(seedA)
      const seedB = Math.sin(i * 78.233 + 3.1) * 12345.678
      const randB = seedB - Math.floor(seedB)
      const seedC = Math.sin(i * 45.164 + 7.7) * 98765.432
      const randC = seedC - Math.floor(seedC)

      const starPick = i % 2
      const orbitAngle = time * orbitSpeed + starPick * Math.PI
      const remX = Math.cos(orbitAngle) * orbitGap * starPick
      const remY = Math.sin(orbitAngle * 0.6) * orbitGap * 0.3 * starPick
      const remZ = Math.sin(orbitAngle) * orbitGap * starPick
      const remJitter = (randA - 0.5) * 3

      const phi = randA * Math.PI * 2
      const costh = randB * 2 - 1
      const sinth = Math.sqrt(Math.max(0, 1 - costh * costh))
      const dirX = sinth * Math.cos(phi)
      const dirY = costh
      const dirZ = sinth * Math.sin(phi)

      const shellId = Math.floor(randC * shellCount)
      const shellOffset = shellId * shellThickSafe(shellCount)
      const cycleSpan = blastRadius + shellOffset + 10
      const dist = (time * shockSpeed + randC * 10 + shellOffset * 3) % cycleSpan
      const wobble =
        Math.sin(dist * 0.3 + time * 2 + i * 0.05) * debris * (dist / (blastRadius + 1))
      const shockPulse = 0.5 + 0.5 * Math.sin(time * 2 - dist * 0.15 + shellId * 2)

      target.set(
        isRemnant ? remX + remJitter : dirX * dist + wobble,
        isRemnant ? remY + remJitter : dirY * dist + wobble * 0.8,
        isRemnant ? remZ + remJitter : dirZ * dist + wobble
      )

      const coreProximity = Math.max(0, 1 - dist / 16)
      const shellFactor = Math.max(
        0,
        1 - Math.abs((dist % (cycleSpan / shellCount)) - 8) / 8
      )

      const hue = isRemnant
        ? starPick === 0
          ? base.h
          : wrapHue(base.h - 0.04)
        : wrapHue(base.h + 0.01 - coreProximity * 0.02 - shellFactor * 0.02)
      const sat = isRemnant ? base.s : Math.max(base.s - coreProximity * 0.3, 0.4)
      const light = isRemnant
        ? Math.min(0.55 + coreFlash * 0.05, 0.8)
        : Math.min(
            0.25 + coreProximity * coreFlash * 0.25 + shellFactor * shockPulse * 0.3,
            0.85
          )
      color.setHSL(hue, sat, light)

      positions[i].lerp(target, 0.1)
      dummy.position.copy(positions[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, color)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </group>
  )
}

interface ParticleFieldProps {
  themeColor?: string
  count?: number
  opacity?: number
}

export default function ParticleField({
  themeColor = '#a3e635',
  count = 12000,
  opacity = 0.6,
}: ParticleFieldProps) {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: 'screen',
      }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 100], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ParticleSwarm themeColor={themeColor} count={count} mouse={mouse} />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.1} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  )}