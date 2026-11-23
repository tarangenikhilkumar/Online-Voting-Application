import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  EyeOff,
  Fingerprint,
  Layers,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserPlus,
  Vote,
} from 'lucide-react'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../utils/constants'

const ballotChoices = [
  {
    id: 1,
    code: '01',
    title: 'Option A',
    subtitle: 'Encrypted Single-Choice Ballot',
    votes: 428,
    accent: 'from-indigo-500 to-cyan-500',
  },
  {
    id: 2,
    code: '02',
    title: 'Option B',
    subtitle: 'Encrypted Single-Choice Ballot',
    votes: 512,
    accent: 'from-brand-500 to-pink-500',
  },
  {
    id: 3,
    code: '03',
    title: 'Option C',
    subtitle: 'Encrypted Single-Choice Ballot',
    votes: 344,
    accent: 'from-emerald-500 to-teal-500',
  },
]

const architectureLayers = [
  {
    step: '01',
    title: 'Identity & Role Guard',
    detail: 'JWT token validation isolates Admin, Voter, and Candidate permissions at every endpoint.',
    tag: 'Spring Security',
  },
  {
    step: '02',
    title: 'Single-Ballot Lock',
    detail: 'Database-level unique constraints prevent duplicate submissions across concurrent requests.',
    tag: 'ACID Enforced',
  },
  {
    step: '03',
    title: 'Zero-Link Anonymity',
    detail: 'Participation records and ballot selections remain decoupled so choices stay private.',
    tag: 'Privacy First',
  },
]

const features = [
  {
    icon: EyeOff,
    title: 'Anonymous ballots',
    text: 'Who voted and what was voted are stored separately, so choices cannot be linked to voters.',
  },
  {
    icon: ShieldCheck,
    title: 'One person, one vote',
    text: 'Duplicate voting is blocked by the server and by a database constraint.',
  },
  {
    icon: LockKeyhole,
    title: 'Role-based access',
    text: 'Admins, voters and candidates each get their own secure workspace.',
  },
  {
    icon: BarChart3,
    title: 'Live analytics',
    text: 'Interactive charts show turnout and results once they are published.',
  },
  {
    icon: LayoutDashboard,
    title: 'Election management',
    text: 'Schedule elections, approve candidates and control the full lifecycle.',
  },
  {
    icon: Smartphone,
    title: 'Works everywhere',
    text: 'A fast, responsive interface for phones, tablets and desktops.',
  },
]

const steps = [
  {
    icon: UserPlus,
    title: 'Create an account',
    text: 'Register as a voter or a candidate in under a minute.',
  },
  {
    icon: ListChecks,
    title: 'Pick an election',
    text: 'Browse active elections and review every approved option.',
  },
  {
    icon: CheckCircle2,
    title: 'Cast your vote',
    text: 'Confirm your choice once. Your vote stays private and final.',
  },
]

const floatingParticles = [
  { top: '14%', left: '8%', size: 6, duration: 7, delay: 0 },
  { top: '28%', left: '88%', size: 8, duration: 9, delay: 1 },
  { top: '52%', left: '6%', size: 5, duration: 8, delay: 2 },
  { top: '68%', left: '92%', size: 7, duration: 10, delay: 0.5 },
  { top: '82%', left: '15%', size: 6, duration: 8.5, delay: 1.5 },
  { top: '40%', left: '50%', size: 5, duration: 11, delay: 2.5 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function MouseTraceLayer() {
  const [visible, setVisible] = useState(false)
  const rawX = useMotionValue(-300)
  const rawY = useMotionValue(-300)

  // Cascading spring stiffness creates a fluid ribbon-like mouse trace
  const leadX = useSpring(rawX, { stiffness: 520, damping: 28, mass: 0.3 })
  const leadY = useSpring(rawY, { stiffness: 520, damping: 28, mass: 0.3 })

  const midX = useSpring(rawX, { stiffness: 240, damping: 24, mass: 0.6 })
  const midY = useSpring(rawY, { stiffness: 240, damping: 24, mass: 0.6 })

  const tailX = useSpring(rawX, { stiffness: 120, damping: 22, mass: 1 })
  const tailY = useSpring(rawY, { stiffness: 120, damping: 22, mass: 1 })

  const auraX = useSpring(rawX, { stiffness: 70, damping: 25, mass: 1.4 })
  const auraY = useSpring(rawY, { stiffness: 70, damping: 25, mass: 1.4 })

  useEffect(() => {
    const handlePointerMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const handlePointerLeave = () => setVisible(false)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [rawX, rawY, visible])

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 hidden overflow-hidden transition-opacity duration-300 md:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Large Soft Ambient Spotlight Aura */}
      <motion.div
        style={{ x: auraX, y: auraY }}
        className="-ml-44 -mt-44 h-88 w-88 rounded-full bg-gradient-to-tr from-brand-500/15 via-indigo-500/10 to-pink-500/15 blur-3xl"
      />

      {/* Trailing Outer Ring */}
      <motion.div
        style={{ x: tailX, y: tailY }}
        className="fixed left-0 top-0 -ml-5 -mt-5 h-10 w-10 rounded-full border border-pink-500/40 bg-pink-500/5 blur-[0.5px]"
      />

      {/* Mid Glow Orb */}
      <motion.div
        style={{ x: midX, y: midY }}
        className="fixed left-0 top-0 -ml-3 -mt-3 h-6 w-6 rounded-full border border-brand-400/60 bg-brand-500/15"
      />

      {/* Crisp Leading Trace Core */}
      <motion.div
        style={{ x: leadX, y: leadY }}
        className="gradient-bg fixed left-0 top-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full shadow-glow"
      />
    </div>
  )
}

function TiltBallotStage({
  ballotChoices,
  selectedChoice,
  setSelectedChoice,
  votedChoice,
  previewMode,
  setPreviewMode,
  totalVotes,
  onConfirmVote,
}) {
  const stageRef = useRef(null)
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 20 })
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 20 })
  const glareBackground = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 70%)`

  const handleMouseMove = (e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rawRotateY.set((px - 0.5) * 22)
    rawRotateX.set((0.5 - py) * 22)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const handleMouseLeave = () => {
    rawRotateX.set(0)
    rawRotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-full max-w-md py-4"
    >
      {/* 3D Rotating Orbital Rings Behind Card */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -inset-6 rounded-full border border-dashed border-brand-500/35"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -inset-12 hidden rounded-full border border-pink-500/20 sm:block"
      />

      {/* Ambient Backlight */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.4rem] bg-gradient-to-tr from-brand-500/35 via-indigo-500/25 to-pink-500/35 blur-2xl" />

      {/* 3D Interactive Stage */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {/* Floating 3D Top-Right Telemetry Chip */}
        <div
          style={{ transform: 'translateZ(46px)' }}
          className="glass mb-3 ml-auto flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xl"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span>3D Interactive Ballot &bull; {totalVotes.toLocaleString()} Votes</span>
        </div>

        {/* Offset 3D Depth Plate */}
        <div
          style={{ transform: 'translateZ(-26px) translate(14px, 14px)' }}
          className="glass pointer-events-none absolute inset-0 top-9 rounded-3xl opacity-45"
        />

        {/* Main Glass Ballot Card */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="glass relative overflow-hidden rounded-3xl p-6 shadow-2xl"
        >
          <motion.div
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0"
          />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold">Your ballot</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Move cursor to tilt &bull; Click to test
                </p>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-200/70 p-1 text-[11px] font-bold dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setPreviewMode('ballot')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  previewMode === 'ballot'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Ballot
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('tally')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  previewMode === 'tally'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Tally
              </button>
            </div>
          </div>

          {previewMode === 'ballot' ? (
            <div className="relative">
              <div className="mt-6 space-y-3">
                {ballotChoices.map((choice) => {
                  const isSelected = selectedChoice === choice.id
                  return (
                    <motion.button
                      key={choice.id}
                      type="button"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedChoice(choice.id)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 shadow-md'
                          : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-700/80 dark:hover:border-slate-600'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${choice.accent} text-xs font-extrabold text-white shadow-sm`}
                      >
                        {choice.code}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{choice.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {choice.subtitle}
                        </p>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                      ) : (
                        <span className="h-5 w-5 shrink-0 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirmVote}
                className="gradient-bg mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" />
                Confirm vote
              </motion.button>
            </div>
          ) : (
            <div className="relative mt-6 space-y-4">
              {ballotChoices.map((choice) => {
                const count = choice.votes + (votedChoice === choice.id ? 1 : 0)
                const pct = Math.round((count / totalVotes) * 100)
                return (
                  <div key={choice.id}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2">
                        {choice.title}
                        {votedChoice === choice.id && (
                          <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] text-brand-500">
                            Recorded
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {count} votes ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.55 }}
                        className={`h-full rounded-full bg-gradient-to-r ${choice.accent}`}
                      />
                    </div>
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() => setPreviewMode('ballot')}
                className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Return to ballot view
              </button>
            </div>
          )}
        </div>

        {/* Floating 3D Bottom-Left Encryption Pill */}
        <div
          style={{ transform: 'translateZ(52px)' }}
          className="glass -mt-4 ml-4 flex w-fit items-center gap-2 rounded-2xl border border-brand-500/30 px-4 py-2 text-xs font-bold shadow-xl"
        >
          <Fingerprint className="h-4 w-4 text-brand-500" />
          <span>AES-256 &bull; Zero-Link Receipt</span>
        </div>
      </motion.div>
    </div>
  )
}

function SpotlightCard({ children, className = '' }) {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.18), transparent 80%)`

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`glass group relative overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-2xl ${className}`}
    >
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function LandingPage() {
  const { isAuthenticated, role } = useAuth()
  const [selectedChoice, setSelectedChoice] = useState(2)
  const [votedChoice, setVotedChoice] = useState(null)
  const [previewMode, setPreviewMode] = useState('ballot')

  const { scrollYProgress } = useScroll()
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.35], [0, -35])
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.97])

  const totalVotes =
    ballotChoices.reduce((sum, item) => sum + item.votes, 0) + (votedChoice ? 1 : 0)

  const handleDemoVote = () => {
    setVotedChoice(selectedChoice)
    setPreviewMode('tally')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Global Smooth Mouse Trace & Spotlight Layer */}
      <MouseTraceLayer />

      {/* Perspective Grid & Ambient Floating Particles */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute -left-36 -top-36 h-[32rem] w-[32rem] animate-float rounded-full bg-brand-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-36 top-32 h-[32rem] w-[32rem] animate-float rounded-full bg-pink-500/20 blur-[110px]" />

      {floatingParticles.map((p, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.75, 0.25] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
          }}
          className="gradient-bg pointer-events-none fixed -z-10 rounded-full blur-[1px]"
        />
      ))}

      {/* Top Glass Header */}
      <header className="glass sticky top-0 z-40 rounded-none border-x-0 border-t-0 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl shadow-glow"
            >
              <Vote className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight">
              Secure<span className="gradient-text">Vote</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#architecture" className="transition hover:text-brand-600 dark:hover:text-brand-400">
              Architecture
            </a>
            <a href="#features" className="transition hover:text-brand-600 dark:hover:text-brand-400">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-brand-600 dark:hover:text-brand-400">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to={ROLE_HOME[role] || '/'}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button size="sm" variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Scroll Parallax */}
      <motion.section
        style={{ y: heroParallaxY, scale: heroScale }}
        className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-12 lg:py-24"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="lg:col-span-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <ShieldCheck className="h-4 w-4" />
            Secure. Private. Transparent.
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Elections you can{' '}
            <span className="gradient-text">trust</span>, from any device.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            SecureVote is a modern online voting platform where every voter gets
            exactly one anonymous vote and every result is clear and verifiable.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to={isAuthenticated ? ROLE_HOME[role] || '/' : '/register'}>
                <Button size="lg" icon={ArrowRight}>
                  {isAuthenticated ? 'Open dashboard' : 'Start voting'}
                </Button>
              </Link>
            </motion.div>
            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login">
                  <Button size="lg" variant="outline">Sign in</Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Crisp Telemetry Counters */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-800">
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100%</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Anonymous Ballots
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">1 : 1</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Voter-to-Vote Lock
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Live</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Audit &amp; Tally Feed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Interactive Stage */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="lg:col-span-6"
        >
          <TiltBallotStage
            ballotChoices={ballotChoices}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            votedChoice={votedChoice}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            totalVotes={totalVotes}
            onConfirmVote={handleDemoVote}
          />
        </motion.div>
      </motion.section>

      {/* Security Architecture Strip */}
      <section id="architecture" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 sm:p-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200/70 pb-6 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-500">
                <Layers className="h-3.5 w-3.5" />
                System Integrity
              </span>
              <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Three-layer <span className="gradient-text">ballot protection</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4 text-brand-500" />
                JWT Authenticated
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-500" />
                Audit Logged
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {architectureLayers.map((layer) => (
              <motion.div
                key={layer.step}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200/70 bg-white/40 p-5 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between">
                  <span className="gradient-text text-sm font-extrabold">{layer.step}</span>
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-600 dark:text-brand-300">
                    {layer.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-bold">{layer.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {layer.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid with Cursor-Tracking Spotlight Cards */}
      <section id="features" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Everything an election <span className="gradient-text">needs</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Built with security and privacy at the core, not added later.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <SpotlightCard key={title}>
              <div className="gradient-bg mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-glow">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-3xl font-extrabold sm:text-4xl"
        >
          How it <span className="gradient-text">works</span>
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="glass relative rounded-2xl p-6 text-center transition-shadow hover:shadow-xl"
            >
              <span className="gradient-bg absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold text-white shadow-glow">
                {index + 1}
              </span>
              <div className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      {!isAuthenticated && (
        <section className="relative mx-auto max-w-6xl px-6 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="gradient-bg relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-glow"
          >
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl font-extrabold sm:text-4xl">
              Ready to make your voice count?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/80">
              Create your free account and join the next election.
            </p>
            <Link to="/register" className="relative mt-8 inline-block">
              <Button size="lg" variant="secondary" icon={ArrowRight}>
                Create account
              </Button>
            </Link>
          </motion.div>
        </section>
      )}

      <footer className="relative border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        &copy; {new Date().getFullYear()} SecureVote. Online Voting Platform.
      </footer>
    </div>
  )
}

export default LandingPage