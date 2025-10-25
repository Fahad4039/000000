import React from 'react'

export default function ExpenseList({ expenses, onDelete }) {
  if (!expenses.length) return <div className="text-center py-8">No expenses yet — add one!</div>

  return (
    <div className="space-y-3">
      {expenses.map(exp => (
        <div key={exp.id} className="expense-row">
          <div>
            <div className="font-semibold">{exp.description}</div>
            <div className="text-sm text-slate-500">{exp.category} • {exp.date?.slice(0,10)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold">₹ {Number(exp.amount).toFixed(2)}</div>
            <button onClick={()=>onDelete(exp.id)} className="text-sm underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
