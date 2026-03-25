import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">IJ</span>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">
            Bon retour !
          </h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Connecte-toi pour accéder à toutes les infos utiles.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-4 text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-slate-400 text-lg">✉️</span>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-3 px-4 py-3.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-slate-400 text-lg">🔒</span>
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Connexion...
              </span>
            ) : (
              <>
                Se connecter <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-indigo-600 font-bold hover:underline"
          >
            Inscris-toi
          </Link>
        </p>

        {/* Back to home */}
        <Link
          to="/"
          className="block text-center text-sm text-slate-400 hover:text-slate-600 mt-4 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  )
}
