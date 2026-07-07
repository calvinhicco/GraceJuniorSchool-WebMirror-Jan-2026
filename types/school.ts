export type BillingCycleType = "monthly" | "termly"

export const BillingCycle = {
  MONTHLY: "monthly" as BillingCycleType,
  TERMLY: "termly" as BillingCycleType,
}

export interface FeePayment {
  period: number
  amountDue: number
  amountPaid: number
  paid: boolean
  dueDate: string
  paidDate?: string
  isTransportWaived: boolean
  isSkipped?: boolean
  outstandingAmount: number
}

export interface TransportPayment {
  month: number
  monthName: string
  amountDue: number
  amountPaid: number
  paid: boolean
  dueDate: string
  paidDate?: string
  isWaived: boolean
  outstandingAmount: number
  isActive: boolean
  isSkipped: boolean
}

export interface Student {
  id: string
  fullName: string
  className: string
  classGroup: string
  parentContact: string
  address?: string
  admissionDate: string
  academicYear?: string
  hasTransport: boolean
  transportFee: number
  feePayments: FeePayment[]
  transportPayments?: TransportPayment[]
  totalPaid?: number
  totalOwed?: number
}

export interface AppSettings {
  schoolName?: string
  currency?: string
  billingCycle: BillingCycleType
  paymentDueDate?: number
  transportDueDate?: number
}

export interface Expense {
  id: string
  description?: string
  purpose?: string
  amount: number
  date: string
  category?: string
  isReversed?: boolean
  reversed?: boolean
}

export interface ExtraBillingPage {
  id: string
  name: string
  entries?: { amount: number }[]
}

export interface OutstandingStudent {
  id: string
  fullName: string
  className?: string
  parentContact: string
  classGroup: string
  admissionDate: string
  hasTransport: boolean
  transportFee: number
  outstandingAmount: number
  lastUpdated?: string
}
