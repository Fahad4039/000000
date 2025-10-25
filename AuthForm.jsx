import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin') // or 'signup'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Sign up successful — you can now sign in.')
    setLoading(false)
  }

  async function handleSignin(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>

      <form onSubmit={mode === 'signin' ? handleSignin : handleSignup} className="space-y-3">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" type="submit" disabled={loading}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
          <button type="button" className="btn" onClick={()=>setMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? 'Go to Sign Up' : 'Go to Sign In'}
          </button>
        </div>
      </form>

      {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
      <div className="mt-4 text-sm text-slate-600">Use Email + Password to create and sign in.</div>
    </div>
  )
}
