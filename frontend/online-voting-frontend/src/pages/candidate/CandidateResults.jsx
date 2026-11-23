import { useCallback, useState } from 'react'
import { Award, BarChart3, RefreshCw } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import electionService from '../../services/electionService'
import resultService from '../../services/resultService'
import { ELECTION_STATUS } from '../../utils/constants'

const CandidateResults = () => {
  const [selectedId, setSelectedId] = useState('')

  const electionsFetcher = useCallback(async () => {
    const res = await electionService.getAll({ page: 0, size: 50 })
    return (res?.data?.content || res?.content || []).filter(
      (e) => e.status === ELECTION_STATUS.RESULTS_PUBLISHED,
    )
  }, [])

  const {
    data: electionsData,
    loading: loadingElections,
    error: electionsError,
  } = useFetch(electionsFetcher)

  const elections = electionsData || []
  const activeId = selectedId || (elections.length > 0 ? String(elections[0].id) : '')

  const resultFetcher = useCallback(async () => {
    if (!activeId) return null
    const res = await resultService.getElectionResults(activeId)
    return res?.data || res
  }, [activeId])

  const {
    data: result,
    loading: loadingResult,
    error: resultError,
    refetch: refetchResult,
  } = useFetch(resultFetcher)

  const error = electionsError || resultError
  const winners = (result?.candidates || []).filter((c) => c.winner)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Published Election Results
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View official vote counts, percentages, and winners for published elections.
          </p>
        </div>

        <button
          type="button"
          onClick={refetchResult}
          disabled={!activeId || loadingResult}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Published Election Selector */}
      <div className="glass rounded-2xl p-5">
        <label
          htmlFor="candidate-election-select"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Select Published Election
        </label>

        {loadingElections ? (
          <p className="mt-2 text-sm text-slate-500">Loading published elections...</p>
        ) : elections.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No election results have been published yet.
          </p>
        ) : (
          <select
            id="candidate-election-select"
            value={activeId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="mt-2 w-full max-w-lg rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingResult && (
        <div className="glass rounded-2xl p-8 text-center text-sm text-slate-500">
          Loading election standings...
        </div>
      )}

      {!loadingResult && result && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Votes Cast
              </p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                {result.totalVotes}
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Candidates
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {result.candidates?.length || 0}
              </p>
            </div>

            <div className="glass rounded-2xl border-emerald-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                {winners.length > 1 ? 'Co-Winners (Tie)' : 'Official Winner'}
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                <Award className="h-5 w-5 shrink-0" />
                {winners.length > 0
                  ? winners.map((w) => w.candidateName).join(', ')
                  : 'No votes cast'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(result.candidates || []).map((c, idx) => (
              <div
                key={c.electionCandidateId}
                className={`glass rounded-2xl p-5 ${
                  c.winner ? 'ring-2 ring-emerald-500/70' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {c.candidateName}
                        </h3>
                        {c.winner && (
                          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                            Winner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{c.partyName || 'Independent'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {c.voteCount} votes
                    </p>
                    <p className="text-xs font-medium text-slate-500">{c.votePercentage}%</p>
                  </div>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.winner ? 'bg-emerald-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(c.votePercentage || 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CandidateResults