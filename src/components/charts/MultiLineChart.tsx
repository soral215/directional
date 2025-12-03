import { useState } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

interface SeriesData {
  name: string
  data: {
    x: number
    primary: number
    secondary: number
  }[]
}

interface MultiLineChartProps {
  series: SeriesData[]
  xLabel: string
  primaryLabel: string
  secondaryLabel: string
  colors?: Record<string, string>
  hiddenKeys?: Set<string>
}

export const MultiLineChart = ({
  series,
  xLabel,
  primaryLabel,
  secondaryLabel,
  colors = {},
  hiddenKeys = new Set(),
}: MultiLineChartProps) => {
  const [localHidden, setLocalHidden] = useState<Set<string>>(new Set())
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null)

  const effectiveHidden = hiddenKeys.size > 0 ? hiddenKeys : localHidden

  const allXValues = [...new Set(series.flatMap((s) => s.data.map((d) => d.x)))].sort((a, b) => a - b)

  const chartData = allXValues.map((x) => {
    const point: Record<string, number> = { x }
    series.forEach((s) => {
      const dataPoint = s.data.find((d) => d.x === x)
      if (dataPoint) {
        point[`${s.name}_primary`] = dataPoint.primary
        point[`${s.name}_secondary`] = dataPoint.secondary
      }
    })
    return point
  })

  const toggleSeries = (name: string) => {
    if (hiddenKeys.size > 0) return
    setLocalHidden((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const getColor = (name: string, index: number) => {
    return colors[name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !hoveredSeries) return null

    const relevantData = payload.filter((p: { dataKey: string }) => p.dataKey.startsWith(hoveredSeries))
    if (relevantData.length === 0) return null

    const primaryData = relevantData.find((p: { dataKey: string }) => p.dataKey.endsWith('_primary'))
    const secondaryData = relevantData.find((p: { dataKey: string }) => p.dataKey.endsWith('_secondary'))

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
        <p className="text-white font-medium mb-2">{hoveredSeries}</p>
        <p className="text-gray-400 text-sm">{xLabel}: {label}</p>
        {primaryData && (
          <p className="text-gray-300 text-sm">{primaryLabel}: {primaryData.value}</p>
        )}
        {secondaryData && (
          <p className="text-gray-300 text-sm">{secondaryLabel}: {secondaryData.value}</p>
        )}
      </div>
    )
  }

  const renderLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {series.map((s, index) => {
        const color = getColor(s.name, index)
        const isHidden = effectiveHidden.has(s.name)
        return (
          <button
            key={s.name}
            onClick={() => toggleSeries(s.name)}
            className={`flex items-center gap-2 px-2 py-1 rounded transition-opacity cursor-pointer ${
              isHidden ? 'opacity-40' : ''
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-400 text-sm">{s.name}</span>
          </button>
        )
      })}
      <div className="flex items-center gap-4 ml-4 border-l border-gray-700 pl-4">
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="0" y1="8" x2="16" y2="8" stroke="#9ca3af" strokeWidth="2" />
            <circle cx="8" cy="8" r="3" fill="#9ca3af" />
          </svg>
          <span className="text-gray-500 text-xs">{primaryLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="0" y1="8" x2="16" y2="8" stroke="#9ca3af" strokeWidth="2" strokeDasharray="3 2" />
            <rect x="5" y="5" width="6" height="6" fill="#9ca3af" />
          </svg>
          <span className="text-gray-500 text-xs">{secondaryLabel}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 50, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="x"
              stroke="#9ca3af"
              fontSize={12}
              label={{ value: xLabel, position: 'bottom', fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              fontSize={12}
              label={{ value: primaryLabel, angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
              label={{ value: secondaryLabel, angle: 90, position: 'insideRight', fill: '#9ca3af', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {series.map((s, index) => {
              const color = getColor(s.name, index)
              const isHidden = effectiveHidden.has(s.name)
              if (isHidden) return null
              return (
                <Line
                  key={`${s.name}_primary`}
                  yAxisId="left"
                  type="monotone"
                  dataKey={`${s.name}_primary`}
                  stroke={color}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy } = props as { cx: number; cy: number }
                    return <circle cx={cx} cy={cy} r={4} fill={color} />
                  }}
                  activeDot={{ r: 6 }}
                  onMouseEnter={() => setHoveredSeries(s.name)}
                  onMouseLeave={() => setHoveredSeries(null)}
                />
              )
            })}
            {series.map((s, index) => {
              const color = getColor(s.name, index)
              const isHidden = effectiveHidden.has(s.name)
              if (isHidden) return null
              return (
                <Line
                  key={`${s.name}_secondary`}
                  yAxisId="right"
                  type="monotone"
                  dataKey={`${s.name}_secondary`}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={(props) => {
                    const { cx, cy } = props as { cx: number; cy: number }
                    return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={color} />
                  }}
                  activeDot={{ r: 6 }}
                  onMouseEnter={() => setHoveredSeries(s.name)}
                  onMouseLeave={() => setHoveredSeries(null)}
                />
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {renderLegend()}
    </div>
  )
}
