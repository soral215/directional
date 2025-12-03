import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface DonutChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  dataKey: string
  nameKey: string
  colors?: Record<string, string>
  hiddenKeys?: Set<string>
}

export const DonutChart = ({
  data,
  dataKey,
  nameKey,
  colors,
  hiddenKeys,
}: DonutChartProps) => {
  const filteredData = hiddenKeys
    ? data.filter((item) => !hiddenKeys.has(String(item[nameKey])))
    : data

  const getColor = (item: Record<string, unknown>, index: number) => {
    const key = String(item[nameKey])
    return colors?.[key] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={90}
        >
          {filteredData.map((item, index) => (
            <Cell key={index} fill={getColor(item, index)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
