import { useQuery } from '@tanstack/react-query'
import { chartsApi } from '../api'
import { ChartSection, ChartCard, BarChart, DonutChart, StackedBarChart, StackedAreaChart } from '../components/charts'

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

    return (
        <div className="space-y-10">
            <ChartSection title="브랜드 분석">
                <ChartCard
                    title="인기 커피 브랜드"
                    isLoading={coffeeBrands.isLoading}
                    error={coffeeBrands.error}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {coffeeBrands.data && (
                                <BarChart
                                    data={coffeeBrands.data.data}
                                    dataKey="popularity"
                                    nameKey="brand"
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {coffeeBrands.data && (
                                <DonutChart
                                    data={coffeeBrands.data.data}
                                    dataKey="popularity"
                                    nameKey="brand"
                                />
                            )}
                        </div>
                    </div>
                </ChartCard>
                <ChartCard
                    title="인기 스낵 브랜드"
                    isLoading={snackBrands.isLoading}
                    error={snackBrands.error}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64">
                            {snackBrands.data && (
                                <BarChart
                                    data={snackBrands.data.data}
                                    dataKey="share"
                                    nameKey="name"
                                />
                            )}
                        </div>
                        <div className="h-64">
                            {snackBrands.data && (
                                <DonutChart
                                    data={snackBrands.data.data}
                                    dataKey="share"
                                    nameKey="name"
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
        </div>
    )
}
