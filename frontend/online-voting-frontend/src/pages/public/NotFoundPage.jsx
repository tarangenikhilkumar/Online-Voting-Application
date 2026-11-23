import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'

function NotFoundPage() {
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
        className="relative z-10 text-center"
      >
        <p className="gradient-text text-8xl font-extrabold sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button size="lg" icon={Home}>Back to home</Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage