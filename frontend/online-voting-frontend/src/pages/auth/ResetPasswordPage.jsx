import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { KeyRound, Link2Off, Lock } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import PasswordStrength from '../../components/common/PasswordStrength'
import authService from '../../services/authService'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { validateResetPassword } from '../../utils/validators'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateResetPassword(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await authService.resetPassword({
        token,
        newPassword: form.newPassword,
      })
      toast.success('Password updated! Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <Link2Off className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Invalid reset link
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This link is missing its token or is incorrect. Please request a new one.
        </p>
        <Link to="/forgot-password" className="mt-6 block">
          <Button fullWidth>Request a new link</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Set a new password
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Choose a strong password that you have not used before.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <Input
            label="New password"
            icon={Lock}
            type="password"
            name="newPassword"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <PasswordStrength password={form.newPassword} />
        </div>

        <Input
          label="Confirm new password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" size="lg" fullWidth icon={KeyRound} loading={loading}>
          {loading ? 'Updating...' : 'Reset password'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

export default ResetPasswordPage