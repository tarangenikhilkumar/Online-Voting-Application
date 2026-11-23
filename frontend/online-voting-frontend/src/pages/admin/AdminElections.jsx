import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  Award,
  CalendarDays,
  Edit2,
  Lock,
  Plus,
  RefreshCw,
  ServerCrash,
  Trash2,
  Vote,
  X,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Input from '../../components/common/Input'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { ELECTION_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'

const PAGE_SIZE = 10

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: ELECTION_STATUS.UPCOMING },
  { label: 'Active', value: ELECTION_STATUS.ACTIVE },
  { label: 'Completed', value: ELECTION_STATUS.COMPLETED },
  { label: 'Published', value: ELECTION_STATUS.RESULTS_PUBLISHED },
]

const toLocalInputValue = (isoString) => {
  if (!isoString) return ''
  return isoString.slice(0, 16)
}

function ElectionFormModal({ isOpen, editingElection, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: editingElection?.title || '',
    description: editingElection?.description || '',
    startDate: toLocalInputValue(editingElection?.startDate),
    endDate: toLocalInputValue(editingElection?.endDate),
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = {}
    if (!form.title.trim()) validation.title = 'Title is required'
    if (!form.startDate) validation.startDate = 'Start date & time is required'
    if (!form.endDate) validation.endDate = 'End date & time is required'
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      validation.endDate = 'End date must be after start date'
    }
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: form.startDate.length === 16 ? `${form.startDate}:00` : form.startDate,
      endDate: form.endDate.length === 16 ? `${form.endDate}:00` : form.endDate,
    }

    setSaving(true)
    try {
      if (editingElection) {
        await adminService.updateElection(editingElection.id, payload)
        toast.success('Election updated')
      } else {
        await adminService.createElection(payload)
        toast.success('Election created')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {editingElection ? 'Edit election' : 'Create new election'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Election title"
            name="title"
            placeholder="e.g. Student Council President 2026"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />

          <div>
            <label
              htmlFor="election-desc"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="election-desc"
              name="description"
              rows={3}
              maxLength={1000}
              placeholder="Brief overview of the election and eligibility"
              value={form.description}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white/80 p-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start date & time"
              type="datetime-local"
              icon={CalendarDays}
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
            <Input
              label="End date & time"
              type="datetime-local"
              icon={CalendarDays}
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingElection ? 'Save changes' : 'Create election'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminElections() {
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingElection, setEditingElection] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null) // { type: 'delete'|'close'|'publish', election }
  const [actionLoading, setActionLoading] = useState(false)

  const fetcher = useCallback(
    () => adminService.getElections({ status: statusFilter || undefined, page, size: PAGE_SIZE }),
    [statusFilter, page],
  )

  const { data, loading, error, refetch } = useFetch(fetcher)
  const elections = data?.content || []

  const openCreateModal = () => {
    setEditingElection(null)
    setModalOpen(true)
  }

  const openEditModal = (election) => {
    setEditingElection(election)
    setModalOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return
    const { type, election } = confirmAction
    setActionLoading(true)
    try {
      if (type === 'delete') {
        await adminService.deleteElection(election.id)
        toast.success('Election deleted')
      } else if (type === 'close') {
        await adminService.closeElection(election.id)
        toast.success('Election closed')
      } else if (type === 'publish') {
        await adminService.publishResults(election.id)
        toast.success('Election results published')
      }
      setConfirmAction(null)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setConfirmAction(null)
    } finally {
      setActionLoading(false)
    }
  }

  const dialogConfig = {
    delete: {
      title: 'Delete election',
      message: `Delete "${confirmAction?.election?.title}"? This cannot be undone.`,
      confirmText: 'Yes, delete',
      variant: 'danger',
    },
    close: {
      title: 'Close voting early',
      message: `Close "${confirmAction?.election?.title}" now? Voters will no longer be able to cast votes.`,
      confirmText: 'Close election',
      variant: 'danger',
    },
    publish: {
      title: 'Publish election results',
      message: `Publish official results for "${confirmAction?.election?.title}"? Results will become visible to all voters and candidates.`,
      confirmText: 'Publish results',
      variant: 'primary',
    },
  }[confirmAction?.type]

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load elections"
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
            Manage elections
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create schedules, monitor active polls, and publish final results.
          </p>
        </div>

        <Button icon={Plus} onClick={openCreateModal}>
          Create election
        </Button>
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
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : elections.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections found"
            description="Create your first election or switch the status filter."
            className="py-10"
            action={
              <Button icon={Plus} onClick={openCreateModal}>
                Create election
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Schedule</th>
                  <th className="pb-3 font-semibold">Candidates</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map((election) => (
                  <tr
                    key={election.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      {election.title}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge status={election.status} />
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                      <div>{formatDateTime(election.startDate)}</div>
                      <div>to {formatDateTime(election.endDate)}</div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                      {election.totalCandidates ?? 0}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {election.status === ELECTION_STATUS.UPCOMING && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={Edit2}
                              onClick={() => openEditModal(election)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => setConfirmAction({ type: 'delete', election })}
                            >
                              Delete
                            </Button>
                          </>
                        )}

                        {election.status === ELECTION_STATUS.ACTIVE && (
                          <Button
                            size="sm"
                            variant="danger"
                            icon={Lock}
                            onClick={() => setConfirmAction({ type: 'close', election })}
                          >
                            Close
                          </Button>
                        )}

                        {election.status === ELECTION_STATUS.COMPLETED && (
                          <Button
                            size="sm"
                            icon={Award}
                            onClick={() => setConfirmAction({ type: 'publish', election })}
                          >
                            Publish results
                          </Button>
                        )}

                        {election.status === ELECTION_STATUS.RESULTS_PUBLISHED && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Published
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Pagination page={page} totalPages={data?.totalPages || 0} onPageChange={setPage} />

      <ElectionFormModal
        key={editingElection?.id || 'new'}
        isOpen={modalOpen}
        editingElection={editingElection}
        onClose={() => setModalOpen(false)}
        onSaved={refetch}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={dialogConfig?.title || ''}
        message={dialogConfig?.message || ''}
        confirmText={dialogConfig?.confirmText || 'Confirm'}
        variant={dialogConfig?.variant || 'primary'}
        loading={actionLoading}
      />
    </div>
  )
}

export default AdminElections