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

export interface ExtraBillingPayment {
  amount: number
  date: string
}

export interface ExtraBillingEntry {
  id?: string
  studentName?: string
  purpose?: string
  payments?: ExtraBillingPayment[]
  deleted?: boolean
}

export interface ExtraBillingPage {
  id: string
  name: string
  entries?: ExtraBillingEntry[]
  createdAt?: string
  amount?: number
}

export interface SaleRecord {
  id: string
  total: number
  soldAt: string
  status?: string
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
