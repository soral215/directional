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

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface BarChartProps<T> {
  data: T[]
  dataKey: keyof T & string
  nameKey: keyof T & string
}

export const BarChart = <T,>({
  data,
  dataKey,
  nameKey,
}: BarChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
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
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

