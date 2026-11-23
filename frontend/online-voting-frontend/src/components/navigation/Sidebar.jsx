import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote } from 'lucide-react'
import { cn } from '../../utils/cn'

function Sidebar({ items, collapsed = false, onNavigate, variant = 'desktop' }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className={cn(
          'flex h-16 shrink-0 items-center gap-3 px-5',
          collapsed && 'justify-center px-0',
        )}
      >
        <div className="gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-glow">
          <Vote className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="whitespace-nowrap text-xl font-extrabold">
            Secure<span className="gradient-text">Vote</span>
          </span>
        )}
      </Link>

      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center',
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={`sidebar-active-${variant}`}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="gradient-bg absolute inset-0 rounded-xl shadow-glow"
                  />
                )}
                <Icon className="relative z-10 h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="relative z-10 truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <p className="px-5 py-4 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SecureVote
        </p>
      )}
    </div>
  )
}

export default Sidebar