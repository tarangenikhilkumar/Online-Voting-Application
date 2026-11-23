import { cn } from '../../utils/cn'
import {
  APPLICATION_STATUS,
  ELECTION_STATUS,
  ROLES,
} from '../../utils/constants'

const styles = {
  [ELECTION_STATUS.UPCOMING]: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  [ELECTION_STATUS.ACTIVE]: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  [ELECTION_STATUS.COMPLETED]: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  [ELECTION_STATUS.RESULTS_PUBLISHED]: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  [APPLICATION_STATUS.PENDING]: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  [APPLICATION_STATUS.APPROVED]: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  [APPLICATION_STATUS.REJECTED]: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  [ROLES.ADMIN]: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  [ROLES.VOTER]: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  [ROLES.CANDIDATE]: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
}

function Badge({ status, children, className }) {
  const style = styles[status] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
  const label = children || status?.toLowerCase().replace(/_/g, ' ')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
        style,
        className,
      )}
    >
      {status === ELECTION_STATUS.ACTIVE && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
      {label}
    </span>
  )
}

export default Badge