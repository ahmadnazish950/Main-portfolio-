import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'curtain-close' | 'curtain-open' | 'done'>('loading')

  useEffect(() => {
    const duration = 3000
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p
      setProgress(Math.floor(eased * 100))

      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setProgress(100)
        // Step 1: curtain closes
        setTimeout(() => setPhase('curtain-close'), 300)
        // Step 2: curtain opens back
        setTimeout(() => setPhase('curtain-open'), 950)
        // Step 3: done — remove preloader
        setTimeout(() => {
          setPhase('done')
          onComplete()
        }, 1700)
      }
    }

    requestAnimationFrame(tick)
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        background: '#0c0c0c',
      }}
    >
      {/* Left curtain */}
      <motion.div
        animate={{
          x:
            phase === 'curtain-close'
              ? 0
              : phase === 'curtain-open'
              ? '-101%'
              : '-101%',
        }}
        transition={{
          duration: 0.55,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '50%', height: '100%',
          background: '#a3e635',
          zIndex: 20,
          x: '-101%',
        }}
      />

      {/* Right curtain */}
      <motion.div
        animate={{
          x:
            phase === 'curtain-close'
              ? 0
              : phase === 'curtain-open'
              ? '101%'
              : '101%',
        }}
        transition={{
          duration: 0.55,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '50%', height: '100%',
          background: '#a3e635',
          zIndex: 20,
          x: '101%',
        }}
      />

      {/* Loader text — hidden when curtain closes */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              padding: '0 24px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 'clamp(10px, 3vw, 14px)',
                letterSpacing: 'clamp(0.25em, 2.2vw, 1em)',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                textTransform: 'uppercase',
                marginBottom: '48px',
                whiteSpace: 'nowrap',
              }}
            >
              Nazish Ahmad
            </motion.p>

            <div
              style={{
                width: 'min(340px, 78vw)',
                height: '1px',
                background: 'rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  height: '100%',
                  background: '#a3e635',
                  width: `${progress}%`,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '16px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {progress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
