import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { useTheme } from '../../hooks/useTheme'

const shorten = (text = '') => (text.length > 14 ? `${text.slice(0, 14)}…` : text)

function VotesBarChart({ data = [] }) {
  const { isDark } = useTheme()

  if (data.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No vote data yet"
        description="Votes aate hi election-wise chart yahan dikhega."
        className="py-10"
      />
    )
  }

  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="title"
            tickFormatter={shorten}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(99,102,241,0.06)' }}
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: 12,
              color: isDark ? '#e2e8f0' : '#1e293b',
            }}
            formatter={(value) => [value, 'Votes']}
          />
          <Bar
            dataKey="totalVotes"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VotesBarChart