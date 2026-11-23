import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { getImageUrl } from '../../utils/imageUrl'

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function CandidateCard({ candidate, selected = false, selectable = false, onSelect, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = getImageUrl(candidate.profileImageUrl)

  const handleSelect = () => {
    if (selectable) onSelect(candidate.electionCandidateId)
  }

  const handleKeyDown = (e) => {
    if (selectable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleSelect()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={selectable ? { y: -4 } : undefined}
      role={selectable ? 'radio' : undefined}
      aria-checked={selectable ? selected : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'glass relative flex flex-col items-center rounded-2xl p-5 text-center transition-all',
        selectable && 'cursor-pointer',
        selected && 'ring-2 ring-brand-500 shadow-glow',
      )}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-3 text-brand-500"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.span>
      )}

      {image && !imageFailed ? (
        <img
          src={image}
          alt={candidate.name}
          onError={() => setImageFailed(true)}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white/60 dark:ring-slate-800"
        />
      ) : (
        <div className="gradient-bg flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white">
          {getInitials(candidate.name)}
        </div>
      )}

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{candidate.name}</h3>
      <span className="mt-1 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300">
        {candidate.partyName || 'Independent'}
      </span>
      <p className="mt-3 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
        {candidate.description || 'No description provided.'}
      </p>
    </motion.div>
  )
}

export default CandidateCard