import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function CGUPage() {
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
            <FileText size={24} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-sm text-slate-400">Dernière mise à jour : mars 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
              de l'application <strong>Info Jeunes</strong>, éditée par la communauté de communes
              dont relève l'utilisateur. L'utilisation de l'application implique l'acceptation
              pleine et entière des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              2. Description du service
            </h2>
            <p>
              Info Jeunes est une plateforme d'information à destination des jeunes de 11 à 30 ans.
              Elle permet de :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Consulter des articles d'information sur les dispositifs, aides et événements locaux</li>
              <li>Recevoir des alertes et notifications ciblées</li>
              <li>Donner son avis sur les contenus proposés (feedbacks)</li>
              <li>Sauvegarder des articles en favoris</li>
              <li>Gérer son profil et ses préférences</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              3. Accès au service
            </h2>
            <p>
              L'application est accessible gratuitement à tout utilisateur disposant d'un accès internet.
              Certaines fonctionnalités (favoris, profil, feedbacks) nécessitent la création d'un compte.
              L'éditeur se réserve le droit de suspendre ou interrompre l'accès au service pour maintenance
              ou mise à jour, sans préavis ni indemnité.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              4. Inscription et compte utilisateur
            </h2>
            <p>
              L'utilisateur s'engage à fournir des informations exactes lors de son inscription.
              Il est responsable de la confidentialité de ses identifiants de connexion.
              Toute activité réalisée depuis son compte est réputée effectuée par lui.
              L'utilisateur peut à tout moment supprimer son compte depuis les paramètres de son profil.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              5. Obligations de l'utilisateur
            </h2>
            <p>L'utilisateur s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Utiliser l'application de manière conforme à sa destination</li>
              <li>Ne pas publier de contenu illicite, injurieux, diffamatoire ou contraire à l'ordre public</li>
              <li>Ne pas tenter de compromettre la sécurité ou le fonctionnement de l'application</li>
              <li>Respecter les droits de propriété intellectuelle liés aux contenus</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              6. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus de l'application (textes, images, logos, design) sont protégés
              par le droit de la propriété intellectuelle. Toute reproduction, distribution ou
              utilisation non autorisée est interdite. Les feedbacks soumis par les utilisateurs
              peuvent être utilisés de manière anonymisée à des fins d'amélioration du service.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              7. Responsabilité
            </h2>
            <p>
              L'éditeur s'efforce de fournir des informations exactes et à jour, mais ne saurait
              garantir l'exhaustivité ou l'exactitude des contenus. L'application est fournie
              « en l'état ». L'éditeur ne saurait être tenu responsable des dommages directs ou
              indirects résultant de l'utilisation de l'application.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              8. Protection des données
            </h2>
            <p>
              Le traitement des données personnelles est détaillé dans notre{' '}
              <Link to="/confidentialite" className="text-indigo-600 font-bold hover:underline">
                Politique de confidentialité
              </Link>.
              Conformément au RGPD, l'utilisateur dispose de droits d'accès, de rectification
              et de suppression de ses données.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              9. Modification des CGU
            </h2>
            <p>
              L'éditeur se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés de toute modification substantielle.
              La poursuite de l'utilisation de l'application après modification vaut acceptation
              des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              10. Droit applicable
            </h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
              compétents seront ceux du ressort du siège de l'éditeur, à défaut d'accord amiable.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
