import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Hero from '@/sections/Hero'
import SelectedWork from '@/sections/SelectedWork'
import SpatialArchive from '@/sections/SpatialArchive'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Testimonials from '@/sections/Testimonials'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'
import useLenis from '@/hooks/useLenis'
import Preloader from '@/components/Preloader'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  useLenis()

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-void min-h-screen"
      >
        <CustomCursor />
        <Navigation />
        <main>
          <Hero startAnimation={loaded} />
          <SelectedWork />
          <SpatialArchive />
          <About />
          <Skills />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}
