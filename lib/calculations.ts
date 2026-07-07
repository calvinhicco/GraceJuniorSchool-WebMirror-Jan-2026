import { BillingCycle, type AppSettings, type BillingCycleType, type Student } from "@/types/school"

export { BillingCycle, type AppSettings, type BillingCycleType, type Student }

export function calculateOutstandingFromEnrollment(
  student: Student,
  billingCycle: BillingCycleType,
): number {
  if (!Array.isArray(student.feePayments)) return 0

  const admissionDate = new Date(student.admissionDate)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  let schoolFeesOutstanding = 0
  let transportOutstanding = 0

  student.feePayments.forEach((payment) => {
    let periodStartDate: Date

    if (billingCycle === BillingCycle.MONTHLY) {
      periodStartDate = new Date(currentYear, payment.period - 1, 1)
    } else {
      const termStartMonths: Record<number, number> = { 1: 0, 2: 4, 3: 8 }
      const startMonth = termStartMonths[payment.period] ?? 0
      periodStartDate = new Date(currentYear, startMonth, 1)
    }

    const admissionPeriodStart = new Date(admissionDate.getFullYear(), admissionDate.getMonth(), 1)

    if (periodStartDate <= currentDate && periodStartDate >= admissionPeriodStart) {
      if (!student.hasTransport || payment.isTransportWaived) {
        schoolFeesOutstanding += payment.outstandingAmount
      } else {
        const transportPart = student.transportFee || 0
        schoolFeesOutstanding += Math.max(0, payment.outstandingAmount - transportPart)
      }
    }
  })

  if (student.hasTransport && Array.isArray(student.transportPayments)) {
    student.transportPayments.forEach((payment) => {
      if (!payment.isSkipped && !payment.isWaived) {
        const paymentDate = new Date(currentYear, payment.month - 1, 1)
        const admissionMonth = new Date(admissionDate.getFullYear(), admissionDate.getMonth(), 1)
        if (paymentDate <= currentDate && paymentDate >= admissionMonth) {
          transportOutstanding += payment.outstandingAmount
        }
      }
    })
  }

  return schoolFeesOutstanding + transportOutstanding
}

export function formatMoney(amount: number, currency = "$"): string {
  return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
