import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Construction, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/common/ThemeToggle'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'

const testLinks = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/admin/dashboard', label: 'Admin' },
  { to: '/voter/dashboard', label: 'Voter' },
  { to: '/candidate/dashboard', label: 'Candidate' },
  { to: '/ui-kit', label: 'UI Kit' },
]

function PlaceholderPage({ title }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="absolute -left-20 -top-20 h-72 w-72 animate-float rounded-full bg-brand-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 animate-float rounded-full bg-pink-400/30 blur-3xl" />

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative z-10 w-full max-w-md rounded-3xl p-8 text-center"
      >
        <div className="gradient-bg mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
          <Construction className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ye placeholder page hai, asli design jaldi aayega.
        </p>

        {isAuthenticated ? (
          <div className="mt-5 rounded-2xl bg-slate-500/10 p-4 text-sm">
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-2">
              <Badge status={user.role} />
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm font-medium text-amber-500">Logged out</p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {testLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {isAuthenticated && (
          <Button variant="danger" icon={LogOut} fullWidth className="mt-6" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </motion.div>
    </div>
  )
}

export default PlaceholderPage