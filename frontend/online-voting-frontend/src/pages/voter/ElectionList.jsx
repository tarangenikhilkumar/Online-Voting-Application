import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, SearchX, ServerCrash } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { SkeletonCard } from '../../components/common/Skeleton'
import ElectionCard from '../../components/cards/ElectionCard'
import { useFetch } from '../../hooks/useFetch'
import electionService from '../../services/electionService'
import { cn } from '../../utils/cn'
import { ELECTION_STATUS } from '../../utils/constants'

const PAGE_SIZE = 6

const tabs = [
  { label: 'All', value: '' },
  { label: 'Active', value: ELECTION_STATUS.ACTIVE },
  { label: 'Upcoming', value: ELECTION_STATUS.UPCOMING },
  { label: 'Completed', value: ELECTION_STATUS.COMPLETED },
  { label: 'Results', value: ELECTION_STATUS.RESULTS_PUBLISHED },
]

function ElectionList() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)

  const fetcher = useCallback(
    () => electionService.getAll({ status, page, size: PAGE_SIZE }),
    [status, page],
  )
  const { data, loading, error, refetch } = useFetch(fetcher)

  const handleTabChange = (value) => {
    setStatus(value)
    setPage(0)
  }

  const elections = data?.content || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Elections</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse elections and cast your vote.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active = status === tab.value
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className="relative shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="election-tab"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="gradient-bg absolute inset-0 rounded-xl shadow-glow"
                />
              )}
              <span
                className={cn(
                  'relative z-10',
                  active ? 'text-white' : 'text-slate-600 dark:text-slate-300',
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {error ? (
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
      ) : loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No elections found"
          description={
            status
              ? 'Is category me abhi koi election nahi hai. Dusra tab try karo.'
              : 'Abhi koi election available nahi hai.'
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {elections.map((election, index) => (
              <ElectionCard key={election.id} election={election} index={index} />
            ))}
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

export default ElectionList