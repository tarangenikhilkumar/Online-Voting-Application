import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { Skeleton } from '../common/Skeleton'
import { cn } from '../../utils/cn'

const colors = {
  brand: 'from-brand-500 to-indigo-600 shadow-brand-500/30',
  pink: 'from-pink-500 to-rose-600 shadow-pink-500/30',
  sky: 'from-sky-500 to-cyan-600 shadow-sky-500/30',
  emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
  amber: 'from-amber-500 to-orange-600 shadow-amber-500/30',
  purple: 'from-purple-500 to-fuchsia-600 shadow-purple-500/30',
}

function CountUp({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value])

  return <span>{display.toLocaleString('en-IN')}</span>
}

function StatCard({ label, value = 0, icon: Icon, color = 'brand', loading = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="glass flex items-center gap-4 rounded-2xl p-5"
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
          colors[color],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-20" />
        ) : (
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            <CountUp value={value} />
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard