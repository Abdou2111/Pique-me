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
    - L'utilisateur peut créer un compte en renseignant ses informations. Il peut aussi choisir de se connecter ou de continuer en tant qu'invité.

  - **Configurer ses préférences à la première utilisation :**
    - Lors du premier accès, l'utilisateur est invité à configurer ses préférences (ex. : types d’activités aimées, équipements préférés) à travers une interface intéressante. Ces préférences permettent de personnaliser les suggestions de parcs.
      Il peut aussi choisir de passer cette étape s’il ne souhaite pas la faire immédiatement.
    
  - **Connexion :**
    - Permet d’accéder à l’application si l’utilisateur a déjà un compte, en entrant ses identifiants.

  - **Voir et Modifier les infos du compte :**
    - L'utilisateur peut consulter son profil, le modifier et gérer ses informations personnelles.
  
  - **Rechercher avec adresse :**
    - Grâce à la barre de recherche dans la page de recherche, l'utilisateur peut entrer une adresse ou un nom de parc. Les résultats affichés correspondent à l'élément de recherche.

  - **Filtre :**
    - Offre la possibilité d'afficher les parcs selon certains critères prédefinis (feu autorisé, BBQ présent, etc)

  - **Carte interactive dynamique :**
    - Une carte est affichée avec tous les parcs disponibles (ex. : 500 parcs). Lorsqu’un utilisateur utilise la barre de recherche ou applique des filtres, la carte se met automatiquement à jour pour n'afficher que les parcs correspondants.

  - **Ajouter / Retirer des favoris (parcs et recettes) :**
    - Permet de sauvegarder des éléments pour un accès plus rapide aux éléments préférés (parc et recette) de l'utilisateur.

  - **Réserver un spot ou une activité :**
    - Lorsqu'un parc possède des places / activités réservables l'utilisateur peut en réserver une. Il remplit un formulaire en rentrant des informations telles que l'heure, la date et reçoit une notification de confirmation.

  - **Confimer sa réservation :**
    - L'utilisateur peut confirmer sa réservation en 2 étapes, une avant le début de la réservation et l'autre après le début de la réservation.

  - **Sondage post-visite ("Would you Pick-Me again?"):**
    - Après avoir visité un parc, l’utilisateur reçoit une notification l’invitant à répondre à un mini formulaire pour évaluer son expérience.
  
  - **Annuler automatiquement une réservation :**
    - Si aucune confirmation n’est faite une heure après le début, la réservation est annulée automatiquement.

  - **Afficher le règlement d'un parc :**
    - Chaque parc possède un règlement accessible depuis la page du parc. Ce règlement est fourni par la ville de Montréal.

  - **Consulter mes réservations :**
    - L'utilisateur peut voir toutes ses résevations faites à date ainsi que les détails qui lui sont liés. 

  - **Donner son avis :**
    - L'utilisateur peut laisser un commentaire sur un lieu et lui attribuer un nombre d'étoile allant de 0 à 5. Il peut aussi ajouter des photos.

  - **Consulter les autres avis :**
    - Dans la page d'un parc, les avis des autres utilisateurs sont présents.

  - **Consulter les recettes :**
    - Voir la liste des idées de recettes à faire lors d'une sortie au parc.

  - **Consulter ses favoris :**
    - L'utilisateur peut voir la liste de tous ses favoris. La page est divisée en deux sections, une pour les parcs et l'autre pour les recettes.

  - **Annuler une réservation:**
    - Si après une heure l'utilisateur ne borne pas dans la zone du parc, sa réservation est automatiquement annulé.

  - **Déconnexion :**
    - Fermer une session active de son compte. S'il revient dans l'application, il devra se reconnecter.
 
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
  - **Système de réservation de la bibliothèque de l’UdeM**
    - Fonction couverte : Réservation de ressources à un moment précis (ex. : salle d’étude, studio d'enregistrement).
    - Points forts :
       Interface simple et précise avec calendrier.
       Envoi de confirmation.
    - Points faibles :
       Peu de personnalisation.
   
  - **AllTrails**
    - Fonction couverte : Recherche et filtrage de lieux de plein air (randonnées, parcs).
    - Points forts :
       Filtres riches (niveau, distance, accessibilité...).
       Carte interactive et avis des utilisateurs.
    - Points faibles :
       Pas de réservation.
       Peu adapté aux pique-niques ou événements sociaux.
   
  - **Airbnb**
    - Fonction couverte : Réservation de lieux + filtres + favoris.
    - Points forts :
     Interface fluide pour choisir une date/heure.
     Personnalisation par préférences.
   
    - Points faibles :
     Trop orienté hébergement, fonctionnalités limitées pour les parcs.

  - **Google Maps**
    - Fonction couverte : Carte interactive + recherche par adresse + avis.
    - Points forts :
       Moteur de recherche puissant.
       Intégration des avis, photos et règles.

  - **Too Good To Go**
    - Fonction couverte : Réservation de paniers surprises → système de créneaux + notifications.
    - Points forts :
       Interface claire, système de réservation par tranche horaire.
       Notification de rappel.
    - Points faibles :
       Fonctionnalité limitée à un usage très spécifique.

  - **Strava**
    - Fonction couverte : Suivi d’activités dans des lieux publics + carte dynamique.
    - Points forts :
       Interface communautaire, carte qui évolue selon les préférences.
    - Points faibles :
     Pas de filtres par équipements.

## **Méthodologie**
Pour développer notre application Pique-Me, nous avons choisi la méthodologie Agile (Scrum). Elle permet de travailler en petites étapes (fonctionnalité par fonctionnalité), ce qui nous aide à organiser nos tâches, prioriser les fonctionnalités importantes et ajuster facilement le projet en cours de route.

Cette méthode est flexible et bien adaptée à notre projet, car elle nous permet d’avancer progressivement tout en testant régulièrement ce qui a été développé.

