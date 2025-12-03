import { http } from './client'

export interface CoffeeBrand {
  brand: string
  popularity: number
}

export interface SnackBrand {
  name: string
  share: number
}

export interface WeeklyMood {
  week: string
  happy: number
  tired: number
  stressed: number
}

export interface WeeklyWorkout {
  week: string
  running: number
  cycling: number
  stretching: number
}

export interface CoffeeConsumptionSeries {
  cups: number
  bugs: number
  productivity: number
}

export interface CoffeeConsumptionTeam {
  team: string
  series: CoffeeConsumptionSeries[]
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeConsumptionTeam[]
}

export interface SnackImpactMetrics {
  snacks: number
  meetingsMissed: number
  morale: number
}

export interface SnackImpactDepartment {
  name: string
  metrics: SnackImpactMetrics[]
}

export interface SnackImpactResponse {
  departments: SnackImpactDepartment[]
}

export const chartsApi = {
  getTopCoffeeBrands: () =>
    http.get<CoffeeBrand[]>('/mock/top-coffee-brands'),

  getPopularSnackBrands: () =>
    http.get<SnackBrand[]>('/mock/popular-snack-brands'),

  getWeeklyMoodTrend: () =>
    http.get<WeeklyMood[]>('/mock/weekly-mood-trend'),

  getWeeklyWorkoutTrend: () =>
    http.get<WeeklyWorkout[]>('/mock/weekly-workout-trend'),

  getCoffeeConsumption: () =>
    http.get<CoffeeConsumptionResponse>('/mock/coffee-consumption'),

  getSnackImpact: () =>
    http.get<SnackImpactResponse>('/mock/snack-impact'),
}

