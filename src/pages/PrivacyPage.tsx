import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Link
          to="/profil"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retour au profil
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Politique de confidentialité
            </h1>
            <p className="text-sm text-slate-400">Dernière mise à jour : mars 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              1. Qui sommes-nous ?
            </h2>
            <p>
              L'application <strong>Info Jeunes CCAPV</strong> est éditée par la Communauté de Communes Alpes Provence Verdon.
              Elle a pour objectif d'informer les jeunes de 11 à 30 ans sur les dispositifs, aides et événements
              qui les concernent sur le territoire.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              2. Données collectées
            </h2>
            <p>Nous collectons uniquement les données nécessaires au fonctionnement de l'application :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Compte utilisateur :</strong> adresse email, prénom, nom (optionnels), date de naissance (optionnel)</li>
              <li><strong>Préférences :</strong> commune sélectionnée, centres d'intérêt</li>
              <li><strong>Activité :</strong> avis laissés sur les articles, notifications lues</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              3. Utilisation des données
            </h2>
            <p>Tes données sont utilisées pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Te permettre de te connecter et gérer ton profil</li>
              <li>T'envoyer des alertes pertinentes selon ta commune et tes intérêts</li>
              <li>Améliorer le contenu grâce aux retours (feedbacks anonymisés)</li>
            </ul>
            <p className="mt-2">
              <strong>Nous ne vendons jamais tes données</strong> et ne les partageons avec aucun tiers commercial.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              4. Hébergement et sécurité
            </h2>
            <p>
              Les données sont hébergées par <strong>Supabase</strong> (infrastructure cloud sécurisée).
              Les communications sont chiffrées (HTTPS). L'accès aux données est protégé par des
              politiques de sécurité au niveau de la base de données (Row Level Security).
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              5. Tes droits (RGPD)
            </h2>
            <p>Conformément au RGPD, tu as le droit de :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Accéder</strong> à tes données personnelles (dans ton profil)</li>
              <li><strong>Rectifier</strong> tes informations (modifier ton profil)</li>
              <li><strong>Supprimer</strong> ton compte et tes données (depuis les paramètres de profil)</li>
              <li><strong>Exporter</strong> tes données sur demande</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, tu peux utiliser les fonctionnalités de l'application
              ou nous contacter directement.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              6. Cookies
            </h2>
            <p>
              L'application utilise uniquement des cookies techniques nécessaires à l'authentification.
              Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              7. Contact
            </h2>
            <p>
              Pour toute question relative à la protection de tes données, tu peux nous contacter à
              l'adresse de la Communauté de Communes Alpes Provence Verdon.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
