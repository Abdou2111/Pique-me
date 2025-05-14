# Études préliminaires {#h1}

## **Analyse du problème**

Malgré la richesse des parcs montréalais, les citoyens rencontrent plusieurs difficultés pour en profiter pleinement :

- **Manque d’information centralisée :** il n’existe pas de plateforme unique regroupant les équipements disponibles, les règlements, les événements et les conditions d’accès aux parcs.
- **Impossibilité de réserver facilement :** les usagers ne peuvent pas réserver un emplacement pour pique-niquer ou participer à des activités.
- **Manque d’interaction citoyenne :** il est difficile de partager un avis, signaler du matériel endommagé ou consulter les expériences des autres.
- **Expérience utilisateur limitée :** les besoins spécifiques (comme trouver un parc avec BBQ ou espace ombragé) ne sont pas facilement pris en compte.
- **Problème principal :**
Les citoyens n’ont pas d’outil numérique adapté pour découvrir, filtrer, réserver et interagir efficacement autour des parcs de Montréal.

## **Exigences**

### 1. Exigences fonctionnelles :
  - **Inscription :**
    -  Première page lors de la première utilisation. L'utilisateur peut y entrer ses informations d'inscription. Il peut naviguer vers la page de connexion s'il a déjà un compte ou peut continuer en tant que guest.
  - **Connexion :**
    - Permet à l'utilisateur d'avoir accès à la page d'accueil s'il a déjà un compte. Il peut juste rentrer les informations nécessaires pour l'authentification.

  - **Voir et Modifier les infos du compte :**
    - Consulter son profil et de le modifier si besoin.
  - **Rechercher avec adresse :**
    - Grâce à la barre de recherche dans la page de recherche, l'utilisateur peut entrer une adresse ou un nom de parc. Les résultats affichés correspondent à l'élément de recherche.
  - **Filtre :**
    - Offre la possibilité d'afficher les parcs selon certains critères prédefinis (feu autorisé, BBQ présent, etc)
  - **Mettre / Supprimer des favoris :**
    - Permet de sauvegarder des éléments pour un accès plus rapide aux éléments préférés (parc et recette) de l'utilisateur.
  - **Réserver un spot / activité :**
    - Lorsqu'un parc possède des places / activités réservables l'utilisateur peut en réserver une. Il remplit un formulaire en rentrant des informations telles que l'heure, la date et reçoit une notification de confirmation.
  - **Afficher le règlement d'un parc :**
    - Chaque parc possède un règlement accessible depuis la page du parc. Ce règlement est fourni par la ville de Montréal.
  - **Consulter mes réservations et signalement :**
    - L'utilisateur peut voir toutes ses résevations faites à date ainsi que les détails qui lui sont liés. Pareil pour les signalements.
  - **Faire un signalement :**
    - L'utilisateur remplit un formulaire lui permettant de signaler un problème. Ce formulaire sera envoyé au responsable du parc qui va traiter le signalement. L'utilisateur pourra voir le suivi.
  - **Donner son avis :**
    - L'utilisateur peut laisser un commentaire sur un lieu et lui attribuer un nombre d'étoile allant de 0 à 5. Il peut aussi ajouter des photos.
  - **Consulter les autres avis :**
    - Dans la page d'un parc, les avis des autres utilisateurs sont présents.
  - **Consulter ses favoris :**
    - L'utilisateur peut voir la liste de tous ses favoris. La page est diviser en deux sections, une pour les parcs et l'autre pour les recettes.
  - **Déconnexion :**
    - Fermer une session active de son compte. S'il revient dans l'application, il devra se reconnecter.
  - **Consulter les recettes :**
    - Voir la liste des idées de recettes à faire lors d'une sortie au parc.
  - **Annuler une réservation (demander à Lafontant) :**
    - Si après une heure l'utilisateur ne borne pas dans la zone du parc, sa réservation est automatiquement annulé.
  - **Confimer sa réservation :**
    - L'utilisateur peut confirmer sa réservation en 2 étapes, une avant le début de la réservation et l'autre après le début de la réservation.
  - **Supprimer son compte :**
    - Suppression définitive d'un compte utilisateur. L'utilisateur ne pourra plus se connecter avec les information de ce compte supprimé.

### 2. Exigences non fonctionnelles :
  - **Compatibilité multiplateforme:** L’application doit être accessible et fonctionner correctement sur Android, iOS, etc..
  - **Sécurité des données:** Les mots de passe doivent être stockés de façon sécurisée. Les données personnelles doivent être protégées selon les normes en vigueur.
  - **Accessibilité:** L’interface doit être utilisable par des personnes ayant des limitations visuelles ou motrices
  - **Fiabilité:** L'application ne doit pas planter ou perdre de données lors d’une utilisation normale. Les données doivent aussi être à jour.
  - **Confidentialité:** Aucune donnée personnelle ne doit être partagée avec des tiers sans le consentement de l’utilisateur.
  - **Disponibilité:** Le service doit être disponible au moins 99 % du temps (hors maintenance planifiée).

## **Recherche de solutions**

Utilisation de React Native avec Expo
Base de données Firebase
Gestion de l’authentification, des réservations, des signalements et des avis en temps réel, sans serveur complexe.
API des parcs de Montréal
Permet d’afficher dynamiquement la liste des parcs, leurs équipements (BBQ, toilettes, etc.) et leurs règlements.
Géolocalisation avec Expo Location
Permet à l’utilisateur de trouver les parcs à proximité ou de faire des recherches par adresse.
Système de filtres et favoris localement
Améliore l’expérience utilisateur avec un accès rapide aux parcs préférés.
UI/UX moderne avec composants réutilisables
Création d’interfaces agréables, cohérentes et accessibles via une palette de couleurs et des composants réactifs.
### <mark> Frontend (React Native + Expo)</mark>
Permet un développement rapide et compatible avec plusieurs plateformes (iOS et Android) avec un environnement simple à configurer.

- **UI/UX moderne avec composants réutilisables:** Création d’interfaces agréables, cohérentes et accessibles via une palette de couleurs et des composants réactifs.


### <mark>Backend (Node.js + Express)</mark>
Permet de créer des routes API REST (ex. : GET /parks, POST /reservations), centraliser la logique (vérifier les disponibilités, gérer les conflits de réservation, etc.). On peut aussi découpler frontend et backend ce qui rend l'application plus propre et réutilisable.

On peut y définir précisément quelles données sont accessibles et transformer les données avant de les envoyer à l’application.

- **Base de données Firebase:** Gestion de l’authentification, des réservations, des signalements et des avis en temps réel, sans serveur complexe.
- **API des parcs de Montréal:** Permet d’afficher dynamiquement la liste des parcs, leurs équipements (BBQ, toilettes, etc.) et leurs règlements.
- **Géolocalisation avec Expo Location:** Permet à l’utilisateur de trouver les parcs à proximité ou de faire des recherches par adresse.
- **Système de filtres et favoris localement:** Améliore l’expérience utilisateur avec un accès rapide aux parcs préférés.




## **Méthodologie**
Pour développer notre application Pique-Me, nous avons choisi la méthodologie Agile (Scrum). Elle permet de travailler en petites étapes (fonctionnalité par fonctionnalité), ce qui nous aide à organiser nos tâches, prioriser les fonctionnalités importantes et ajuster facilement le projet en cours de route.

Cette méthode est flexible et bien adaptée à notre projet, car elle nous permet d’avancer progressivement tout en testant régulièrement ce qui a été développé.

