import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Lock, Mail, Megaphone, User, UserPlus, Vote } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import PasswordStrength from '../../components/common/PasswordStrength'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'
import { cn } from '../../utils/cn'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { validateRegister } from '../../utils/validators'

const roleOptions = [
  {
    value: ROLES.VOTER,
    icon: Vote,
    title: 'Voter',
    text: 'Vote in elections',
  },
  {
    value: ROLES.CANDIDATE,
    icon: Megaphone,
    title: 'Candidate',
    text: 'Contest in elections',
  },
]

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.VOTER,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateRegister(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      })
      toast.success('Account created! Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Join SecureVote and take part in transparent elections.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            I want to join as
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map(({ value, icon: Icon, title, text }) => {
              const selected = form.role === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setForm((prev) => ({ ...prev, role: value }))}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all duration-200',
                    selected
                      ? 'border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/15'
                      : 'border-slate-300 hover:border-brand-400 dark:border-slate-700',
                  )}
                >
                  <Icon
                    className={cn(
                      'mb-2 h-5 w-5',
                      selected ? 'text-brand-500' : 'text-slate-400',
                    )}
                  />
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{text}</p>
                </button>
              )
            })}
          </div>
        </div>

        <Input
          label="Full name"
          icon={User}
          name="fullName"
          placeholder="Rahul Sharma"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
        </div>

        <Input
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" size="lg" fullWidth icon={UserPlus} loading={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage