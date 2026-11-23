import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CheckCircle2, Clock, Users } from 'lucide-react'
import Badge from '../common/Badge'
import { ELECTION_STATUS } from '../../utils/constants'
import { formatDate, getTimeLeft } from '../../utils/formatDate'

const getActionText = (election) => {
  if (election.status === ELECTION_STATUS.RESULTS_PUBLISHED) return 'View results'
  if (election.hasVoted) return 'View details'
  if (election.status === ELECTION_STATUS.ACTIVE) return 'Vote now'
  return 'View details'
}

const getActionPath = (election) => {
  if (election.status === ELECTION_STATUS.RESULTS_PUBLISHED) {
    return `/voter/results/${election.id}`
  }
  return `/voter/elections/${election.id}`
}

function ElectionCard({ election, index = 0 }) {
  const isActive = election.status === ELECTION_STATUS.ACTIVE
  const isUpcoming = election.status === ELECTION_STATUS.UPCOMING
  const isPublished = election.status === ELECTION_STATUS.RESULTS_PUBLISHED

  let timeText = null
  if (isActive) {
    const left = getTimeLeft(election.endDate)
    timeText = left ? `Ends in ${left.replace(' left', '')}` : null
  } else if (isUpcoming) {
    const left = getTimeLeft(election.startDate)
    timeText = left ? `Starts in ${left.replace(' left', '')}` : null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="glass flex h-full flex-col rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge status={election.status} />
        {election.hasVoted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Voted
          </span>
        )}
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
        {election.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
        {election.description || 'No description provided.'}
      </p>

      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          {formatDate(election.startDate)} to {formatDate(election.endDate)}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" />
          {election.totalCandidates ?? 0} candidates
        </p>
        {timeText && (
          <p className="flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400">
            <Clock className="h-4 w-4 shrink-0" />
            {timeText}
          </p>
        )}
      </div>

      <Link
        to={getActionPath(election)}
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
          (isActive && !election.hasVoted) || isPublished
            ? 'gradient-bg text-white shadow-glow hover:brightness-110'
            : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        {getActionText(election)}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}

export default ElectionCard