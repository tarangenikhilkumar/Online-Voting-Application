import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const isDanger = variant === 'danger'
  const Icon = isDanger ? AlertTriangle : CheckCircle2

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={
            isDanger
              ? 'mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500'
              : 'mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-500'
          }
        >
          <Icon className="h-7 w-7" />
        </div>

        {message && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
        )}

        <div className="mt-6 flex w-full gap-3">
          <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog