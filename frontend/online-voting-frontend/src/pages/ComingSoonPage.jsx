import { Hammer } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

function ComingSoonPage({ title }) {
  return (
    <EmptyState
      icon={Hammer}
      title={`${title} is under construction`}
      description="Ye page agle steps me banega. Tab tak sidebar aur navbar ko test karo."
    />
  )
}

export default ComingSoonPage