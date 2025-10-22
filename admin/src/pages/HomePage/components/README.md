# Component Organization

This directory follows a **Hybrid Feature-Based** organization pattern.

## Structure

```
components/
├── ComponentList/          # List view feature
│   ├── ComponentList.js   # Main container (exported)
│   ├── ComponentListItem.js
│   ├── ComponentSearch.js
│   ├── CategoryGroup.js
│   ├── CategoryHeader.js
│   ├── EmptyResults.js
│   ├── index.js           # Exports ComponentList
│   └── utils/             # List-specific utilities
│       ├── badgeVariant.js
│       └── componentFilters.js
│
├── ComponentDetail/        # Detail view feature
│   ├── ComponentDetail.js # Main container (exported)
│   ├── ComponentRelationships.js
│   ├── UsageSection.js
│   ├── UsageTable.js
│   ├── DeleteDialog.js
│   └── index.js           # Exports ComponentDetail
│
├── DependencyCard.js      # Shared component
├── DependencySection.js   # Shared component
└── index.js               # Main barrel export
```

## Principles

### 1. Feature Modules
- `ComponentList/` - Everything related to browsing components
- `ComponentDetail/` - Everything related to viewing component details

### 2. Shared Components
- Reusable components used by multiple features stay at root level
- Currently: `DependencyCard`, `DependencySection`
- Uses Strapi's `EmptyStateLayout` for empty states (no custom component needed)

### 3. Import Patterns

```javascript
// External imports (HomePage)
import { ComponentList, ComponentDetail } from './components';

// Internal imports (within ComponentList)
import { ComponentSearch } from './ComponentSearch';
import { filterComponentsByQuery } from './utils/componentFilters';

// Internal imports (within ComponentDetail)
import { UsageSection } from './UsageSection';
import { DependencySection } from '../DependencySection'; // shared component
```

## Benefits

✅ **Clear ownership** - Related components grouped together
✅ **Easy navigation** - Know where to find things
✅ **Scalable** - Easy to add new features
✅ **Colocation** - Related code lives together
✅ **Simple** - Not over-engineered
✅ **Strapi-native** - Uses built-in design system components (`EmptyStateLayout`, etc.)

## Design System Usage

We use Strapi's built-in components where possible:

- **Empty States**: Use `EmptyStateLayout` from `@strapi/design-system`
  ```javascript
  import { EmptyStateLayout } from '@strapi/design-system';
  import { Puzzle } from '@strapi/icons';

  <EmptyStateLayout
    icon={<Puzzle width='10rem' height='10rem' />}
    content='Your message here'
  />
  ```

- **Icons**: Use `@strapi/icons` (Puzzle, EmotionUnhappy, ArrowRight, etc.)
- **Layout**: Use Box, Flex, Grid from `@strapi/design-system`

## Adding New Components

### New Feature Component
If it belongs to an existing feature, add it to that folder:
```
ComponentList/NewListComponent.js
```

### New Shared Component
If it's reusable across features, add it to root:
```
components/NewSharedComponent.js
```

### New Feature
If it's a new major feature, create a new folder:
```
components/NewFeature/
├── NewFeature.js
└── index.js
```
