import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { chartsApi } from '../api'
import { useChartSettingsStore } from '../stores'
import type { ChartItemConfig } from '../stores'
import {
    ChartSection,
    ChartCard,
    BarChart,
    DonutChart,
    StackedBarChart,
    StackedAreaChart,
    MultiLineChart,
    ChartSettingsModal,
} from '../components/charts'

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

export const ChartsPage = () => {
    const coffeeBrands = useQuery({
        queryKey: ['charts', 'coffee-brands'],
        queryFn: () => chartsApi.getTopCoffeeBrands(),
    })

    const snackBrands = useQuery({
        queryKey: ['charts', 'snack-brands'],
        queryFn: () => chartsApi.getPopularSnackBrands(),
    })

    const moodTrend = useQuery({
        queryKey: ['charts', 'mood-trend'],
        queryFn: () => chartsApi.getWeeklyMoodTrend(),
    })

    const workoutTrend = useQuery({
        queryKey: ['charts', 'workout-trend'],
        queryFn: () => chartsApi.getWeeklyWorkoutTrend(),
    })

    const coffeeConsumption = useQuery({
        queryKey: ['charts', 'coffee-consumption'],
        queryFn: () => chartsApi.getCoffeeConsumption(),
    })

    const snackImpact = useQuery({
        queryKey: ['charts', 'snack-impact'],
        queryFn: () => chartsApi.getSnackImpact(),
    })

    const { settings, setSettings } = useChartSettingsStore()

    const [activeModal, setActiveModal] = useState<string | null>(null)

    const getDefaultConfig = (
        data: { key: string; label: string }[]
    ): ChartItemConfig[] => {
        return data.map((item, index) => ({
            key: item.key,
            label: item.label,
            color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
            visible: true,
        }))
    }

    const coffeeBrandsConfig = useMemo(() => {
        const saved = settings['coffee-brands']
        if (saved) return saved
        if (!coffeeBrands.data) return []
        return getDefaultConfig(
            coffeeBrands.data.data.map((item) => ({ key: item.brand, label: item.brand }))
        )
    }, [coffeeBrands.data, settings])

    const snackBrandsConfig = useMemo(() => {
        const saved = settings['snack-brands']
        if (saved) return saved
        if (!snackBrands.data) return []
        return getDefaultConfig(
            snackBrands.data.data.map((item) => ({ key: item.name, label: item.name }))
        )
    }, [snackBrands.data, settings])

    const configToColors = (config: ChartItemConfig[]) => {
        const colors: Record<string, string> = {}
        config.forEach((item) => {
            colors[item.key] = item.color
        })
        return colors
    }

    const configToHidden = (config: ChartItemConfig[]) => {
        return new Set(config.filter((item) => !item.visible).map((item) => item.key))
    }

    const coffeeBrandsColors = useMemo(() => configToColors(coffeeBrandsConfig), [coffeeBrandsConfig])
    const coffeeBrandsHidden = useMemo(() => configToHidden(coffeeBrandsConfig), [coffeeBrandsConfig])
    const snackBrandsColors = useMemo(() => configToColors(snackBrandsConfig), [snackBrandsConfig])
    const snackBrandsHidden = useMemo(() => configToHidden(snackBrandsConfig), [snackBrandsConfig])

    return (
        <div className="space-y-10">
            <ChartSection title="브랜드 분석">
                <ChartCard
                    title="인기 커피 브랜드"
                    isLoading={coffeeBrands.isLoading}
                    error={coffeeBrands.error}
                    onSettingsClick={() => setActiveModal('coffee-brands')}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {coffeeBrands.data && (
                                <BarChart
                                    data={coffeeBrands.data.data}
                                    dataKey="popularity"
                                    nameKey="brand"
                                    colors={coffeeBrandsColors}
                                    hiddenKeys={coffeeBrandsHidden}
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {coffeeBrands.data && (
                                <DonutChart
                                    data={coffeeBrands.data.data}
                                    dataKey="popularity"
                                    nameKey="brand"
                                    colors={coffeeBrandsColors}
                                    hiddenKeys={coffeeBrandsHidden}
                                />
                            )}
                        </div>
                    </div>
                </ChartCard>
                <ChartCard
                    title="인기 스낵 브랜드"
                    isLoading={snackBrands.isLoading}
                    error={snackBrands.error}
                    onSettingsClick={() => setActiveModal('snack-brands')}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {snackBrands.data && (
                                <BarChart
                                    data={snackBrands.data.data}
                                    dataKey="share"
                                    nameKey="name"
                                    colors={snackBrandsColors}
                                    hiddenKeys={snackBrandsHidden}
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {snackBrands.data && (
                                <DonutChart
                                    data={snackBrands.data.data}
                                    dataKey="share"
                                    nameKey="name"
                                    colors={snackBrandsColors}
                                    hiddenKeys={snackBrandsHidden}
                                />
                            )}
                        </div>
                    </div>
                </ChartCard>
            </ChartSection>

            <ChartSection title="주간 트렌드">
                <ChartCard
                    title="주간 기분 트렌드"
                    isLoading={moodTrend.isLoading}
                    error={moodTrend.error}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {moodTrend.data && (
                                <StackedBarChart
                                    data={moodTrend.data.data}
                                    xKey="week"
                                    dataKeys={['happy', 'tired', 'stressed']}
                                    labels={{ happy: '행복', tired: '피곤', stressed: '스트레스' }}
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {moodTrend.data && (
                                <StackedAreaChart
                                    data={moodTrend.data.data}
                                    xKey="week"
                                    dataKeys={['happy', 'tired', 'stressed']}
                                    labels={{ happy: '행복', tired: '피곤', stressed: '스트레스' }}
                                />
                            )}
                        </div>
                    </div>
                </ChartCard>
                <ChartCard
                    title="주간 운동 트렌드"
                    isLoading={workoutTrend.isLoading}
                    error={workoutTrend.error}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {workoutTrend.data && (
                                <StackedBarChart
                                    data={workoutTrend.data.data}
                                    xKey="week"
                                    dataKeys={['running', 'cycling', 'stretching']}
                                    labels={{ running: '러닝', cycling: '사이클', stretching: '스트레칭' }}
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {workoutTrend.data && (
                                <StackedAreaChart
                                    data={workoutTrend.data.data}
                                    xKey="week"
                                    dataKeys={['running', 'cycling', 'stretching']}
                                    labels={{ running: '러닝', cycling: '사이클', stretching: '스트레칭' }}
                                />
                            )}
                        </div>
                    </div>
                </ChartCard>
            </ChartSection>

            <ChartSection title="생산성 분석">
                <ChartCard
                    title="커피 섭취량 vs 생산성"
                    isLoading={coffeeConsumption.isLoading}
                    error={coffeeConsumption.error}
                >
                    <div className="h-80">
                        {coffeeConsumption.data && (
                            <MultiLineChart
                                series={coffeeConsumption.data.data.teams.map((team) => ({
                                    name: team.team,
                                    data: team.series.map((s) => ({
                                        x: s.cups,
                                        primary: s.bugs,
                                        secondary: s.productivity,
                                    })),
                                }))}
                                xLabel="커피 (잔/일)"
                                primaryLabel="버그 수"
                                secondaryLabel="생산성"
                            />
                        )}
                    </div>
                </ChartCard>
                <ChartCard
                    title="스낵 섭취 vs 사기"
                    isLoading={snackImpact.isLoading}
                    error={snackImpact.error}
                >
                    <div className="h-80">
                        {snackImpact.data && (
                            <MultiLineChart
                                series={snackImpact.data.data.departments.map((dept) => ({
                                    name: dept.name,
                                    data: dept.metrics.map((m) => ({
                                        x: m.snacks,
                                        primary: m.meetingsMissed,
                                        secondary: m.morale,
                                    })),
                                }))}
                                xLabel="스낵 (개)"
                                primaryLabel="회의 불참"
                                secondaryLabel="사기"
                            />
                        )}
                    </div>
                </ChartCard>
            </ChartSection>

            <ChartSettingsModal
                isOpen={activeModal === 'coffee-brands'}
                onClose={() => setActiveModal(null)}
                items={coffeeBrandsConfig}
                onApply={(items) => setSettings('coffee-brands', items)}
            />

            <ChartSettingsModal
                isOpen={activeModal === 'snack-brands'}
                onClose={() => setActiveModal(null)}
                items={snackBrandsConfig}
                onApply={(items) => setSettings('snack-brands', items)}
            />
        </div>
    )
}
