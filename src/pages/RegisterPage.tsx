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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display font-bold text-2xl text-blue-900 mb-1">Créer un compte</h1>
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-4 text-sm mt-4">
            <p className="font-semibold mb-1">✅ Inscription réussie !</p>
            <p>Vérifiez votre boîte mail pour confirmer votre compte.</p>
            <Link to="/login" className="text-blue-600 hover:underline font-medium block mt-3">→ Se connecter</Link>
          </div>
        ) : (
          <>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm my-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
                <input type="password" className="input-field" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Inscription…' : 'Créer mon compte'}</button>
            </form>
            <p className="text-sm text-slate-500 text-center mt-5">Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline font-medium">Se connecter</Link></p>
          </>
        )}
      </div>
    </div>
  )
}
