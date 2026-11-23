import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { useTheme } from '../../hooks/useTheme'
import { ELECTION_STATUS } from '../../utils/constants'

const STATUS_COLORS = {
  [ELECTION_STATUS.UPCOMING]: '#0ea5e9',
  [ELECTION_STATUS.ACTIVE]: '#10b981',
  [ELECTION_STATUS.COMPLETED]: '#64748b',
  [ELECTION_STATUS.RESULTS_PUBLISHED]: '#a855f7',
}

const formatLabel = (status) => status.toLowerCase().replace(/_/g, ' ')

function VotesPieChart({ data = [] }) {
  const { isDark } = useTheme()
  const filtered = data.filter((item) => item.count > 0)

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={PieIcon}
        title="No elections yet"
        description="Election banne par status breakdown yahan dikhega."
        className="py-10"
      />
    )
  }

  return (
    <div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              dataKey="count"
              nameKey="status"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              stroke="none"
              animationDuration={900}
            >
              {filtered.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                borderRadius: 12,
                color: isDark ? '#e2e8f0' : '#1e293b',
              }}
              formatter={(value, name) => [value, formatLabel(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-2">
        {filtered.map((item) => (
          <li key={item.status} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[item.status] || '#94a3b8' }}
            />
            <span className="capitalize text-slate-600 dark:text-slate-300">
              {formatLabel(item.status)}
            </span>
            <span className="ml-auto font-semibold">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VotesPieChart