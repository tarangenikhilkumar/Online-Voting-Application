import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import resultService from '../../services/resultService'

const ResultsPage = () => {
  const { electionId, id } = useParams()
  const resolvedId = electionId || id

  const fetcher = useCallback(async () => {
    if (!resolvedId) return { data: null }
    const res = await resultService.getElectionResults(resolvedId)
    return { data: res?.data ?? res ?? null }
  }, [resolvedId])

  const { data, loading, error } = useFetch(fetcher)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading election results...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-semibold">Unable to Load Results</p>
          <p className="mt-1 text-sm">{error}</p>
          <Link
            to="/voter/elections"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to Elections
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">Results Not Available Yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Official results for this election have not been published yet.
          </p>
          <Link
            to="/voter/results"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            View Published Elections
          </Link>
        </div>
      </div>
    )
  }

  const winners = (data.candidates || []).filter((c) => c.winner)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {data.status}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {data.electionTitle}
          </h1>
          {data.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{data.description}</p>
          )}
        </div>
        <Link
          to="/voter/elections"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Back to Elections
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Total Votes Cast
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {data.totalVotes}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Candidates</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {data.candidates?.length || 0}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {winners.length > 1 ? 'Co-Winners (Tie)' : 'Winner'}
          </p>
          <p className="mt-2 text-lg font-bold text-emerald-950 dark:text-emerald-200">
            {winners.length > 0 ? winners.map((w) => w.candidateName).join(', ') : 'No votes recorded'}
          </p>
        </div>
      </div>

      {/* Candidate Breakdown */}
      <div className="space-y-4">
        {(data.candidates || []).map((candidate, index) => (
          <div
            key={candidate.electionCandidateId}
            className={`rounded-xl border p-5 shadow-sm transition ${
              candidate.winner
                ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {candidate.candidateName}
                    </h3>
                    {candidate.winner && (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Winner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{candidate.partyName || 'Independent'}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {candidate.voteCount} votes
                </p>
                <p className="text-xs font-medium text-slate-500">{candidate.votePercentage}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  candidate.winner ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(candidate.votePercentage || 0, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsPage