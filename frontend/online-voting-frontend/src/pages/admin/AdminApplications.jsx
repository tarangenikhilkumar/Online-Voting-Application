import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  Check,
  FileText,
  RefreshCw,
  ServerCrash,
  X,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDateTime } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { getImageUrl } from '../../utils/imageUrl'

const PAGE_SIZE = 10

const STATUS_TABS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'All', value: '' },
]

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function AdminApplications() {
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [decision, setDecision] = useState(null) // { type: 'approve' | 'reject', app }
  const [submitting, setSubmitting] = useState(false)

  const fetcher = useCallback(
    () =>
      adminService.getApplications({
        status: statusFilter || undefined,
        page,
        size: PAGE_SIZE,
      }),
    [statusFilter, page],
  )

  const { data, loading, error, refetch } = useFetch(fetcher)
  const applications = data?.content || []

  const handleDecision = async () => {
    if (!decision) return
    const { type, app } = decision
    setSubmitting(true)
    try {
      if (type === 'approve') {
        await adminService.approveApplication(app.id)
        toast.success(`Approved ${app.candidateName} for ${app.electionTitle}`)
      } else {
        await adminService.rejectApplication(app.id)
        toast.success(`Rejected ${app.candidateName}'s application`)
      }
      setDecision(null)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setDecision(null)
    } finally {
      setSubmitting(false)
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
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Candidate applications
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review candidate profiles and approve or reject election nominations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatusFilter(tab.value)
              setPage(0)
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              statusFilter === tab.value
                ? 'gradient-bg text-white shadow-glow'
                : 'glass text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="glass rounded-3xl p-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="Switch status filters or check back when candidates apply."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Party</th>
                  <th className="pb-3 font-semibold">Election</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Applied on</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const avatar = getImageUrl(app.profileImageUrl)
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={app.candidateName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              {getInitials(app.candidateName)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {app.candidateName}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {app.candidateEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
                        {app.partyName || 'Independent'}
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {app.electionTitle}
                        </div>
                        <div className="mt-0.5">
                          <Badge status={app.electionStatus} />
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(app.appliedAt)}
                      </td>
                      <td className="py-3.5 text-right">
                        {app.status === 'PENDING' ? (
                          <div className="inline-flex items-center gap-2">
                            <Button
                              size="sm"
                              icon={Check}
                              onClick={() => setDecision({ type: 'approve', app })}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={X}
                              onClick={() => setDecision({ type: 'reject', app })}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Pagination page={page} totalPages={data?.totalPages || 0} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={handleDecision}
        title={decision?.type === 'approve' ? 'Approve candidate' : 'Reject application'}
        message={
          decision
            ? decision.type === 'approve'
              ? `Approve ${decision.app.candidateName} (${decision.app.partyName || 'Independent'}) to appear on the ballot for "${decision.app.electionTitle}"?`
              : `Reject ${decision.app.candidateName}'s application for "${decision.app.electionTitle}"?`
            : ''
        }
        confirmText={decision?.type === 'approve' ? 'Yes, approve' : 'Yes, reject'}
        variant={decision?.type === 'approve' ? 'primary' : 'danger'}
        loading={submitting}
      />
    </div>
  )
}

export default AdminApplications