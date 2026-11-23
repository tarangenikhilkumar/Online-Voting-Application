import { Check, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { PASSWORD_RULES, getPasswordStrength } from '../../utils/validators'

const barColors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500']
const textColors = [
  'text-rose-500',
  'text-amber-500',
  'text-sky-500',
  'text-emerald-500',
]

function PasswordStrength({ password }) {
  if (!password) return null

  const { level, label } = getPasswordStrength(password)

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                index < level ? barColors[level - 1] : 'bg-slate-200 dark:bg-slate-700',
              )}
            />
          ))}
        </div>
        <span className={cn('w-12 text-right text-xs font-semibold', textColors[level - 1])}>
          {label}
        </span>
      </div>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password)
          return (
            <li
              key={rule.id}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                passed
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500',
              )}
            >
              {passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {rule.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordStrength