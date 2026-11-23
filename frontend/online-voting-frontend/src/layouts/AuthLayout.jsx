import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, EyeOff, ShieldCheck, Vote } from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle'

const features = [
  {
    icon: EyeOff,
    title: 'Anonymous ballots',
    text: 'Your choice is never linked to your identity.',
  },
  {
    icon: ShieldCheck,
    title: 'One person, one vote',
    text: 'Duplicate voting is blocked at the database level.',
  },
  {
    icon: BarChart3,
    title: 'Transparent results',
    text: 'Clear analytics once results are officially published.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

function AuthLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="gradient-bg relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 animate-float rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:28px_28px]" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Vote className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold">SecureVote</span>
        </Link>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold leading-tight xl:text-5xl"
          >
            Your vote.
            <br />
            Your voice.
            <br />
            Secured.
          </motion.h2>

          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-10 space-y-5"
          >
            {features.map(({ icon: Icon, title, text }) => (
              <motion.li key={title} variants={item} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <p className="relative z-10 text-sm text-white/60">
          &copy; {new Date().getFullYear()} SecureVote. All rights reserved.
        </p>
      </div>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl lg:hidden" />

        <div className="absolute right-6 top-6 z-10">
          <ThemeToggle />
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="gradient-bg flex h-11 w-11 items-center justify-center rounded-xl shadow-glow">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold">
              Secure<span className="gradient-text">Vote</span>
            </span>
          </Link>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout