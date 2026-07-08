import type { Student } from "@/types/school"
import { getCurrentMonth, getCurrentYear } from "@/lib/dateUtils"

/** Tuition collected in the current calendar month (matches desktop dashboard). */
export function calculateMonthlyTuitionCollections(students: Student[]): number {
  const currentYear = getCurrentYear()
  const currentMonth = getCurrentMonth()

  return students.reduce((total, student) => {
    if (!Array.isArray(student.feePayments)) return total

    const paymentsInMonth = student.feePayments.filter((payment) => {
      if ((payment.amountPaid || 0) <= 0) return false

      const isCurrentMonthPeriod = payment.period === currentMonth

      let isPaidInCurrentMonth = false
      if (payment.paidDate) {
        const paymentDate = new Date(payment.paidDate)
        if (!Number.isNaN(paymentDate.getTime())) {
          isPaidInCurrentMonth =
            paymentDate.getFullYear() === currentYear && paymentDate.getMonth() + 1 === currentMonth
        }
      }

      return isCurrentMonthPeriod || isPaidInCurrentMonth
    })

    const sumForStudent = paymentsInMonth.reduce((sum, payment) => {
      const totalPaid = payment.amountPaid || 0

      if (student.hasTransport && !payment.isTransportWaived) {
        const transportPortion = student.transportFee || 0
        return sum + Math.max(0, totalPaid - transportPortion)
      }

      return sum + totalPaid
    }, 0)

    return total + sumForStudent
  }, 0)
}
