import { useCallback, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import voterService from '../../services/voterService'

const VoterProfilePage = () => {
  const [fullNameInput, setFullNameInput] = useState(null)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState('')

  const fetcher = useCallback(async () => {
    const res = await voterService.getProfile()
    return res?.data || res
  }, [])

  const { data: profile, loading, error: loadError, refetch } = useFetch(fetcher)

  const displayedName = fullNameInput !== null ? fullNameInput : (profile?.fullName || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!displayedName.trim() || displayedName.trim().length < 2) {
      setSubmitError('Full name must be at least 2 characters.')
      return
    }

    try {
      setSaving(true)
      setSubmitError('')
      setSuccess('')
      await voterService.updateProfile({ fullName: displayedName.trim() })
      await refetch()
      setFullNameInput(null)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading profile...
        </div>
      </div>
    )
  }

  const error = submitError || loadError

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Voter Profile</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          View your account summary and update your display name.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {profile && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3 dark:bg-slate-800/60">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Role</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {profile.role}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Elections Voted
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {profile.totalVotesCast}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Member Since
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="mt-1 block w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={displayedName}
                onChange={(e) => setFullNameInput(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default VoterProfilePage