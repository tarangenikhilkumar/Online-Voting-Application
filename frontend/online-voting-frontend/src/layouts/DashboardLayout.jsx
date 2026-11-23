import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import MobileMenu from '../components/navigation/MobileMenu'
import Navbar from '../components/navigation/Navbar'
import Sidebar from '../components/navigation/Sidebar'
import { useAuth } from '../hooks/useAuth'
import { NAV_ITEMS } from '../utils/navigation'

function DashboardLayout() {
  const { role } = useAuth()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = NAV_ITEMS[role] || []
  const currentItem = items.find((item) => location.pathname.startsWith(item.to))
  const title = currentItem?.label || 'Dashboard'

  return (
    <div className="flex min-h-screen">
      <div className="pointer-events-none fixed -left-24 top-1/3 -z-10 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-pink-400/10 blur-3xl" />

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-slate-200 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 lg:block"
      >
        <Sidebar items={items} collapsed={collapsed} variant="desktop" />
      </motion.aside>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={items}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={title}
          collapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout