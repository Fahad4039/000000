import React from 'react'

export default function BalanceCard({ expenses }) {
  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const count = expenses.length
  return (
    <div>
      <h3 className="text-xl font-semibold">Overview</h3>
      <div className="mt-4">
        <div className="text-3xl font-bold">₹ {total.toFixed(2)}</div>
        <div className="text-sm text-slate-600">{count} items</div>
      </div>

      <div className="mt-6">
        <button className="btn w-full">Export CSV</button>
      </div>
    </div>
  )
}
