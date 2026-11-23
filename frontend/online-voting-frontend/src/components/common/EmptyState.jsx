import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { cn } from '../../utils/cn'

function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700',
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-pulse rounded-full bg-brand-500/20 blur-xl" />
        <div className="gradient-bg relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

export default EmptyState