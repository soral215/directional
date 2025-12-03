import { useQuery } from '@tanstack/react-query'
import { chartsApi } from '../api'
import { ChartSection, ChartCard, ChartPlaceholder } from '../components/charts'

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


  console.log(coffeeBrands.data)
  console.log(snackBrands.data)
  console.log(moodTrend.data)
  console.log(workoutTrend.data)
  console.log(coffeeConsumption.data)
  console.log(snackImpact.data)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">차트</h2>
    </div>
  )
}
