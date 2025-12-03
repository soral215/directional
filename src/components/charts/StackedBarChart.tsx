import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface StackedBarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  xKey: string
  dataKeys: string[]
  labels?: Record<string, string>
  colors?: Record<string, string>
  hiddenKeys?: Set<string>
}

export const StackedBarChart = ({
  data,
  xKey,
  dataKeys,
  labels = {},
  colors = {},
  hiddenKeys = new Set(),
}: StackedBarChartProps) => {
  const visibleKeys = dataKeys.filter((key) => !hiddenKeys.has(key))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey={xKey}
          stroke="#9ca3af"
          fontSize={12}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: number, name: string) => [`${value}%`, labels[name] || name]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#9ca3af' }}>{labels[value] || value}</span>
          )}
        />
        {visibleKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="stack"
            fill={colors[key] || DEFAULT_COLORS[dataKeys.indexOf(key) % DEFAULT_COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
