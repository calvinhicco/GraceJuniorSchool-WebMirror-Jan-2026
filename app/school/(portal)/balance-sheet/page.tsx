import { BalanceSheetView } from "@/components/school/BalanceSheetView"
import { Wallet } from "lucide-react"

export default function SchoolBalanceSheetPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <Wallet className="h-5 w-5" />
          Balance Sheet
          <span className="text-sm font-normal text-slate-500">({currentYear})</span>
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Monthly income and expenses synced from the desktop app. Read-only — no PDF export.
        </p>
      </div>
      <BalanceSheetView />
    </div>
  )
}
