import { useQuery } from '@tanstack/react-query'
import { chartsApi } from '../api'
import { ChartSection, ChartCard, ChartPlaceholder, BarChart } from '../components/charts'

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
                        <ChartPlaceholder label="도넛 차트" />
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
                        <ChartPlaceholder label="도넛 차트" />
                    </div>
                </ChartCard>
            </ChartSection>

        </div>
    )
}
