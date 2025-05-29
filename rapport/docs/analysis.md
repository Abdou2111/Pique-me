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
      Lors du premier accès, l'utilisateur est invité à configurer ses préférences (ex. : types d’activités aimées, équipements préférés) à travers une interface intéressante. Ces préférences permettent de personnaliser les suggestions de parcs.
      Il peut aussi choisir de passer cette étape s’il ne souhaite pas la faire immédiatement.

  - **Connexion :**
    - Permet d’accéder à l’application si l’utilisateur a déjà un compte, en entrant ses identifiants.

  - **Voir et Modifier les infos du compte :**
    - L'utilisateur peut consulter son profil, le modifier et gérer ses informations personnelles.

  - **Recherche :**

      - **Rechercher avec adresse :**
        Grâce à la barre de recherche dans la page de recherche, l'utilisateur peut entrer une adresse ou un nom de parc. Les résultats affichés correspondent à l'élément de recherche.

      - **Filtre :**
        Offre la possibilité d'afficher les parcs selon certains critères prédefinis (feu autorisé, BBQ présent, etc).

      - **Carte interactive dynamique :**
        Une carte est affichée avec tous les parcs disponibles (ex. : 500 parcs). Lorsqu’un utilisateur utilise la barre de recherche ou applique des filtres, la carte se met automatiquement à jour pour n'afficher que les parcs correspondants.

  - **Ajouter / Retirer des favoris (parcs) :**
    - Permet de sauvegarder des éléments pour un accès plus rapide aux éléments préférés (parc) de l'utilisateur.

  - **Réserver un spot ou une activité :**
    Lorsqu'un parc possède des places / activités réservables, l'utilisateur peut en réserver une. Il remplit un formulaire en rentrant des informations telles que l'heure, la date et reçoit une notification de confirmation.

      - **Confirmer sa réservation :**
        L'utilisateur peut confirmer sa réservation en 2 étapes, une avant le début de la réservation et l'autre après le début de la réservation.

  - **Annuler automatiquement une réservation :**
    - Si aucune confirmation n’est faite une heure après le début, la réservation est annulée automatiquement.

  - **Consulter mes réservations :**
      - L'utilisateur peut voir toutes ses réservations faites à date ainsi que les détails qui lui sont liés.

  - **Annuler une réservation:**
      - Si après une heure l'utilisateur ne borne pas dans la zone du parc, sa réservation est automatiquement annulé.

  - **Afficher le règlement d'un parc :**
    - Chaque parc possède un règlement accessible depuis la page du parc. Ce règlement est fourni par la ville de Montréal.

  - **Donner son avis via un système de badges :**
    Après sa visite dans un parc, l'utilisateur reçoit une invitation à donner son avis sous forme d’un mini sondage (ex. : “Would you Pick-Me again?”). Il peut sélectionner des badges représentatifs de son expérience (ex. : “Propre”, “Convivial”, “Trop bondé”, etc.) et ajouter un commentaire ou des photos s’il le souhaite.

  - **Consulter les autres avis :**
    - Dans la page d'un parc, les avis des autres utilisateurs sont présents.


  - **Consulter ses favoris :**
    - L'utilisateur peut voir la liste de tous ses favoris. La page est divisée en deux sections, une pour les parcs et l'autre pour les recettes.

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
  - **Disponibilité:** Le service doit être disponible au moins 99 % du temps (hors maintenance planifiée).

## **Recherche de solutions**

- **Système de réservation de la bibliothèque de l’UdeM**
    - Fonction couverte : Réservation de ressources à un moment précis (ex. : salle d’étude, studio d'enregistrement). Ce système montre comment une interface simple, basée sur un calendrier, peut permettre de gérer efficacement des réservations dans un contexte public.
    - Pourquoi c’est pertinent pour Pique-Me : Il montre comment gérer facilement la sélection d’un créneau horaire et l’envoi d’une confirmation, ce qui est utile pour la réservation d’emplacements dans Pique-Me.
    - Points forts :  
      Interface simple et fonctionnelle.  
      Réservation rapide à travers un calendrier.  
      Confirmation immédiate.
    - Points faibles :  
      Peu personnalisable.  
      Interface peu intuitive.

- **AllTrails**
    - Fonction couverte : AllTrails est une application dédiée aux activités de plein air, surtout les randonnées. Elle permet aux utilisateurs de découvrir des sentiers ou des parcs grâce à une carte interactive et à des filtres comme la distance, le niveau de difficulté ou l’accessibilité. Les utilisateurs peuvent aussi consulter les avis et expériences d'autres personnes.
    - Pourquoi c’est pertinent pour Pique-Me : AllTrails montre comment on peut aider les gens à trouver un lieu qui correspond à leurs préférences. C’est exactement ce que cherche à faire Pique-Me avec les parcs urbains.
    - Points forts :  
      Filtres variés (niveau, distance, accessibilité).  
      Carte interactive.  
      Avis des utilisateurs.
    - Points faibles :  
      Pas de système de réservation.  
      Peu adapté aux pique-niques ou événements sociaux.

- **Airbnb**
    - Fonction couverte : Airbnb est une plateforme de réservation de logements entre particuliers. Elle permet aux utilisateurs de chercher un lieu selon des critères précis (prix, type de logement, services offerts, etc.), de filtrer les résultats, d’ajouter des favoris, et de réserver pour une période donnée avec confirmation immédiate.
    - Pourquoi c’est pertinent pour Pique-Me : Airbnb montre comment on peut simplifier la réservation d’un lieu en utilisant filtres, préférences et calendrier. Ce modèle peut inspirer Pique-Me pour la réservation d’emplacements dans les parcs.
    - Points forts :  
      Interface fluide pour choisir une date ou une heure.  
      Personnalisation selon les préférences de l’utilisateur.  
      Processus de réservation rapide.
    - Points faibles :  
      Trop orienté vers l’hébergement.  
      Peu adapté aux usages liés aux parcs.

- **Google Maps**
    - Fonction couverte : Google Maps est une application de cartographie et de navigation. Elle permet de localiser des lieux, de rechercher par adresse ou mots-clés, et d’accéder à des informations comme les avis, les photos ou les règles associées à un endroit.
    - Pourquoi c’est pertinent pour Pique-Me : Google Maps montre comment centraliser des informations sur un lieu tout en facilitant la recherche avec une carte interactive. Cela peut inspirer Pique-Me pour l’affichage des parcs, de leurs règlements et pour la recherche par localisation.
    - Points forts :  
      Moteur de recherche puissant.  
      Carte interactive intuitive.  
      Intégration des avis, photos et règles.
    - Points faibles :  
      Pas conçu pour réserver des lieux ou des activités.  
      Trop généraliste pour répondre aux besoins spécifiques liés aux parcs urbains (ex. : équipements, disponibilités en temps réel).


## **Méthodologie**
Pour développer notre application Pique-Me, nous avons choisi la méthodologie Agile (Scrum). Elle permet de travailler en petites étapes (fonctionnalité par fonctionnalité), ce qui nous aide à organiser nos tâches, prioriser les fonctionnalités importantes et ajuster facilement le projet en cours de route.

Cette méthode est flexible et bien adaptée à notre projet, car elle nous permet d’avancer progressivement tout en testant régulièrement ce qui a été développé.

