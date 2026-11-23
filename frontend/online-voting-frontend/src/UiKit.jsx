import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Vote, Mail, Lock, CalendarX, Plus } from 'lucide-react'
import ThemeToggle from './components/common/ThemeToggle'
import Button from './components/common/Button'
import Input from './components/common/Input'
import Badge from './components/common/Badge'
import EmptyState from './components/common/EmptyState'
import Loader from './components/common/Loader'
import Modal from './components/common/Modal'
import ConfirmDialog from './components/common/ConfirmDialog'
import Pagination from './components/common/Pagination'
import { Skeleton, SkeletonCard } from './components/common/Skeleton'
import { ELECTION_STATUS, APPLICATION_STATUS, ROLES } from './utils/constants'

function App() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [page, setPage] = useState(0)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => {
      setConfirming(false)
      setConfirmOpen(false)
      toast.success('Vote cast successfully!')
    }, 1500)
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10">
      <div className="absolute -left-20 -top-20 h-72 w-72 animate-float rounded-full bg-brand-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 animate-float rounded-full bg-pink-400/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-bg flex h-11 w-11 items-center justify-center rounded-xl shadow-glow">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold">
              Secure<span className="gradient-text">Vote</span>
              <span className="ml-2 text-sm font-medium text-slate-400">UI Kit</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <section className="glass rounded-3xl p-6">
            <h2 className="mb-4 font-bold">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button icon={Plus}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" size="sm">Danger</Button>
              <Button disabled>Disabled</Button>
            </div>
            <Button className="mt-4" fullWidth size="lg" loading={loading} onClick={handleClick}>
              {loading ? 'Submitting...' : 'Click to test loading'}
            </Button>
          </section>

          <section className="glass rounded-3xl p-6">
            <h2 className="mb-4 font-bold">Inputs</h2>
            <div className="space-y-4">
              <Input
                label="Email"
                icon={Mail}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                icon={Lock}
                type="password"
                name="password"
                placeholder="Enter password"
              />
              <Input
                label="With error"
                icon={Mail}
                name="demo"
                defaultValue="wrong@"
                error="Please enter a valid email"
              />
            </div>
          </section>

          <section className="glass rounded-3xl p-6">
            <h2 className="mb-4 font-bold">Badges</h2>
            <div className="flex flex-wrap gap-2">
              {Object.values(ELECTION_STATUS).map((s) => (
                <Badge key={s} status={s} />
              ))}
              {Object.values(APPLICATION_STATUS).map((s) => (
                <Badge key={s} status={s} />
              ))}
              {Object.values(ROLES).map((r) => (
                <Badge key={r} status={r} />
              ))}
            </div>
            <h2 className="mb-3 mt-6 font-bold">Skeleton lines</h2>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <div className="mt-6">
              <Loader text="Loading elections..." />
            </div>
          </section>

          <SkeletonCard />

          <section className="glass rounded-3xl p-6 md:col-span-2">
            <h2 className="mb-4 font-bold">Modal, Dialog, Toast aur Pagination</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
              <Button variant="outline" onClick={() => toast.success('Success toast!')}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error('Error toast!')}>
                Error Toast
              </Button>
            </div>

            <Pagination page={page} totalPages={10} onPageChange={setPage} className="mt-6" />
            <p className="mt-2 text-center text-xs text-slate-500">
              Current page (0-based): {page}
            </p>
          </section>

          <div className="md:col-span-2">
            <EmptyState
              icon={CalendarX}
              title="No active elections"
              description="Jab koi election start hoga, wo yahan dikhai dega."
              action={<Button icon={Plus}>Refresh</Button>}
            />
          </div>
        </motion.div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Demo Modal">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ye ek glass popup hai. Esc dabao, X dabao ya bahar click karo, band ho jayega.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setModalOpen(false)}>Got it</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm your vote"
        message="Vote submit hone ke baad badla nahi ja sakta."
        confirmText="Yes, cast vote"
        variant="primary"
        loading={confirming}
      />
    </div>
  )
}

export default App