import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  Ban,
  CheckCircle2,
  RefreshCw,
  Search,
  ServerCrash,
  Users,
} from 'lucide-react'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'
import { formatDate } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'

const PAGE_SIZE = 10

function AdminVoters() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [targetUser, setTargetUser] = useState(null)
  const [toggling, setToggling] = useState(false)

  const fetcher = useCallback(
    () => adminService.getVoters({ search: searchQuery || undefined, page, size: PAGE_SIZE }),
    [searchQuery, page],
  )

  const { data, loading, error, refetch } = useFetch(fetcher)
  const voters = data?.content || []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    setPage(0)
  }

  const handleToggleBlock = async () => {
    if (!targetUser) return
    setToggling(true)
    try {
      await adminService.toggleUserBlock(targetUser.id)
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
        title="Could not load voters"
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Voters</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage registered voters and account access status.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email..."
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
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : voters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No voters found"
            description="Try adjusting your search query."
            className="py-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Joined</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr
                    key={voter.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      {voter.fullName}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                      {voter.email}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(voter.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4">
                      {voter.blocked ? (
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
                        variant={voter.blocked ? 'primary' : 'danger'}
                        onClick={() => setTargetUser(voter)}
                      >
                        {voter.blocked ? 'Unblock' : 'Block'}
                      </Button>
                    </td>
                  </tr>
                ))}
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
        title={targetUser?.blocked ? 'Unblock voter' : 'Block voter'}
        message={
          targetUser
            ? targetUser.blocked
              ? `Restore login and voting access for ${targetUser.fullName}?`
              : `Block ${targetUser.fullName}? They will not be able to log in or vote until unblocked.`
            : ''
        }
        confirmText={targetUser?.blocked ? 'Unblock' : 'Block'}
        variant={targetUser?.blocked ? 'primary' : 'danger'}
        loading={toggling}
      />
    </div>
  )
}

export default AdminVoters