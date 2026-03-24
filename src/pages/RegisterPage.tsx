import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try { await register(email, password); setSuccess(true) }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">IJ</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Créer un compte</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">Rejoins la communauté CCAPV</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-5 text-center">
            <p className="font-black text-lg mb-1">✅ Inscription réussie !</p>
            <p className="text-sm mb-3">Vérifie ta boîte mail pour confirmer ton compte.</p>
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">→ Se connecter</Link>
          </div>
        ) : (
          <>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-slate-400 text-lg">✉️</span>
                <input type="email" placeholder="Email" className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="text-slate-400 text-lg">🔒</span>
                <input type="password" placeholder="Mot de passe (6 caractères min)" className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-60">
                {loading ? 'Inscription…' : "Créer mon compte →"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Déjà un compte ? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
