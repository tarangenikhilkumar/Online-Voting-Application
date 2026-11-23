import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  ServerCrash,
  Vote,
} from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { SkeletonCard } from '../../components/common/Skeleton'
import ElectionCard from '../../components/cards/ElectionCard'
import StatCard from '../../components/cards/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import voterService from '../../services/voterService'

const stats = [
  { key: 'totalElections', label: 'Total elections', icon: Vote, color: 'brand' },
  { key: 'activeElections', label: 'Active now', icon: Activity, color: 'emerald' },
  { key: 'upcomingElections', label: 'Upcoming', icon: CalendarClock, color: 'sky' },
  { key: 'votesCast', label: 'Votes cast by you', icon: CheckCircle2, color: 'purple' },
]

function VoterDashboard() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useFetch(voterService.getDashboard)

  const firstName = user?.fullName?.split(' ')[0] || 'Voter'
  const activeList = data?.activeElectionsList || []

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load dashboard"
        description={error}
        action={
          <Button icon={RefreshCw} onClick={refetch}>
            Try again
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Hello, <span className="gradient-text">{firstName}</span> 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your voice matters. Check the elections open for you.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ key, label, icon, color }, index) => (
          <StatCard
            key={key}
            index={index}
            label={label}
            icon={icon}
            color={color}
            loading={loading}
            value={data?.[key] ?? 0}
          />
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Open for voting</h3>
          <Link
            to="/voter/elections"
            className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            View all elections
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : activeList.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No active elections right now"
            description="Jab koi election start hoga, wo yahan dikhega."
            className="py-10"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {activeList.map((election, index) => (
              <ElectionCard key={election.id} election={election} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default VoterDashboard