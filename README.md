# Strapi Plugin - Component Usage Tracker

<div align="center">

  ![Component Usage Plugin](https://via.placeholder.com/160x160/4945FF/FFFFFF?text=Component+Usage)

  **Track and manage Strapi component usage across content types with powerful dependency visualization**

  [![npm version](https://img.shields.io/npm/v/strapi-plugin-component-usage.svg)](https://www.npmjs.com/package/strapi-plugin-component-usage)
  [![npm downloads](https://img.shields.io/npm/dm/strapi-plugin-component-usage.svg)](https://www.npmjs.com/package/strapi-plugin-component-usage)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Features

- 📊 **Component-to-Component Dependencies** - Visualize which components use other components
- 🔍 **Usage Tracking** - See exactly where each component is used across content types and entries
- 🎨 **Master-Detail UI** - Browse components in sidebar, view details in main panel
- 🔎 **Smart Search** - Filter components by name, category, or UID in real-time
- 📂 **Category Grouping** - Auto-organized by component categories
- 🗑️ **Safe Deletion** - Delete unused components with validation and warnings
- 📈 **Visual Analytics** - Color-coded badges and usage statistics
- 🎭 **Dependency Graph** - Understanding full component relationships
- ✅ **Strapi Design System** - Native Strapi UI/UX patterns

---

## 📦 Installation

```bash
# Using npm
npm install strapi-plugin-component-usage

# Using yarn
yarn add strapi-plugin-component-usage

# Using pnpm
pnpm add strapi-plugin-component-usage
```

---

## ⚙️ Configuration

Add the plugin to your `./config/plugins.js` file:

```javascript
module.exports = {
  // ...
  'component-usage': {
    enabled: true,
  },
  // ...
};
```

Then rebuild your Strapi admin panel:

```bash
npm run build
# or
yarn build
```

---

## 🚀 Usage

### Accessing the Plugin

1. Navigate to **Component Usage** in your Strapi admin sidebar (Layer icon)
2. Browse all your components in the left panel
3. Click any component to view detailed information

### Key Features

#### 📋 Component List View
- **Search bar** - Filter components instantly
- **Category grouping** - Organized by component categories
- **Usage badges** - Color-coded by usage frequency
  - Gray: Not used (0)
  - Green: Low usage (1-4)
  - Yellow: Medium usage (5-9)
  - Red: High usage (10+)

#### 📝 Component Detail View
- **Usage Section** - Shows where the component is used:
  - Content type name
  - Entry ID
  - Field path
- **Component Relationships** - NEW! ✨
  - **Uses Components** - Components nested within this component
  - **Used In Components** - Other components that use this component
  - Visual dependency indicators
- **Delete Component** - Safely remove unused components

#### 🔗 Dependency Tracking

The plugin tracks two types of relationships:

1. **Direct Usage** - Component used in content types/entries
2. **Component Dependencies** - Components using other components
   - Component fields
   - Dynamic zones
   - Repeatable components

---

## 🎯 Use Cases

### 1. **Component Cleanup**
Find and delete unused components to keep your Strapi project organized.

### 2. **Dependency Analysis**
Understand component relationships before making changes or deletions.

### 3. **Usage Audit**
Track which components are heavily used vs. rarely used.

### 4. **Safe Refactoring**
Know the impact before modifying or removing a component.

### 5. **Documentation**
Generate component dependency maps for team documentation.

---

## 🔒 Security & Privacy

### Data Collection
**This plugin does NOT collect, store, or transmit any data outside of your Strapi instance.**

All data remains:
- ✅ Stored locally in your Strapi database
- ✅ Processed server-side only
- ✅ Completely private to your installation

### Security Features
- ✅ No external API calls
- ✅ No telemetry or tracking
- ✅ No credential collection
- ✅ Protected deletion endpoints
- ✅ Validation to prevent breaking changes
- ✅ OWASP security best practices

---

## 📡 API Endpoints

The plugin exposes these REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/component-usage/components` | List all components with usage counts |
| `GET` | `/api/component-usage/components/:uid/usage` | Get usage details for a component |
| `GET` | `/api/component-usage/components/:uid/relationships` | Get component dependencies |
| `GET` | `/api/component-usage/components/:uid/total-usage` | Get direct + indirect usage |
| `GET` | `/api/component-usage/dependency-graph` | Get full dependency graph |
| `DELETE` | `/api/component-usage/components/:uid` | Delete a component (if not in use) |
| `POST` | `/api/component-usage/recalculate` | Manually trigger usage recalculation |

---

## 🏗️ Technical Architecture

### Backend (Server)

```
server/
├── controllers/
│   └── component-usage.js      # API endpoints
├── services/
│   ├── component-usage.js      # Usage tracking logic
│   ├── usage-tracker.js        # Database tracking
│   └── component-relationships.js  # Dependency analysis
└── routes/
    └── index.js                # Route definitions
```

### Frontend (Admin)

```
admin/src/pages/HomePage/components/
├── ComponentList/              # Browse & search
│   ├── ComponentList.js
│   ├── ComponentListItem.js
│   ├── ComponentSearch.js
│   └── utils/                  # Filtering & sorting
├── ComponentDetail/            # Detail view
│   ├── ComponentDetail.js
│   ├── ComponentRelationships.js
│   ├── UsageSection.js
│   └── UsageTable.js
└── DependencyCard.js           # Shared component
```

---

## 🛠️ Development

### Prerequisites

- Strapi v4.13.1 or higher
- Node.js >=14.19.1 <=20.x.x
- npm >=6.0.0

### Local Development

```bash
# Clone the repository
git clone https://github.com/opkod-france/strapi-plugin-component-usage.git

# Install dependencies
npm install

# Link to your Strapi project
npm link
cd /path/to/your/strapi/project
npm link strapi-plugin-component-usage

# Rebuild admin
npm run build
```

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request?

1. Check existing [issues](https://github.com/opkod-france/strapi-plugin-component-usage/issues)
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Strapi version
   - Plugin version

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📋 Requirements

### Strapi Market Compliance

- ✅ MIT License
- ✅ Public npm registry
- ✅ Comprehensive README
- ✅ Clear naming (no Strapi endorsement implied)
- ✅ Strapi Design System v1 (for Strapi v4)
- ✅ No data collection/tracking
- ✅ Free to use (no paywalls)
- ✅ Security best practices
- ✅ No sensitive data collection

---

## 🔄 Compatibility

| Strapi Version | Plugin Version | Design System |
|----------------|----------------|---------------|
| v4.13.1+       | 1.x.x          | v1.x.x        |

---

## 📄 License

[MIT License](LICENSE)

Copyright (c) 2024 Opkod

---

## 👥 Credits

Developed and maintained by [Opkod](https://opkod.io)

---

## 🌟 Support

If you find this plugin helpful, please:
- ⭐ Star the repository
- 📢 Share with the Strapi community
- 🐛 Report bugs
- 💡 Suggest features

---

<div align="center">

  **Made with ❤️ for the Strapi community**

  [npm](https://www.npmjs.com/package/strapi-plugin-component-usage) •
  [GitHub](https://github.com/opkod-france/strapi-plugin-component-usage) •
  [Issues](https://github.com/opkod-france/strapi-plugin-component-usage/issues)

</div>
