# Charte Graphique — Gestion Scolaire QR Code

## Palette de Couleurs

| Rôle | Hex | RGB | HSL | Aperçu |
|------|-----|-----|-----|--------|
| **Primaire** | `#102030` | `16, 32, 48` | `210°, 50%, 13%` | ████ |
| **Secondaire (Accent)** | `#FF751D` | `255, 117, 29` | `23°, 100%, 56%` | ████ |
| **Blanc** | `#FFFFFF` | `255, 255, 255` | `0°, 0%, 100%` | ████ |
| **Bordure / Gris clair** | `#E5E7EB` | `229, 231, 235` | `220°, 13%, 91%` | ████ |
| **Fond clair** | `#F3F4F6` | `243, 244, 246` | `220°, 14%, 96%` | ████ |
| **Texte foncé** | `#1F2937` | `31, 41, 55` | `220°, 28%, 17%` | ████ |
| **Succès (vert)** | `#10B981` | `16, 185, 129` | `160°, 84%, 39%` | ████ |
| **Erreur (rouge)** | `#EF4444` | `239, 68, 68` | `0°, 84%, 60%` | ████ |

---

## Dérivés de la Primaire (`#102030`)

| Usage | Hex | RGB |
|-------|-----|-----|
| Primaire | `#102030` | `16, 32, 48` |
| Primaire hover | `#0A1A28` | `10, 26, 40` |
| Primaire light | `#1A3A5A` | `26, 58, 90` |
| Primaire gradient start | `#0D1B2A` | `13, 27, 42` |
| Primaire gradient end | `#1B2838` | `27, 40, 56` |

---

## Dérivés de l'Accent (`#FF751D`)

| Usage | Hex | RGB |
|-------|-----|-----|
| Accent | `#FF751D` | `255, 117, 29` |
| Accent hover | `#E66510` | `230, 101, 16` |
| Accent light | `#FFF0E5` | `255, 240, 229` |
| Accent dark | `#CC5A0A` | `204, 90, 10` |

---

## Typographie

| Élément | Police | Poids | Taille | Couleur |
|---------|--------|-------|--------|---------|
| Titre H1 | Inter / system-ui | Bold (700) | 2rem (32px) | `#FFFFFF` |
| Titre H2 | Inter / system-ui | Semi-Bold (600) | 1.5rem (24px) | `#1F2937` |
| Titre H3 | Inter / system-ui | Medium (500) | 1.25rem (20px) | `#1F2937` |
| Corps de texte | Inter / system-ui | Regular (400) | 1rem (16px) | `#1F2937` |
| Texte secondaire | Inter / system-ui | Regular (400) | 0.875rem (14px) | `#6B7280` |
| Petits textes | Inter / system-ui | Regular (400) | 0.75rem (12px) | `#9CA3AF` |
| Boutons | Inter / system-ui | Semi-Bold (600) | 0.875rem (14px) | `#FFFFFF` |

---

## Composants

### Boutons

```
[ Primaire ]    [ Secondaire ]    [ Outline ]
  #102030 bg     #FF751D bg       border: #102030
  #FFFFFF text   #FFFFFF text     #102030 text
  hover: #0A1A28 hover: #E66510  hover: #F3F4F6
```

### Cartes
- Fond : `#FFFFFF`
- Bordure : `#E5E7EB` (1px, border-radius: 8px)
- Ombre : `0 1px 3px rgba(0,0,0,0.1)`

### Sidebar / Navigation
- Fond : `#102030`
- Texte liens inactifs : `#9CA3AF`
- Texte liens actifs : `#FFFFFF`
- Accent actif : `#FF751D` (barre latérale gauche 3px)

### Tableaux
- Entête : `#1F2937` bg + `#FFFFFF` text
- Ligne paire : `#F9FAFB`
- Ligne impaire : `#FFFFFF`
- Bordure : `#E5E7EB`

### Formulaires
- Label : `#374151` (font-weight: 500)
- Input bg : `#F9FAFB`
- Input border : `#D1D5DB` (focus: `#FF751D`)
- Placeholder : `#9CA3AF`

---

## Logo & QR Code

> **Multi-école** : chaque école a son propre logo, ses couleurs et son modèle de carte. Les logos sont stockés dans `/uploads/<ecole_slug>/logo/`.

| Usage | Règle |
|-------|-------|
| Logo sur fond clair | Version complète (couleurs natives) |
| Logo sur fond foncé | Version inversée (blanc + accent) |
| QR Code | Fond `#FFFFFF`, modules `#102030` |
| Cartes élèves | Fond `#FFFFFF`, QR Code centré |

---

## Modèle de Carte PVC (Fonction Signature)

La carte PVC personnalisable est l'élément différenciateur du logiciel. Le QR Code embarque un lien vers le **profil complet** de l'élève.

### Recto de la carte (`85.6mm × 54mm` — format CR-80)

```
┌──────────────────────────────────────┐
│  ┌──────┐                            │
│  │      │   ÉCOLE SECONDAIRE XYZ     │
│  │ PHOTO│                            │
│  │      │   Jean KABAMBA             │
│  └──────┘   Classe : 3e A           │
│              Matricule : 2024-001    │
│                                     │
│           [████████████████]        │
│           [███  QR CODE  ███]       │
│           [████████████████]        │
│                                     │
│  ──────────────────────────────     │
│  Année scolaire : 2026-2027         │
└──────────────────────────────────────┘
```

### Éléments recto
| Zone | Contenu | Police/Couleur |
|------|---------|---------------|
| Fond | Dégradé primaire ou blanc | `#102030` → `#1A3A5A` ou `#FFFFFF` |
| Photo | 35×45mm, positionnée à gauche | — |
| Nom | Prénom + Postnom + Nom | Inter Bold, `#FFFFFF` ou `#1F2937` selon fond |
| Classe | Niveau + Section | Inter Regular, accent `#FF751D` |
| Matricule | Année + numéro unique | Inter Regular, `#9CA3AF` |
| QR Code | 25×25mm, fond blanc, modules `#102030` | Lié à `/api/v1/qr/eleve/:id/profil` |
| Logo établissement | Haut droit | PNG fourni par l'établissement |

### Verso (optionnel)
```
┌──────────────────────────────────────┐
│  INFORMATIONS                        │
│  Téléphone parent : +243 XXX XXX XXX│
│  Adresse : 123, Av. Kalamu, Kinshasa │
│                                     │
│  [  Scannez le QR pour voir les     │
│     notes, présences, conduite,     │
│     et activités de l'élève  ]      │
│                                     │
│  Carte valable jusqu'au : 30/06/2027│
└──────────────────────────────────────┘
```

### Personnalisation (paramétrable par l'admin, par école)
| Option | Valeurs par défaut | Description |
|--------|-------------------|-------------|
| Couleur fond recto | Primaire `#102030` | Dégradé ou uni (propre à l'école) |
| Couleur texte recto | Blanc `#FFFFFF` | Adapté au fond |
| Afficher photo | Oui | Booléen |
| Afficher matricule | Oui | Booléen |
| Logo établissement | Non défini | Image uploadée (stockée par école) |
| Mention verso | "Scannez le QR..." | Texte libre |
| Date expiration | Fin année scolaire | Automatique |

### Aperçu avant impression
- Modale plein écran avec aperçu HTML/CSS **temps réel** de la carte
- Mise à jour instantanée lors du changement des paramètres (couleur, logo, champs)
- Skeleton de chargement pendant la génération de l'aperçu
- Bouton "Télécharger le PDF" ou "Imprimer" après validation visuelle

### Règles d'impression
- Format : CR-80 (85.6 × 54mm) ou CR-100 (98.5 × 67mm)
- Résolution minimale : 300 DPI
- Fond perdu : 3mm de chaque côté
- Orientation : paysage
- Type de carte : PVC blanc ou métallisé

---

## Breakpoints (Responsive)

| Device | Largeur |
|--------|---------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## Espacements

| Token | Tailwind | Valeur |
|-------|----------|--------|
| xs | p-2 | 8px |
| sm | p-4 | 16px |
| md | p-6 | 24px |
| lg | p-8 | 32px |
| xl | p-12 | 48px |

---

## Ombres

| Usage | Valeur |
|-------|--------|
| Card | `0 1px 3px rgba(16,32,48,0.1), 0 1px 2px rgba(16,32,48,0.06)` |
| Dropdown | `0 4px 6px rgba(16,32,48,0.1)` |
| Modal | `0 10px 25px rgba(16,32,48,0.15)` |

---

## Exports Design

```
# Couleurs Tailwind (tailwind.config.js)
colors: {
  primary: {
    DEFAULT: '#102030',
    light: '#1A3A5A',
    hover: '#0A1A28',
  },
  accent: {
    DEFAULT: '#FF751D',
    hover: '#E66510',
    light: '#FFF0E5',
    dark: '#CC5A0A',
  },
}
```
