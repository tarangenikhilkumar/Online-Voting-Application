import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  RefreshCw,
  Send,
  ServerCrash,
  Users,
  Vote,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import candidateService from '../../services/candidateService'
import electionService from '../../services/electionService'
import { ELECTION_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'

const PAGE_SIZE = 6

function ApplyForElection() {
  const [page, setPage] = useState(0)
  const [selectedElection, setSelectedElection] = useState(null)
  const [applying, setApplying] = useState(false)

  const electionsFetcher = useCallback(
    () => electionService.getAll({ status: ELECTION_STATUS.UPCOMING, page, size: PAGE_SIZE }),
    [page],
  )

  const {
    data: electionsPage,
    loading: electionsLoading,
    error: electionsError,
    refetch: refetchElections,
  } = useFetch(electionsFetcher)

  const {
    data: applications,
    loading: appsLoading,
    refetch: refetchApplications,
  } = useFetch(candidateService.getApplications)

  const {
    data: profile,
    loading: profileLoading,
  } = useFetch(candidateService.getProfile)

  const elections = electionsPage?.content || []
  const appList = applications || []
  const isProfileComplete = Boolean(profile?.partyName?.trim() && profile?.description?.trim())

  const getApplicationForElection = (electionId) =>
    appList.find((app) => app.electionId === electionId && app.status !== 'WITHDRAWN')

  const handleApply = async () => {
    if (!selectedElection) return
    setApplying(true)
    try {
      await candidateService.apply(selectedElection.id)
      toast.success(`Application submitted for ${selectedElection.title}`)
      setSelectedElection(null)
      refetchApplications()
      refetchElections()
    } catch (error) {
      toast.error(getErrorMessage(error))
      setSelectedElection(null)
    } finally {
      setApplying(false)
    }
  }

  if (electionsError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load upcoming elections"
        description={electionsError}
        action={
          <Button icon={RefreshCw} onClick={refetchElections}>
            Try again
          </Button>
        }
      />
    )
  }

  const isLoading = electionsLoading || appsLoading || profileLoading

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Apply for election
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Submit your candidacy for upcoming elections before voting starts.
        </p>
      </div>

      {!profileLoading && profile && !isProfileComplete && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Add your party name and description in your profile before applying.
          </span>
          <Link to="/candidate/profile">
            <Button size="sm">Complete profile</Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <EmptyState
          icon={Vote}
          title="No upcoming elections"
          description="Check back later when administrators schedule new elections."
          className="py-12"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {elections.map((election, index) => {
            const existingApp = getApplicationForElection(election.id)

            return (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="glass flex flex-col justify-between rounded-3xl p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge status={election.status} />
                    {existingApp && <Badge status={existingApp.status} />}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {election.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                    {election.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      Starts: {formatDateTime(election.startDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0" />
                      {election.totalCandidates ?? 0} approved candidates
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                  {existingApp ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Applied ({existingApp.status})
                      </span>
                      <Link
                        to="/candidate/applications"
                        className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
                      >
                        Manage
                      </Link>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      icon={Send}
                      disabled={!isProfileComplete}
                      onClick={() => setSelectedElection(election)}
                    >
                      Apply now
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={electionsPage?.totalPages || 0}
        onPageChange={setPage}
      />

      <ConfirmDialog
        isOpen={Boolean(selectedElection)}
        onClose={() => setSelectedElection(null)}
        onConfirm={handleApply}
        title="Submit candidacy application"
        message={
          selectedElection
            ? `Apply to contest in "${selectedElection.title}"? Your current profile name, party, photo, and description will be reviewed by an administrator.`
            : ''
        }
        confirmText="Submit application"
        variant="primary"
        loading={applying}
      />
    </div>
  )
}

export default ApplyForElection