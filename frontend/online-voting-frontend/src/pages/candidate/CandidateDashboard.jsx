import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  ServerCrash,
  XCircle,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import StatCard from '../../components/cards/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import candidateService from '../../services/candidateService'
import { formatDate } from '../../utils/formatDate'

const stats = [
  { key: 'totalApplications', label: 'Total applications', icon: FileText, color: 'brand' },
  { key: 'pendingApplications', label: 'Pending', icon: Clock, color: 'amber' },
  { key: 'approvedApplications', label: 'Approved', icon: CheckCircle2, color: 'emerald' },
  { key: 'rejectedApplications', label: 'Rejected', icon: XCircle, color: 'pink' },
]

function CandidateDashboard() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useFetch(candidateService.getDashboard)

  const firstName = user?.fullName?.split(' ')[0] || 'Candidate'
  const recent = data?.recentApplications || []

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
          Track your election applications here.
        </p>
      </motion.div>

      {!loading && data && !data.profileComplete && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Complete your profile (party name and description) before applying.
          </span>
          <Link to="/candidate/profile">
            <Button size="sm">Complete profile</Button>
          </Link>
        </div>
      )}

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

      <section className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Recent applications</h3>
          <Link
            to="/candidate/applications"
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
            icon={FileText}
            title="No applications yet"
            description="Apply for an upcoming election to get started."
            className="py-10"
            action={
              <Link to="/candidate/apply">
                <Button>Apply for an election</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Election</th>
                  <th className="pb-3 font-semibold">Election status</th>
                  <th className="pb-3 font-semibold">Application</th>
                  <th className="pb-3 font-semibold">Applied on</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3 pr-4 font-semibold">{app.electionTitle}</td>
                    <td className="py-3 pr-4">
                      <Badge status={app.electionStatus} />
                    </td>
                    <td className="py-3 pr-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(app.appliedAt)}
                    </td>
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

export default CandidateDashboard