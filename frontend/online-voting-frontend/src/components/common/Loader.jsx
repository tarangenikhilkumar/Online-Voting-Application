import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

function Loader({ fullScreen = false, text = 'Loading...', className }) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
      {text && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm dark:bg-slate-950/80">
        {content}
      </div>
    )
  }

  return content
}

export default Loader