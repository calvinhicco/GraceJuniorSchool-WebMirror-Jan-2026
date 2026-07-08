"use client"

import { useEffect, useMemo, useState } from "react"
import { DollarSign, Loader2, Users } from "lucide-react"
import { getInitial, subscribe, subscribeAppSettings } from "@/lib/realtime"
import { formatMoney } from "@/lib/calculations"
import { calculateMonthlyTuitionCollections } from "@/lib/dashboardMetrics"
import { getMonthName } from "@/lib/dateUtils"
import type { AppSettings, Student } from "@/types/school"

export function DashboardTotals() {
  const [students, setStudents] = useState<Student[]>([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalExtraBilling, setTotalExtraBilling] = useState(0)
  const [totalOutstanding, setTotalOutstanding] = useState(0)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<AppSettings | null>(null)

  useEffect(() => {
    const load = async () => {
      const [studentDocs, expenses, extraBilling, outstanding] = await Promise.all([
        getInitial<Student>("students"),
        getInitial<{ amount: number; isReversed?: boolean; reversed?: boolean }>("expenses"),
        getInitial<{ amount: number }>("extraBilling"),
        getInitial<{ outstandingAmount: number }>("outstandingStudents"),
      ])

      setStudents(studentDocs)
      setTotalExpenses(
        expenses.reduce((sum, e) => {
          if (e.isReversed || e.reversed) return sum
          return sum + (Number(e.amount) || 0)
        }, 0),
      )
      setTotalExtraBilling(
        extraBilling.reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
      )
      setTotalOutstanding(
        outstanding.reduce((sum, s) => sum + (Number(s.outstandingAmount) || 0), 0),
      )
      setLoading(false)
    }

    load()

    const unsubs = [
      subscribe<Student>("students", setStudents),
      subscribe<{ amount: number; isReversed?: boolean; reversed?: boolean }>("expenses", (docs) => {
        setTotalExpenses(
          docs.reduce((sum, e) => {
            if (e.isReversed || e.reversed) return sum
            return sum + (Number(e.amount) || 0)
          }, 0),
        )
      }),
      subscribe<{ amount: number }>("extraBilling", (docs) => {
        setTotalExtraBilling(
          docs.reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
        )
      }),
      subscribe<{ outstandingAmount: number }>("outstandingStudents", (docs) => {
        setTotalOutstanding(
          docs.reduce((sum, s) => sum + (Number(s.outstandingAmount) || 0), 0),
        )
      }),
      subscribeAppSettings<AppSettings>(setSettings),
    ]

    return () => unsubs.forEach((u) => u())
  }, [])

  const currency = settings?.currency || "USD"
  const currentMonthTuition = useMemo(
    () => calculateMonthlyTuitionCollections(students),
    [students],
  )
  const currentMonthLabel = getMonthName(new Date().getMonth() + 1)

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    )
  }

  const cards = [
    {
      label: "Total Students",
      value: String(students.length),
      sub: null as string | null,
      className: "bg-brand-gradient text-white",
      icon: Users,
    },
    {
      label: "Tuition Fees Collected (Current Month Only)",
      value: formatMoney(currentMonthTuition, currency),
      sub: currentMonthLabel,
      className: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",
      icon: DollarSign,
    },
    {
      label: "Total Expenses",
      value: formatMoney(totalExpenses, currency),
      sub: null,
      className: "bg-gradient-to-br from-rose-500 to-rose-600 text-white",
      icon: null,
    },
    {
      label: "Extra Billing",
      value: formatMoney(totalExtraBilling, currency),
      sub: null,
      className: "bg-gradient-to-br from-violet-400 to-violet-500 text-white",
      icon: null,
    },
    {
      label: "Outstanding",
      value: formatMoney(totalOutstanding, currency),
      sub: null,
      className: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
      icon: null,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, value, sub, className, icon: Icon }) => (
        <div key={label} className={`rounded-xl p-5 shadow-lg ${className}`}>
          <div className="mb-2 flex items-center justify-between text-sm font-medium opacity-90">
            <span className="pr-2 leading-snug">{label}</span>
            {Icon && <Icon className="h-4 w-4 shrink-0 opacity-80" />}
          </div>
          <div className="text-2xl font-bold">{value}</div>
          {sub && <p className="mt-1 text-xs opacity-80">{sub}</p>}
        </div>
      ))}
    </div>
  )
}
