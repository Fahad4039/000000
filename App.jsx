import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BalanceCard from './components/BalanceCard'
import AuthForm from './components/AuthForm'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // get active session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) fetchExpenses(newSession)
      else setExpenses([])
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchExpenses(session)
      // subscribe to realtime changes for this user's expenses
      const userId = session.user.id
      const channel = supabase.channel('public:expenses:user:' + userId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, payload => {
          fetchExpenses(session)
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [session])

  async function fetchExpenses(currentSession) {
    setLoading(true)
    const userId = currentSession.user.id
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) console.error('fetch error', error)
    else setExpenses(data || [])
    setLoading(false)
  }

  async function addExpense(expense) {
    const user = session?.user
    if (!user) return
    const row = { ...expense, user_id: user.id }
    const { error } = await supabase.from('expenses').insert(row)
    if (error) console.error('insert error', error)
  }

  async function removeExpense(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) console.error('delete error', error)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="glass-card p-6">
            <AuthForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">3D Expense Tracker</h1>
          <p className="text-slate-600">Realtime • Supabase • Secure • Blur-blue glass UI</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <ExpenseForm onAdd={addExpense} />
            </div>

            <div className="glass-card mt-6 p-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ExpenseList expenses={expenses} onDelete={removeExpense} />
              )}
            </div>
          </div>

          <div>
            <div className="glass-card p-6 sticky top-6">
              <BalanceCard expenses={expenses} />
              <div className="mt-4">
                <button className="btn w-full" onClick={() => supabase.auth.signOut()}>Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="blur-3xl/40 absolute -left-10 -top-10 w-96 h-96 bg-gradient-to-tr from-blue-300 to-indigo-400 rounded-full opacity-40 transform rotate-12"></div>
        <div className="blur-3xl/40 absolute -right-20 bottom-0 w-72 h-72 bg-gradient-to-tr from-cyan-300 to-blue-500 rounded-full opacity-30 transform -rotate-6"></div>
      </div>
    </div>
  )
}
