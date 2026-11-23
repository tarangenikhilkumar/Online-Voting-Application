import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  Ban,
  CheckCircle2,
  RefreshCw,
  Search,
  ServerCrash,
  UserCheck,
} from 'lucide-react'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { getImageUrl } from '../../utils/imageUrl'

const PAGE_SIZE = 10

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function AdminCandidates() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [targetUser, setTargetUser] = useState(null)
  const [toggling, setToggling] = useState(false)

  const fetcher = useCallback(
    () => adminService.getCandidates({ search: searchQuery || undefined, page, size: PAGE_SIZE }),
    [searchQuery, page],
  )

  const { data, loading, error, refetch } = useFetch(fetcher)
  const candidates = data?.content || []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    setPage(0)
  }

  const handleToggleBlock = async () => {
    if (!targetUser) return
    setToggling(true)
    try {
      await adminService.toggleUserBlock(targetUser.userId || targetUser.id)
      toast.success(
        targetUser.blocked ? `${targetUser.fullName} unblocked` : `${targetUser.fullName} blocked`,
      )
      setTargetUser(null)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setTargetUser(null)
    } finally {
      setToggling(false)
    }
  }

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load candidates"
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Candidates</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View registered candidates, party affiliations, and account status.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search candidate or party..."
              className="w-full rounded-xl border border-slate-300 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      <section className="glass rounded-3xl p-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No candidates found"
            description="Try adjusting your search query."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Party</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((cand) => {
                  const avatar = getImageUrl(cand.profileImageUrl)
                  return (
                    <tr
                      key={cand.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={cand.fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              {getInitials(cand.fullName)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {cand.fullName}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {cand.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
                        {cand.partyName || 'Independent'}
                      </td>
                      <td className="py-3.5 pr-4">
                        {cand.blocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <Ban className="h-3.5 w-3.5" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <Button
                          size="sm"
                          variant={cand.blocked ? 'primary' : 'danger'}
                          onClick={() => setTargetUser(cand)}
                        >
                          {cand.blocked ? 'Unblock' : 'Block'}
                        </Button>
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
        isOpen={Boolean(targetUser)}
        onClose={() => setTargetUser(null)}
        onConfirm={handleToggleBlock}
        title={targetUser?.blocked ? 'Unblock candidate' : 'Block candidate'}
        message={
          targetUser
            ? targetUser.blocked
              ? `Restore account access for ${targetUser.fullName}?`
              : `Block ${targetUser.fullName}? They will not be able to log in or manage applications until unblocked.`
            : ''
        }
        confirmText={targetUser?.blocked ? 'Unblock' : 'Block'}
        variant={targetUser?.blocked ? 'primary' : 'danger'}
        loading={toggling}
      />
    </div>
  )
}

export default AdminCandidates