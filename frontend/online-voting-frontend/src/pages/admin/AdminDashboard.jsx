import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Megaphone,
  RefreshCw,
  ServerCrash,
  Users,
  Vote,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import StatCard from '../../components/cards/StatCard'
import VotesBarChart from '../../components/charts/VotesBarChart'
import VotesPieChart from '../../components/charts/VotesPieChart'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/formatDate'

const stats = [
  { key: 'totalVoters', label: 'Registered voters', icon: Users, color: 'brand' },
  { key: 'totalCandidates', label: 'Candidates', icon: Megaphone, color: 'pink' },
  { key: 'totalElections', label: 'Total elections', icon: Vote, color: 'sky' },
  { key: 'totalVotes', label: 'Votes cast', icon: CheckCircle2, color: 'emerald' },
  { key: 'activeElections', label: 'Active elections', icon: Activity, color: 'amber' },
  { key: 'upcomingElections', label: 'Upcoming elections', icon: CalendarClock, color: 'purple' },
]

function AdminDashboard() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useFetch(adminService.getDashboard)

  const firstName = user?.fullName?.split(' ')[0] || 'Admin'

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

  const recent = data?.recentElections || []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Welcome back, <span className="gradient-text">{firstName}</span> 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here is what is happening across your elections.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-bold">Votes per election</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Total votes received in each election.
          </p>
          {loading ? (
            <Skeleton className="h-72 w-full rounded-2xl" />
          ) : (
            <VotesBarChart data={data?.electionStats} />
          )}
        </section>

        <section className="glass rounded-3xl p-6">
          <h3 className="font-bold">Election status</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            How your elections are distributed.
          </p>
          {loading ? (
            <Skeleton className="h-56 w-full rounded-2xl" />
          ) : (
            <VotesPieChart data={data?.statusBreakdown} />
          )}
        </section>
      </div>

      <section className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Recent elections</h3>
          <Link
            to="/admin/elections"
            className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections created yet"
            description="Pehla election banao, wo yahan dikhega."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Election</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Start</th>
                  <th className="pb-3 font-semibold">End</th>
                  <th className="pb-3 text-right font-semibold">Votes</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((election) => (
                  <tr
                    key={election.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3 pr-4 font-semibold">{election.title}</td>
                    <td className="py-3 pr-4">
                      <Badge status={election.status} />
                    </td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDate(election.startDate)}
                    </td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDate(election.endDate)}
                    </td>
                    <td className="py-3 text-right font-semibold">{election.totalVotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard