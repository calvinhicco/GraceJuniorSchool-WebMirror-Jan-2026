"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Loader2, Package } from "lucide-react"
import { getInitial, subscribe } from "@/lib/realtime"

interface ExtraBilling {
  id: string
  studentId?: string
  studentName?: string
  description?: string
  amount: number
  date: string
  dueDate?: string
  paid?: boolean
  paidDate?: string
  notes?: string
}

export default function SchoolExtraBillingPage() {
  const [billingItems, setBillingItems] = useState<ExtraBilling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getInitial<ExtraBilling>("extraBilling")
        setBillingItems(data)
      } catch {
        setError("Failed to load extra billing records.")
      } finally {
        setLoading(false)
      }
    }
    load()
    const unsub = subscribe<ExtraBilling>("extraBilling", setBillingItems)
    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-rose-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
        <Package className="h-5 w-5" />
        Extra Billing
      </h1>

      <div className="space-y-3">
        {billingItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">
                  {item.studentName || "Student"} — {item.description || "Extra billing"}
                </p>
                {item.notes && <p className="text-sm text-slate-500">{item.notes}</p>}
              </div>
              <p className="font-semibold text-slate-900">
                ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Date: {item.date ? format(new Date(item.date), "MMM dd, yyyy") : "—"}</span>
              {item.dueDate && (
                <span>Due: {format(new Date(item.dueDate), "MMM dd, yyyy")}</span>
              )}
              <span>{item.paid ? "Paid" : "Unpaid"}</span>
            </div>
          </div>
        ))}
        {billingItems.length === 0 && (
          <p className="text-sm text-slate-500">No extra billing records synced yet.</p>
        )}
      </div>
    </div>
  )
}
