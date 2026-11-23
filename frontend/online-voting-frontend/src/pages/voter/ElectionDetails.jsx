import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  RefreshCw,
  ServerCrash,
  ShieldCheck,
  Users,
  Vote,
} from 'lucide-react'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import CandidateCard from '../../components/cards/CandidateCard'
import { useFetch } from '../../hooks/useFetch'
import electionService from '../../services/electionService'
import voterService from '../../services/voterService'
import { ELECTION_STATUS } from '../../utils/constants'
import { formatDateTime, getTimeLeft } from '../../utils/formatDate'
import { getErrorMessage } from '../../utils/getErrorMessage'

function ElectionDetails() {
  const { id } = useParams()

  const electionFetcher = useCallback(() => electionService.getById(id), [id])
  const candidatesFetcher = useCallback(() => electionService.getCandidates(id), [id])

  const {
    data: election,
    loading: electionLoading,
    error: electionError,
    refetch: refetchElection,
  } = useFetch(electionFetcher)
  const {
    data: candidates,
    loading: candidatesLoading,
    error: candidatesError,
    refetch: refetchCandidates,
  } = useFetch(candidatesFetcher)

  const [selectedId, setSelectedId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (electionError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load election"
        description={electionError}
        action={
          <Button icon={RefreshCw} onClick={refetchElection}>
            Try again
          </Button>
        }
      />
    )
  }

  const canVote = election?.status === ELECTION_STATUS.ACTIVE && !election?.hasVoted
  const candidateList = candidates || []
  const selectedCandidate = candidateList.find((c) => c.electionCandidateId === selectedId)

  const handleVote = async () => {
    setSubmitting(true)
    try {
      await voterService.castVote(election.id, selectedId)
      toast.success('Your vote has been recorded!')
      setConfirmOpen(false)
      setSelectedId(null)
      refetchElection()
    } catch (error) {
      toast.error(getErrorMessage(error))
      setConfirmOpen(false)
      refetchElection()
    } finally {
      setSubmitting(false)
    }
  }

  const timeLeft =
    election?.status === ELECTION_STATUS.ACTIVE ? getTimeLeft(election.endDate) : null

  return (
    <div className="space-y-6">
      <Link
        to="/voter/elections"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to elections
      </Link>

      <section className="glass rounded-3xl p-6">
        {electionLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status={election.status} />
              {election.hasVoted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Voted
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              {election.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {election.description || 'No description provided.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDateTime(election.startDate)} to {formatDateTime(election.endDate)}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {election.totalCandidates} candidates
              </span>
              {timeLeft && (
                <span className="flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400">
                  <Clock className="h-4 w-4" />
                  Ends in {timeLeft.replace(' left', '')}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </section>

      {!electionLoading && election.hasVoted && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Your vote has been recorded. It is anonymous: nobody, including administrators, can
            see whom you voted for.
          </p>
        </div>
      )}

      {!electionLoading && !election.hasVoted && election.status !== ELECTION_STATUS.ACTIVE && (
        <div className="flex items-start gap-3 rounded-2xl bg-sky-500/10 p-4 text-sm text-sky-700 dark:text-sky-300">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            {election.status === ELECTION_STATUS.UPCOMING &&
              'Voting has not started yet. You can review the candidates below.'}
            {election.status === ELECTION_STATUS.COMPLETED &&
              'Voting has ended. Results will appear once they are published.'}
            {election.status === ELECTION_STATUS.RESULTS_PUBLISHED &&
              'Voting has ended and results are published.'}
          </p>
        </div>
      )}

      <section>
        <h3 className="mb-4 text-lg font-bold">
          {canVote ? 'Select your candidate' : 'Candidates'}
        </h3>

        {candidatesError ? (
          <EmptyState
            icon={ServerCrash}
            title="Could not load candidates"
            description={candidatesError}
            className="py-10"
            action={
              <Button icon={RefreshCw} onClick={refetchCandidates}>
                Try again
              </Button>
            }
          />
        ) : candidatesLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : candidateList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No approved candidates yet"
            description="Approved candidates will appear here."
            className="py-10"
          />
        ) : (
          <div
            role={canVote ? 'radiogroup' : undefined}
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {candidateList.map((candidate, index) => (
              <CandidateCard
                key={candidate.electionCandidateId}
                candidate={candidate}
                index={index}
                selectable={canVote}
                selected={selectedId === candidate.electionCandidateId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}
      </section>

      {canVote && candidateList.length > 0 && (
        <div className="sticky bottom-4 z-20 flex justify-center">
          <Button
            size="lg"
            icon={Vote}
            disabled={!selectedId}
            onClick={() => setConfirmOpen(true)}
          >
            {selectedId ? 'Cast my vote' : 'Select a candidate to vote'}
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleVote}
        title="Confirm your vote"
        message={
          selectedCandidate
            ? `You are voting for ${selectedCandidate.name} (${selectedCandidate.partyName || 'Independent'}). Your vote is final and cannot be changed.`
            : 'Your vote is final and cannot be changed.'
        }
        confirmText="Yes, cast vote"
        variant="primary"
        loading={submitting}
      />
    </div>
  )
}

export default ElectionDetails