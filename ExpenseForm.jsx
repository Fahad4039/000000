import React, { useState } from 'react'

export default function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Other')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!description || !amount) return
    const expense = { description, amount: parseFloat(amount), category, date }
    await onAdd(expense)
    setDescription('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="input" placeholder="Coffee, Rent, Salary" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="input col-span-1" placeholder="Amount" type="number" step="0.01" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input col-span-1">
          <option>Groceries</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Rent</option>
          <option>Salary</option>
          <option>Other</option>
        </select>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="input col-span-1" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="submit" className="btn">Add Expense</button>
      </div>
    </form>
  )
}
