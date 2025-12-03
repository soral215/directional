import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface DonutChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  dataKey: string
  nameKey: string
}

export const DonutChart = ({
  data,
  dataKey,
  nameKey,
}: DonutChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={90}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
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

