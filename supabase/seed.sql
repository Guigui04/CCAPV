-- Seed data: exemples realistes pour chaque sous-categorie
-- Ces articles peuvent etre supprimes depuis le dashboard admin

INSERT INTO public.news (commune_id, category_id, title, summary, content, status, is_featured, published_at, created_at) VALUES

-- ═══ ORIENTATION / FORMATION ═══

-- Parcours scolaires
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'parcours-scolaires',
 'Parcoursup 2026 : les dates cles a retenir',
 'Tout savoir sur le calendrier Parcoursup pour bien preparer ton orientation post-bac.',
 'La plateforme Parcoursup ouvre ses portes le 18 janvier 2026. Voici les etapes importantes :

- 18 janvier : ouverture du site, consultation des formations
- 20 mars : date limite pour formuler tes voeux
- 6 avril : date limite pour completer ton dossier
- Juin : phase d admission principale

Conseil : n attends pas la derniere minute pour remplir tes voeux. Renseigne-toi aupres du Point Info Jeunes pour un accompagnement personnalise.',
 'published', true, NOW(), NOW()),

-- Reconversion
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'reconversion',
 'Bilan de competences gratuit : comment en beneficier ?',
 'Tu envisages de changer de voie ? Le bilan de competences est un outil precieux pour y voir plus clair.',
 'Le bilan de competences te permet d analyser tes competences professionnelles et personnelles, tes aptitudes et motivations. Il dure en general 24 heures reparties sur plusieurs semaines.

Comment le financer :
- Via ton Compte Personnel de Formation (CPF)
- Par Pole emploi si tu es demandeur d emploi
- Par ton employeur dans le cadre du plan de developpement des competences

Le Point Info Jeunes peut t orienter vers des organismes agrees pres de chez toi.',
 'published', false, NOW(), NOW() - INTERVAL '1 day'),

-- Alternance
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'alternance',
 'Alternance : les aides de l Etat prolongees en 2026',
 'Bonne nouvelle : les aides a l embauche en alternance sont reconduites cette annee.',
 'Le gouvernement a confirme la prolongation de l aide a l embauche pour les contrats d apprentissage et de professionnalisation :

- 6 000 euros pour l embauche d un alternant de moins de 30 ans
- Aide versee la premiere annee du contrat
- Applicable aux contrats signes avant le 31 decembre 2026

Pour trouver une alternance :
- Portail de l alternance (alternance.emploi.gouv.fr)
- La Bonne Alternance (labonnealternance.pole-emploi.fr)
- Les salons et forums locaux',
 'published', false, NOW(), NOW() - INTERVAL '2 days'),

-- ═══ EMPLOI ═══

-- Recherche de job
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'recherche-job',
 'Jobs d ete 2026 : ou postuler dans les Alpes de Haute-Provence ?',
 'Saisonniers, animateurs, serveurs... les offres d ete commencent a tomber !',
 'La saison estivale approche et les recrutements battent leur plein dans le departement :

Secteurs qui recrutent :
- Tourisme et hotellerie (camping, hotels, offices de tourisme)
- Animation (centres de loisirs, colonies de vacances)
- Agriculture (cueillette de lavande, maraichage)
- Commerce (boutiques, marches)

Ou chercher :
- France Travail (francetravail.fr)
- Le reseau Info Jeunes
- Les mairies et communautes de communes
- Les groupes Facebook locaux d emploi saisonnier',
 'published', true, NOW(), NOW() - INTERVAL '3 days'),

-- CV
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cv',
 'Atelier CV et lettre de motivation : inscris-toi !',
 'Apprends a rediger un CV percutant et une lettre de motivation qui fait la difference.',
 'Le Point Info Jeunes organise des ateliers gratuits pour t aider dans ta recherche d emploi :

Au programme :
- Structurer son CV de maniere claire et professionnelle
- Adapter sa lettre de motivation a chaque offre
- Mettre en valeur ses experiences (meme benevoles !)
- Soigner sa presence en ligne (LinkedIn, reseaux sociaux)

Prochaines dates : tous les mercredis de 14h a 16h.
Inscription sur place ou par telephone.',
 'published', false, NOW(), NOW() - INTERVAL '4 days'),

-- Stages
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stages',
 'Stage de 3e : trouver son stage dans le 04',
 'Guide pratique pour les collegiens a la recherche de leur stage d observation.',
 'Le stage d observation de 3e est une etape importante dans ton parcours. Voici nos conseils :

Quand chercher : des le mois de septembre pour un stage en decembre/janvier.

Ou chercher :
- Les entreprises et commerces de ta commune
- La mairie et les services publics
- Les associations locales
- Le reseau de tes parents et proches

Documents necessaires :
- Convention de stage (fournie par le college)
- Lettre de motivation
- CV (meme simple)

Le Point Info Jeunes peut t aider a rediger ta lettre et a identifier des entreprises d accueil.',
 'published', false, NOW(), NOW() - INTERVAL '5 days'),

-- Dispositifs d insertion
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'insertion',
 'La Garantie Jeunes devient le Contrat d Engagement Jeune (CEJ)',
 'Un accompagnement intensif pour les 16-25 ans eloignes de l emploi.',
 'Le Contrat d Engagement Jeune (CEJ) est un parcours personnalise de 6 a 12 mois pour les jeunes sans emploi ni formation :

Ce que ca comprend :
- Un accompagnement intensif (15 a 20 heures par semaine)
- Des ateliers collectifs et individuels
- Des mises en situation professionnelle (stages, immersions)
- Une allocation pouvant aller jusqu a 528 euros par mois

Conditions :
- Avoir entre 16 et 25 ans (ou 29 ans si en situation de handicap)
- Ne pas etre en emploi, en formation ou en etudes
- S engager a suivre le parcours avec assiduite

Inscription a la Mission Locale la plus proche.',
 'published', true, NOW(), NOW() - INTERVAL '6 days'),

-- ═══ VIE QUOTIDIENNE ═══

-- Logement
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'logement',
 'APL, ALS, ALF : quelles aides au logement pour les jeunes ?',
 'Decouvre les differentes aides au logement et comment en faire la demande.',
 'Trois types d aides au logement existent selon ta situation :

- APL (Aide Personnalisee au Logement) : pour les logements conventionnes
- ALS (Allocation de Logement Sociale) : si tu ne peux pas beneficier de l APL
- ALF (Allocation de Logement Familiale) : si tu as des personnes a charge

Montant : variable selon tes revenus, le loyer et la zone geographique.

Comment faire la demande :
1. Creer ton compte sur caf.fr
2. Remplir le formulaire en ligne
3. Fournir les justificatifs demandes (bail, RIB, avis d imposition)

Delai : environ 2 mois pour le premier versement.',
 'published', false, NOW(), NOW() - INTERVAL '7 days'),

-- Budget
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'budget',
 'Gerer son budget quand on est jeune : les applis qui aident',
 'Pas facile de gerer son argent ? Voici des outils gratuits pour t aider.',
 'Gerer son budget est essentiel pour eviter les galeres de fin de mois. Voici quelques applis gratuites :

- Bankin : connecte tes comptes et visualise tes depenses par categorie
- Pilote Budget (par la CAF) : outil simple pour planifier tes depenses
- Linxo : agregateur de comptes bancaires avec alertes

Regles de base :
- Note toutes tes depenses pendant un mois
- Fixe-toi un budget par poste (alimentation, loisirs, transport...)
- Mets de cote un petit montant chaque mois, meme 10 euros
- Evite les credits a la consommation

Le Point Info Jeunes propose aussi des ateliers budget gratuits.',
 'published', false, NOW(), NOW() - INTERVAL '8 days'),

-- Transport
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'transport',
 'Carte ZOU! : les transports en commun a prix reduit en region Sud',
 'La carte ZOU! te permet de voyager a tarif reduit dans toute la region PACA.',
 'La Region Sud propose la carte ZOU! pour faciliter tes deplacements :

ZOU! Etudes :
- Gratuit pour les trajets domicile-etablissement scolaire
- Pour les lyceens, etudiants et apprentis

ZOU! 50% :
- 50% de reduction sur les cars et trains regionaux
- Pour tous les jeunes de moins de 26 ans
- Abonnement a 15 euros par an

Comment l obtenir :
1. Rendez-vous sur zou.maregionsud.fr
2. Cree ton compte et fais ta demande en ligne
3. Recois ta carte sous 2 semaines',
 'published', true, NOW(), NOW() - INTERVAL '9 days'),

-- ═══ SANTE ═══

-- Acces aux soins
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'acces-soins',
 'Complementaire sante solidaire (C2S) : suis-je eligible ?',
 'Une mutuelle gratuite ou a moins de 1 euro par jour pour les jeunes aux revenus modestes.',
 'La Complementaire Sante Solidaire (C2S) remplace la CMU-C et l ACS. Elle couvre :

- Consultations chez le medecin, dentiste, ophtalmo
- Medicaments
- Lunettes et protheses dentaires
- Hospitalisations

Conditions de revenus (pour une personne seule) :
- C2S gratuite : revenus inferieurs a 10 166 euros par an
- C2S avec participation : revenus entre 10 166 et 13 724 euros par an

Demande en ligne sur ameli.fr ou en agence CPAM.
Le Point Info Jeunes peut t accompagner dans tes demarches.',
 'published', false, NOW(), NOW() - INTERVAL '10 days'),

-- Prevention
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'prevention',
 'Mon Bilan Prevention : un rendez-vous sante gratuit pour les 18-25 ans',
 'Un bilan de sante complet et gratuit pour faire le point sur ta sante.',
 'Depuis 2024, le dispositif Mon Bilan Prevention propose un rendez-vous gratuit chez un professionnel de sante :

Ce que ca comprend :
- Un questionnaire sur tes habitudes de vie
- Un examen clinique adapte a ton age
- Des conseils personnalises (alimentation, sommeil, addictions, sante mentale)
- Une orientation vers des specialistes si necessaire

Comment en beneficier :
- Prends rendez-vous chez ton medecin traitant, sage-femme ou pharmacien
- C est 100% pris en charge par l Assurance Maladie
- Aucune avance de frais',
 'published', false, NOW(), NOW() - INTERVAL '11 days'),

-- Bien-etre
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'bien-etre',
 'Sante mentale : le dispositif MonPsy pour les jeunes',
 '8 seances chez un psychologue remboursees par l Assurance Maladie.',
 'Tu traverses une periode difficile ? Le dispositif MonPsy permet d acceder a un accompagnement psychologique :

Comment ca marche :
1. Consulte ton medecin traitant qui t adresse vers un psychologue partenaire
2. Beneficie de 8 seances remboursees par an
3. Tarif : 30 euros la seance (40 euros la premiere), rembourse par l Assurance Maladie

En cas d urgence :
- Fil Sante Jeunes : 0 800 235 236 (gratuit et anonyme)
- 3114 : numero national de prevention du suicide
- La Maison des Adolescents du 04',
 'published', true, NOW(), NOW() - INTERVAL '12 days'),

-- ═══ MOBILITE INTERNATIONALE ═══

-- Erasmus+
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'erasmus',
 'Erasmus+ : partir etudier en Europe meme sans etre etudiant',
 'Le programme Erasmus+ n est pas reserve aux etudiants ! Decouvre toutes les possibilites.',
 'Erasmus+ propose plusieurs types de mobilite :

Pour les etudiants :
- Etudes a l etranger (3 a 12 mois)
- Stage en entreprise (2 a 12 mois)
- Bourse mensuelle de 250 a 500 euros selon le pays

Pour les jeunes en formation professionnelle :
- Stage en entreprise a l etranger (2 semaines a 12 mois)
- Prise en charge du voyage et de l hebergement

Pour tous les jeunes (18-30 ans) :
- Echanges de jeunes (5 a 21 jours)
- Projets de solidarite locale

Renseigne-toi aupres de ton etablissement ou du Point Info Jeunes.',
 'published', false, NOW(), NOW() - INTERVAL '13 days'),

-- Volontariat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'volontariat',
 'Corps Europeen de Solidarite : du volontariat a l etranger',
 'Pars entre 2 et 12 mois dans un autre pays europeen pour une mission solidaire.',
 'Le Corps Europeen de Solidarite (CES) te permet de vivre une experience unique :

Principe :
- Mission de volontariat dans une association europeenne
- Duree : 2 a 12 mois
- Tout est pris en charge : voyage, hebergement, repas, assurance
- Argent de poche mensuel (environ 150 euros selon le pays)

Domaines possibles :
- Environnement et developpement durable
- Inclusion sociale et jeunesse
- Culture et patrimoine
- Sport et sante

Conditions : avoir entre 18 et 30 ans, etre motive ! Pas besoin de diplome ni de parler la langue du pays.',
 'published', false, NOW(), NOW() - INTERVAL '14 days'),

-- Sejours a l etranger
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sejours-etranger',
 'PVT (Permis Vacances Travail) : travailler a l etranger pendant un an',
 'Le PVT te permet de voyager et travailler dans un autre pays pendant 12 mois.',
 'Le Programme Vacances-Travail (PVT) est un visa qui te permet de vivre et travailler a l etranger :

Pays accessibles depuis la France :
- Canada, Australie, Nouvelle-Zelande, Japon, Coree du Sud, Argentine, Bresil, et bien d autres

Conditions :
- Avoir entre 18 et 30 ans (35 ans pour le Canada et l Australie)
- Passeport valide
- Ressources suffisantes pour le debut du sejour (environ 2 500 euros)
- Assurance sante internationale

Le PVT est une aventure extraordinaire pour decouvrir une nouvelle culture tout en travaillant.',
 'published', false, NOW(), NOW() - INTERVAL '15 days'),

-- ═══ ENGAGEMENT ═══

-- Benevolat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'benevolat',
 'Devenir benevole : les associations du 04 ont besoin de toi !',
 'Donne de ton temps pour une cause qui te tient a coeur pres de chez toi.',
 'Le benevolat est un excellent moyen de s engager et de developper ses competences :

Associations qui recherchent des benevoles dans les Alpes de Haute-Provence :
- Restos du Coeur : distribution alimentaire et accompagnement
- Secours Populaire : aide aux personnes en difficulte
- Associations sportives locales : encadrement, evenements
- Protection animale : refuge, maraudes
- Festivals et evenements culturels : logistique, accueil

Avantages du benevolat :
- Developpe des competences valorisables sur ton CV
- Cree du lien social
- Donne du sens a ton quotidien

Plateforme : jeveuxaider.gouv.fr pour trouver des missions pres de chez toi.',
 'published', false, NOW(), NOW() - INTERVAL '16 days'),

-- Service civique
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'service-civique',
 'Service Civique : une mission indemnisee pour les 16-25 ans',
 'Engage-toi pour une cause d interet general pendant 6 a 12 mois et recois une indemnite.',
 'Le Service Civique est un engagement volontaire au service de l interet general :

Conditions :
- Avoir entre 16 et 25 ans (30 ans si en situation de handicap)
- Aucune condition de diplome
- Mission de 6 a 12 mois, 24 a 48 heures par semaine

Indemnite :
- 620 euros net par mois (dont 504 euros de l Etat + 116 euros de l organisme)
- Majoration possible selon ta situation

Domaines :
- Education, sante, environnement, culture, sport, solidarite, citoyennete...

Ou trouver une mission :
- service-civique.gouv.fr
- Le Point Info Jeunes peut t aider a trouver et preparer ta candidature',
 'published', true, NOW(), NOW() - INTERVAL '17 days'),

-- Projets citoyens
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'projets-citoyens',
 'Budget participatif jeunesse : propose ton projet pour ta commune !',
 'Ta commune lance un budget participatif reserve aux jeunes. A toi de jouer !',
 'Le budget participatif jeunesse te permet de proposer et voter pour des projets qui ameliorent ton quotidien :

Comment ca marche :
1. Propose ton idee (amenagement d un espace, evenement, equipement...)
2. Les projets sont etudies par les services techniques
3. Les jeunes de la commune votent pour leurs projets preferes
4. Les projets gagnants sont realises !

Exemples de projets finances les annees precedentes :
- Installation d une table de ping-pong en acces libre
- Organisation d un festival de musique par des jeunes
- Creation d un jardin partage

Date limite de depot : 30 juin 2026.',
 'published', false, NOW(), NOW() - INTERVAL '18 days'),

-- ═══ ACCES AUX DROITS ═══

-- Aides financieres
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'aides-financieres',
 'Toutes les aides financieres pour les 16-25 ans : le guide complet',
 'RSA, prime d activite, bourses... recapitulatif de toutes les aides auxquelles tu peux pretendre.',
 'Voici les principales aides financieres pour les jeunes :

Formation :
- Bourse sur criteres sociaux (CROUS) : de 1 454 a 6 335 euros par an
- Aide au merite : 900 euros par an pour les bacheliers mention Tres Bien
- Bourse Lycee : de 468 a 1 008 euros par an

Emploi et insertion :
- Prime d activite : des 18 ans si tu travailles (montant variable)
- RSA : des 25 ans (ou des 18 ans avec enfant a charge)
- Aide a la mobilite de Pole emploi

Logement :
- APL/ALS : voir rubrique Logement
- Garantie Visale : caution locative gratuite
- Fonds de Solidarite Logement (FSL)

Sante :
- Complementaire Sante Solidaire (C2S)
- Aide au paiement d une mutuelle

Simulateur : 1jeune1solution.gouv.fr/mes-aides',
 'published', true, NOW(), NOW() - INTERVAL '19 days'),

-- Dispositifs publics
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dispositifs-publics',
 'La Mission Locale : un accompagnement gratuit pour les 16-25 ans',
 'La Mission Locale t accompagne dans tes demarches d emploi, formation, logement et sante.',
 'La Mission Locale est un service public de proximite pour les jeunes de 16 a 25 ans :

Services proposes :
- Accompagnement dans la recherche d emploi et de formation
- Aide a l elaboration de ton projet professionnel
- Acces aux dispositifs d insertion (CEJ, Garantie Jeunes...)
- Orientation vers des partenaires (logement, sante, mobilite)

Comment ca marche :
1. Prends rendez-vous (sur place, par telephone ou en ligne)
2. Un conseiller referent t est attribue
3. Tu beneficies d un suivi personnalise et regulier

C est gratuit, confidentiel et sans engagement.

Mission Locale des Alpes de Haute-Provence :
- Digne-les-Bains, Manosque, Sisteron, Forcalquier',
 'published', false, NOW(), NOW() - INTERVAL '20 days');
