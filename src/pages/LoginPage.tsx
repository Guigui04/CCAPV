import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try { await login(email, password); navigate('/') }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">IJ</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Bon retour !</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">Connecte-toi pour accéder à toutes les infos utiles.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-slate-400 text-lg">✉️</span>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-slate-400 text-lg">🔒</span>
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="text-slate-400 hover:text-slate-600">
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Connexion…' : <><span>Se connecter</span><span>→</span></>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ou continuer avec</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 flex items-center justify-center gap-3 font-bold text-slate-700 shadow-sm hover:shadow-md transition-all">
          <span className="text-xl">🌐</span>
          <span>Google</span>
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">Inscris-toi</Link>
        </p>
      </div>
    </div>
  )
}
