import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { toast } from 'sonner'
import Badge from '../common/Badge'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function Navbar({ title, collapsed, onMenuClick, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
    toast.success('Logged out successfully')
  }

  const iconBtn =
    'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 backdrop-blur transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700'

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-4 rounded-none border-x-0 border-t-0 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`${iconBtn} lg:hidden`}
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className={`${iconBtn} hidden lg:flex`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="gradient-bg flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white">
              {getInitials(user?.fullName)}
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-semibold sm:block">
              {user?.fullName}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold">{user?.fullName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    <Badge status={user?.role} />
                  </div>
                </div>

                <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Navbar
