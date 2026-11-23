import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input(
  { label, icon: Icon, error, type = 'text', className, id, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const inputId = id || props.name

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'w-full rounded-xl border bg-white/80 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400',
            'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
            'dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500',
            Icon ? 'pl-11' : 'pl-4',
            isPassword ? 'pr-11' : 'pr-4',
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15'
              : 'border-slate-300 dark:border-slate-700',
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  )
})

export default Input