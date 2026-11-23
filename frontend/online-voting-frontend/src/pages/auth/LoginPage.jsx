import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Lock, LogIn, Mail } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { validateLogin } from '../../utils/validators'

function LoginPage() {
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateLogin(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
      })
      toast.success(`Welcome back, ${user.fullName}!`)
    } catch (error) {
      toast.error(getErrorMessage(error))
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Sign in to continue to your voting dashboard.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <Input
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div>
          <Input
            label="Password"
            icon={Lock}
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth icon={LogIn} loading={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default LoginPage