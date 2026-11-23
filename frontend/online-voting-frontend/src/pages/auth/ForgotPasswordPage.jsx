import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft, MailCheck, Mail, Send } from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import authService from '../../services/authService'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { validateForgotPassword } from '../../utils/validators'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForgotPassword({ email })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        to="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <MailCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              If an account exists for <span className="font-semibold">{email.trim()}</span>,
              we have sent a password reset link to it.
            </p>
            <Button
              variant="outline"
              fullWidth
              className="mt-6"
              onClick={() => setSent(false)}
            >
              Use a different email
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your email and we will send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <Input
                label="Email address"
                icon={Mail}
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors({})
                }}
                error={errors.email}
              />

              <Button type="submit" size="lg" fullWidth icon={Send} loading={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ForgotPasswordPage