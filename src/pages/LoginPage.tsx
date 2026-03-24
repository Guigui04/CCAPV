import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
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

  async function handleGoogle() {
    setError('')
    try {
      await loginWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Erreur avec la connexion Google')
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Ou continuer avec
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 flex items-center justify-center gap-3 font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

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
