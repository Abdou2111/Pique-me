// Description: quelques qualités d'un parc
export interface ParkQuality {
    id: string;      // identifiant unique
    title: string;   // label affiché
    icon: string;    // nom FontAwesome5
}

export const parkQualities: ParkQuality[] = [
    { id: 'grass',        title: "Qualité de l'herbe",      icon: 'leaf'        },
    { id: 'playground',   title: "État de l’aire de jeux",  icon: 'child'       },
    { id: 'cleanliness',  title: "Propreté",               icon: 'trash-alt'   },
    { id: 'lighting',     title: "Éclairage",              icon: 'lightbulb'   },
    { id: 'shade',        title: "Ombre disponible",        icon: 'tree'        },
    { id: 'water',        title: "Points d’eau",           icon: 'tint'        },
    { id: 'restrooms',    title: "Toilettes",              icon: 'restroom'    },
    { id: 'accessibility',title: "Accessibilité",          icon: 'wheelchair'  },
];
