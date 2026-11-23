import { useCallback, useState } from 'react'
import { RefreshCw, Search, ShieldAlert } from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import { useFetch } from '../../hooks/useFetch'
import adminService from '../../services/adminService'

const PAGE_SIZE = 15

const getActionBadgeStyle = (action = '') => {
  if (action.includes('VOTE')) {
    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
  }
  if (action.includes('PUBLISH') || action.includes('APPROVE') || action.includes('UNBLOCK')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  }
  if (action.includes('BLOCK') || action.includes('REJECT') || action.includes('DELETE')) {
    return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
  }
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

const AdminAuditLogs = () => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const fetcher = useCallback(async () => {
    const res = await adminService.getAuditLogs({ search, page, size: PAGE_SIZE })
    return res?.data || res
  }, [search, page])

  const { data, loading, error, refetch } = useFetch(fetcher)

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(0)
  }

  const handleClear = () => {
    setSearchInput('')
    setSearch('')
    setPage(0)
  }

  const logs = data?.content || []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            System Audit Logs
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track votes cast, election updates, approvals, and administrative actions.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by action (e.g. VOTE_CAST) or details..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:brightness-110"
        >
          Search
        </button>

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-slate-500">
          Loading audit logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-10 text-center">
          <ShieldAlert className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            No audit logs found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {search
              ? 'No events matched your search filter.'
              : 'System activity logs will appear here once actions occur.'}
          </p>
        </div>
      ) : (
        <>
          <div className="glass overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Action</th>
                    <th className="px-5 py-3.5">User ID</th>
                    <th className="px-5 py-3.5">Details</th>
                    <th className="px-5 py-3.5">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionBadgeStyle(
                            log.action,
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {log.userId ?? 'System'}
                      </td>
                      <td className="max-w-md px-5 py-3.5 text-slate-700 dark:text-slate-200">
                        {log.details || '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">
                        {log.ipAddress || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={data?.totalPages || 0}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

export default AdminAuditLogs