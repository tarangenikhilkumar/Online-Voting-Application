import {
  CheckSquare,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  Megaphone,
  PieChart,
  ShieldCheck,
  UserCircle,
  UserPlus,
  Users,
  Vote,
} from 'lucide-react'
import { ROLES } from './constants'

export const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/elections', label: 'Elections', icon: Vote },
    { to: '/admin/voters', label: 'Voters', icon: Users },
    { to: '/admin/candidates', label: 'Candidates', icon: Megaphone },
    { to: '/admin/applications', label: 'Applications', icon: ClipboardList },
    { to: '/admin/results', label: 'Results', icon: PieChart },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
  ],
  [ROLES.VOTER]: [
    { to: '/voter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/voter/elections', label: 'Elections', icon: Vote },
    { to: '/voter/history', label: 'Voting History', icon: History },
    { to: '/voter/results', label: 'Results', icon: PieChart },
    { to: '/voter/profile', label: 'My Profile', icon: UserCircle },
  ],
  [ROLES.CANDIDATE]: [
    { to: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/candidate/profile', label: 'My Profile', icon: UserCircle },
    { to: '/candidate/apply', label: 'Apply for Election', icon: UserPlus },
    { to: '/candidate/applications', label: 'My Applications', icon: FileText },
    { to: '/candidate/results', label: 'Results', icon: CheckSquare },
  ],
}