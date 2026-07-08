"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { getInitial, subscribe, fetchAppSettings, subscribeAppSettings } from "@/lib/realtime"
import { formatMoney } from "@/lib/calculations"
import {
  buildMonthlyBalanceSheet,
  getCurrentYearMonths,
  type MonthlyBalanceSheet,
} from "@/lib/accountsBalanceSheet"
import type { AppSettings, Expense, ExtraBillingPage, SaleRecord, Student } from "@/types/school"

function formatSharePct(value: number, total: number): string {
  if (total <= 0 || value <= 0) return "—"
  return `${((value / total) * 100).toFixed(1)}%`
}

function incomePctClass(pct: number): string {
  if (pct >= 50) return "bg-green-800 text-white"
  if (pct >= 30) return "bg-green-600 text-white"
  if (pct >= 15) return "bg-green-300 text-green-900"
  if (pct > 0) return "bg-green-100 text-green-800"
  return "bg-slate-100 text-slate-500"
}

function expensePctClass(pct: number): string {
  if (pct >= 50) return "bg-red-800 text-white"
  if (pct >= 30) return "bg-red-600 text-white"
  if (pct >= 15) return "bg-red-300 text-red-900"
  if (pct > 0) return "bg-red-100 text-red-800"
  return "bg-slate-100 text-slate-500"
}

export function BalanceSheetView() {
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [extraBillingPages, setExtraBillingPages] = useState<ExtraBillingPage[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const yearMonths = useMemo(() => getCurrentYearMonths(), [])

  useEffect(() => {
    const load = async () => {
      const [studentDocs, expenseDocs, salesDocs, extraBillingDocs, appSettings] =
        await Promise.all([
          getInitial<Student>("students"),
          getInitial<Expense>("expenses"),
          getInitial<SaleRecord>("sales"),
          getInitial<ExtraBillingPage>("extraBilling"),
          fetchAppSettings<AppSettings>(),
        ])

      setStudents(studentDocs)
      setExpenses(expenseDocs)
      setSales(salesDocs)
      setExtraBillingPages(extraBillingDocs)
      setSettings(appSettings)
      setLoading(false)
    }

    load()

    const unsubs = [
      subscribe<Student>("students", setStudents),
      subscribe<Expense>("expenses", setExpenses),
      subscribe<SaleRecord>("sales", setSales),
      subscribe<ExtraBillingPage>("extraBilling", setExtraBillingPages),
      subscribeAppSettings<AppSettings>(setSettings),
    ]

    return () => unsubs.forEach((u) => u())
  }, [])

  const effectiveSettings = useMemo<AppSettings>(
    () => settings ?? { billingCycle: "monthly", currency: "USD" },
    [settings],
  )
  const currency = effectiveSettings.currency || "USD"

  const buildSheetForMonth = useCallback(
    (month: number): MonthlyBalanceSheet => {
      return buildMonthlyBalanceSheet(
        currentYear,
        month,
        students,
        effectiveSettings,
        expenses,
        sales,
        extraBillingPages,
      )
    },
    [currentYear, students, effectiveSettings, expenses, sales, extraBillingPages],
  )

  const balanceSheet = useMemo(() => {
    if (selectedMonth === null) return null
    return buildSheetForMonth(selectedMonth)
  }, [selectedMonth, buildSheetForMonth])

  const totalActivity =
    balanceSheet ? balanceSheet.totalIncome + balanceSheet.totalExpenses : 0

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Select Month</h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose a month to view the balance sheet for {currentYear}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {yearMonths.map(({ month, label }) => {
            const isSelected = selectedMonth === month
            return (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(month)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  isSelected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {balanceSheet && (
        <div className="rounded-xl border border-brand-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-brand-600" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Balance Sheet — {balanceSheet.monthName} {balanceSheet.year}
              </h2>
              <p className="text-sm text-slate-600">School-wide totals (no student names)</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-800">
                <TrendingUp className="h-4 w-4" />
                Income
              </h3>
              {balanceSheet.income.length === 0 ? (
                <p className="text-sm italic text-slate-500">No income recorded for this month.</p>
              ) : (
                <div className="space-y-2">
                  {balanceSheet.income.map((line) => {
                    const sectionPct =
                      balanceSheet.totalIncome > 0
                        ? (line.amount / balanceSheet.totalIncome) * 100
                        : 0
                    const activityPct =
                      totalActivity > 0 ? (line.amount / totalActivity) * 100 : 0
                    return (
                      <div
                        key={line.label}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2"
                      >
                        <span className="min-w-[140px] flex-1 text-sm font-medium text-slate-800">
                          {line.label}
                        </span>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${incomePctClass(sectionPct)}`}
                          >
                            {formatSharePct(line.amount, balanceSheet.totalIncome)} of income
                          </span>
                          <span
                            className={`rounded border border-green-200 px-2 py-0.5 text-xs font-medium ${incomePctClass(activityPct)}`}
                          >
                            {formatSharePct(line.amount, totalActivity)} activity
                          </span>
                          <span className="min-w-[80px] text-right text-sm font-semibold text-green-700">
                            {formatMoney(line.amount, currency)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-green-200 pt-3">
                <span className="font-bold text-green-800">Total Gross Income</span>
                <span className="rounded-full bg-green-600 px-3 py-1 text-base font-semibold text-white">
                  {formatMoney(balanceSheet.totalIncome, currency)}
                </span>
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
                <TrendingDown className="h-4 w-4" />
                Expenses
              </h3>
              {balanceSheet.totalExpenses === 0 ? (
                <p className="text-sm italic text-slate-500">No expenses recorded for this month.</p>
              ) : (
                <div className="space-y-2">
                  {balanceSheet.expenses.map((line) => {
                    const sectionPct =
                      balanceSheet.totalExpenses > 0
                        ? (line.amount / balanceSheet.totalExpenses) * 100
                        : 0
                    const activityPct =
                      totalActivity > 0 ? (line.amount / totalActivity) * 100 : 0
                    return (
                      <div
                        key={line.label}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2"
                      >
                        <span className="min-w-[140px] flex-1 text-sm font-medium text-slate-800">
                          {line.label}
                        </span>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${expensePctClass(sectionPct)}`}
                          >
                            {formatSharePct(line.amount, balanceSheet.totalExpenses)} of expenses
                          </span>
                          <span
                            className={`rounded border border-red-200 px-2 py-0.5 text-xs font-medium ${expensePctClass(activityPct)}`}
                          >
                            {formatSharePct(line.amount, totalActivity)} activity
                          </span>
                          <span className="min-w-[80px] text-right text-sm font-semibold text-red-700">
                            {formatMoney(line.amount, currency)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-red-200 pt-3">
                <span className="font-bold text-red-800">Total Expenses</span>
                <span className="rounded-full bg-red-600 px-3 py-1 text-base font-semibold text-white">
                  {formatMoney(balanceSheet.totalExpenses, currency)}
                </span>
              </div>
            </section>

            <div
              className={`rounded-lg border-2 p-4 ${
                balanceSheet.netBalance >= 0
                  ? "border-brand-300 bg-brand-50"
                  : "border-orange-300 bg-orange-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-brand-900">Net Balance</span>
                <span
                  className={`text-xl font-bold ${
                    balanceSheet.netBalance >= 0 ? "text-brand-800" : "text-orange-700"
                  }`}
                >
                  {formatMoney(balanceSheet.netBalance, currency)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">Total gross income minus total expenses</p>
            </div>
          </div>
        </div>
      )}

      {selectedMonth === null && (
        <p className="text-center text-sm text-slate-500">
          Select a month above to view the balance sheet.
        </p>
      )}
    </div>
  )
}
