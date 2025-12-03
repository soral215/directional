import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface BarChartProps<T> {
  data: T[]
  dataKey: keyof T & string
  nameKey: keyof T & string
  colors?: Record<string, string>
  hiddenKeys?: Set<string>
}

export const BarChart = <T,>({
  data,
  dataKey,
  nameKey,
  colors,
  hiddenKeys,
}: BarChartProps<T>) => {
  const filteredData = hiddenKeys
    ? data.filter((item) => !hiddenKeys.has(String((item as Record<string, unknown>)[nameKey])))
    : data

  const getColor = (item: T, index: number) => {
    const key = String((item as Record<string, unknown>)[nameKey])
    return colors?.[key] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={filteredData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9ca3af" fontSize={12} />
        <YAxis
          type="category"
          dataKey={nameKey as string}
          stroke="#9ca3af"
          fontSize={12}
          width={55}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#9ca3af' }}
        />
        <Bar dataKey={dataKey as string} radius={[0, 4, 4, 0]}>
          {filteredData.map((item, index) => (
            <Cell key={index} fill={getColor(item, index)} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
