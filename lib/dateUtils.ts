const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const getCurrentMonth = (): number => new Date().getMonth() + 1

export const getCurrentYear = (): number => new Date().getFullYear()

export const getMonthName = (month: number): string => MONTH_NAMES[month - 1] ?? `Month ${month}`

export const getShortMonthName = (month: number): string => SHORT_MONTH_NAMES[month - 1] ?? "Unknown"
