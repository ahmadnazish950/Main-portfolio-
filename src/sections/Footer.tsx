export default function Footer() {
  return (
    <footer className="relative bg-void py-16 px-6 lg:px-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 font-display font-bold text-[18vw] leading-none tracking-tighter"
          style={{ color: 'rgba(26, 26, 26, 0.5)' }}
        >
         NAZISH
        </span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-wide text-text-secondary">
          NAZISH
        </span>
        <span className="font-mono text-xs tracking-wide text-text-secondary">
          Designed & Built by me
        </span>
        <span className="font-mono text-xs tracking-wide text-text-secondary">
          2024
        </span>
      </div>
    </footer>
  )
}
