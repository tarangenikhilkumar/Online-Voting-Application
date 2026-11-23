import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { FileText, Plus, RefreshCw, ServerCrash, Trash2 } from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import candidateService from '../../services/candidateService'
import { formatDateTime } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'

function MyApplications() {
  const { data, loading, error, refetch } = useFetch(candidateService.getApplications)
  const [withdrawTarget, setWithdrawTarget] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const applications = data || []

  const handleWithdraw = async () => {
    if (!withdrawTarget) return
    setWithdrawing(true)
    try {
      await candidateService.withdraw(withdrawTarget.id)
      toast.success('Application withdrawn')
      setWithdrawTarget(null)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setWithdrawTarget(null)
    } finally {
      setWithdrawing(false)
    }
  }

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load applications"
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My applications
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track approval status or withdraw pending applications.
          </p>
        </div>

        <Link to="/candidate/apply">
          <Button icon={Plus}>Apply for election</Button>
        </Link>
      </div>

      <section className="glass rounded-3xl p-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications submitted yet"
            description="Browse upcoming elections and submit your candidacy."
            className="py-10"
            action={
              <Link to="/candidate/apply">
                <Button>Browse upcoming elections</Button>
              </Link>
            }
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Election</th>
                  <th className="pb-3 font-semibold">Election status</th>
                  <th className="pb-3 font-semibold">Application status</th>
                  <th className="pb-3 font-semibold">Applied on</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      {app.electionTitle}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge status={app.electionStatus} />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDateTime(app.appliedAt)}
                    </td>
                    <td className="py-3.5 text-right">
                      {app.status === 'PENDING' ? (
                        <Button
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                          onClick={() => setWithdrawTarget(app)}
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(withdrawTarget)}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleWithdraw}
        title="Withdraw application"
        message={
          withdrawTarget
            ? `Are you sure you want to withdraw your application for "${withdrawTarget.electionTitle}"?`
            : ''
        }
        confirmText="Yes, withdraw"
        variant="danger"
        loading={withdrawing}
      />
    </div>
  )
}

export default MyApplications