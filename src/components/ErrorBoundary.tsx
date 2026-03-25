import { Component, type ReactNode } from 'react'
import { RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-400 mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-xl font-display font-bold text-slate-900 mb-2">
              Oups, quelque chose a planté
            </h1>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Une erreur inattendue s'est produite. Essaie de recharger la page.
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-400 bg-slate-100 rounded-xl p-3 mb-6 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full sm:w-auto"
              >
                <RefreshCw size={16} />
                Recharger
              </button>
              <a href="/" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2">
                <Home size={16} />
                Accueil
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
