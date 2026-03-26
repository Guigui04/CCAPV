import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 mt-8 py-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <Link to="/cgu" className="hover:text-slate-600 transition-colors">CGU</Link>
          <Link to="/mentions-legales" className="hover:text-slate-600 transition-colors">Mentions légales</Link>
          <Link to="/confidentialite" className="hover:text-slate-600 transition-colors">Confidentialité</Link>
          <Link to="/contact" className="hover:text-slate-600 transition-colors">Contact</Link>
        </div>
        <p className="text-center text-[10px] text-slate-300 mt-3">
          Info Jeunes — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
