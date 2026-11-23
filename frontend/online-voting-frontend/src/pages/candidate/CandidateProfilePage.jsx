import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Camera, FileText, Flag, RefreshCw, Save, ServerCrash } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Input from '../../components/common/Input'
import { Skeleton } from '../../components/common/Skeleton'
import { useFetch } from '../../hooks/useFetch'
import candidateService from '../../services/candidateService'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { getImageUrl } from '../../utils/imageUrl'

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function ProfileForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    partyName: profile.partyName || '',
    description: profile.description || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const validation = {}
    if (!form.partyName.trim()) validation.partyName = 'Party name is required'
    if (!form.description.trim()) validation.description = 'Description is required'
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setSaving(true)
    try {
      await candidateService.updateProfile({
        partyName: form.partyName.trim(),
        description: form.description.trim(),
      })
      toast.success('Profile updated')
      onSaved()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} noValidate className="space-y-5">
      <Input
        label="Party name"
        icon={Flag}
        name="partyName"
        placeholder="e.g. Student Unity"
        value={form.partyName}
        onChange={handleChange}
        error={errors.partyName}
      />

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Description
        </label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={2000}
            placeholder="Tell voters about yourself and your plans"
            value={form.description}
            onChange={handleChange}
            className={`w-full resize-none rounded-xl border bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              errors.description
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs">
          <span className="font-medium text-rose-500">{errors.description}</span>
          <span className="text-slate-400">{form.description.length}/2000</span>
        </div>
      </div>

      <Button type="submit" icon={Save} loading={saving}>
        {saving ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}

function CandidateProfilePage() {
  const { data, loading, error, refetch } = useFetch(candidateService.getProfile)

  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED.includes(file.type)) {
      toast.error('Only JPG, PNG or WEBP images are allowed')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be smaller than 2MB')
      return
    }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await candidateService.uploadImage(file)
      toast.success('Profile image updated')
      setImageFailed(false)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  if (error) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="Could not load profile"
        description={error}
        action={
          <Button icon={RefreshCw} onClick={refetch}>
            Try again
          </Button>
        }
      />
    )
  }

  const serverImage = getImageUrl(data?.profileImageUrl)
  const shownImage = preview || (!imageFailed ? serverImage : null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My profile</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Voters will see this information on the ballot.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass flex flex-col items-center rounded-3xl p-6 text-center">
          {loading || !data ? (
            <>
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="mt-4 h-5 w-32" />
              <Skeleton className="mt-2 h-4 w-40" />
            </>
          ) : (
            <>
              <div className="relative">
                {shownImage ? (
                  <img
                    src={shownImage}
                    alt={data.fullName}
                    onError={() => setImageFailed(true)}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-white/60 dark:ring-slate-800"
                  />
                ) : (
                  <div className="gradient-bg flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold text-white">
                    {getInitials(data.fullName)}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  aria-label="Change profile image"
                  className="gradient-bg absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-glow transition-transform hover:scale-110 disabled:opacity-60"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <h3 className="mt-4 text-lg font-bold">{data.fullName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{data.email}</p>
              <p className="mt-3 text-xs text-slate-400">
                {uploading ? 'Uploading...' : 'JPG, PNG or WEBP, up to 2MB'}
              </p>
            </>
          )}
        </section>

        <section className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-bold">Candidate details</h3>

          {loading || !data ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-11 w-32" />
            </div>
          ) : (
            <ProfileForm profile={data} onSaved={refetch} />
          )}
        </section>
      </div>
    </div>
  )
}

export default CandidateProfilePage