import { Link } from 'react-router-dom'
import { ArrowLeft, Scale } from 'lucide-react'

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Mentions légales
            </h1>
            <p className="text-sm text-slate-400">Dernière mise à jour : mars 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              1. Éditeur de l'application
            </h2>
            <p>
              L'application <strong>Info Jeunes</strong> est éditée par les communautés de communes
              clientes du service. Chaque communauté de communes est responsable du contenu
              publié pour son territoire.
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong>Raison sociale :</strong> Communauté de communes (variable selon le territoire)</li>
              <li><strong>Forme juridique :</strong> Établissement public de coopération intercommunale (EPCI)</li>
              <li><strong>Siège social :</strong> Selon la communauté de communes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              2. Directeur de la publication
            </h2>
            <p>
              Le directeur de la publication est le Président de la communauté de communes
              éditrice, ou son représentant dûment habilité.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              3. Hébergement
            </h2>
            <ul className="list-none space-y-1">
              <li><strong>Application web :</strong> Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
              <li><strong>Base de données et authentification :</strong> Supabase Inc. — 970 Toa Payoh North #07-04, Singapore 318992</li>
              <li><strong>Stockage des fichiers :</strong> Supabase Storage (AWS S3, région EU)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              4. Conception et développement
            </h2>
            <p>
              Application conçue et développée dans le cadre du programme Info Jeunes
              pour les communautés de communes françaises.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              5. Propriété intellectuelle
            </h2>
            <p>
              La structure, le design et le code source de l'application sont protégés par le droit
              d'auteur. Les contenus éditoriaux (articles, images) sont la propriété de la
              communauté de communes éditrice ou utilisés avec autorisation.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              6. Crédits
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Icônes :</strong> Lucide Icons (licence ISC)</li>
              <li><strong>Police :</strong> Inter (licence SIL Open Font)</li>
              <li><strong>Animations :</strong> Framer Motion</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              7. Protection des données
            </h2>
            <p>
              Pour toute information relative à la collecte et au traitement des données
              personnelles, consultez notre{' '}
              <Link to="/confidentialite" className="text-indigo-600 font-bold hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
            <p className="mt-2">
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et
              au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
              droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              8. Contact
            </h2>
            <p>
              Pour toute question relative aux mentions légales, vous pouvez contacter
              la communauté de communes dont vous relevez via la page{' '}
              <Link to="/contact" className="text-indigo-600 font-bold hover:underline">
                Contact
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
