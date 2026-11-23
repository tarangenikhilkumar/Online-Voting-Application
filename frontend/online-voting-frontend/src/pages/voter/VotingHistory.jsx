import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { History, Lock, RefreshCw, ServerCrash } from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import voterService from '../../services/voterService'
import { formatDateTime } from '../../utils/formatDate'

const PAGE_SIZE = 10

function VotingHistory() {
  const [page, setPage] = useState(0)

  const fetcher = useCallback(() => voterService.getHistory({ page, size: PAGE_SIZE }), [page])
  const { data, loading, error, refetch } = useFetch(fetcher)

  const history = data?.content || []

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load voting history"
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
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Voting history</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Lock className="h-4 w-4" />
          Only the elections you voted in are shown. Your choices are never stored with your name.
        </p>
      </div>

      <section className="glass rounded-3xl p-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={History}
            title="You have not voted yet"
            description="Elections you vote in will appear here."
            className="py-10"
            action={
              <Link to="/voter/elections">
                <Button>Browse elections</Button>
              </Link>
            }
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Election</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Voted on</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.electionId}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        to={`/voter/elections/${item.electionId}`}
                        className="font-semibold hover:text-brand-600 hover:underline dark:hover:text-brand-400"
                      >
                        {item.electionTitle}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge status={item.electionStatus} />
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {formatDateTime(item.votedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </section>

      <Pagination page={page} totalPages={data?.totalPages || 0} onPageChange={setPage} />
    </div>
  )
}

export default VotingHistory