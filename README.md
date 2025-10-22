# Strapi Plugin - Component Usage Tracker

<div align="center">

  ![Component Usage Plugin](https://via.placeholder.com/160x160/4945FF/FFFFFF?text=Component+Usage)

  **Track and manage Strapi component usage across content types with powerful dependency visualization**

  [![npm version](https://img.shields.io/npm/v/strapi-plugin-component-usage.svg)](https://www.npmjs.com/package/strapi-plugin-component-usage)
  [![npm downloads](https://img.shields.io/npm/dm/strapi-plugin-component-usage.svg)](https://www.npmjs.com/package/strapi-plugin-component-usage)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  **⚠️ Strapi v4 Only** - This plugin is designed for Strapi v4 and is not yet compatible with Strapi v5

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

## 🚀 Quick Start (TL;DR)

**What it does:** Visualizes which Strapi components are used where, shows dependencies between components, and helps you safely delete unused components without breaking your content.

**Why you need it:** Prevent breaking changes when refactoring, clean up legacy components, understand component architecture, and maintain a healthy Strapi project.

**Installation:**
```bash
npm install strapi-plugin-component-usage
```

**Access:** After installation and rebuild, navigate to "Component Usage" in your Strapi admin sidebar (look for the Layer icon).

**Most common use:** Find unused components (gray badges with 0 usage) and safely delete them to keep your project clean.

---

## 📦 Installation

**Requirements:** Strapi v4.13.1+ only (not compatible with Strapi v5 yet)

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

#### 🔍 Find What You Need Instantly
- **Real-time search** - Type to filter and locate components as you work
- **Auto-organized categories** - Browse components grouped by their categories
- **Visual usage indicators** - Spot unused, lightly-used, or heavily-used components at a glance:
  - Gray: Unused components ready for cleanup
  - Green: Lightly used (1-4 locations)
  - Yellow: Moderately used (5-9 locations)
  - Red: Widely adopted (10+ locations)

#### 📊 Understand Component Impact
- **Track every usage** - See exactly which content types and entries use each component
- **Visualize dependencies** - NEW! ✨ Understand the full relationship chain:
  - Discover nested components within your component
  - Identify where your component is being reused
  - Navigate the complete dependency tree
- **Assess before you act** - Know the full impact before modifying or removing components

#### 🧹 Clean Up with Confidence
- **Identify cleanup candidates** - Quickly find components that are no longer in use
- **Validate before deletion** - Built-in checks prevent breaking changes
- **Understand ripple effects** - See both direct and indirect usage to avoid surprises

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

## ❓ Common Questions

### Will this work with Strapi v5?
**Not yet.** This plugin currently supports Strapi v4.13.1+ only. Strapi v5 introduces breaking changes to the plugin API, and we're working on v5 compatibility for a future release.

### Does this plugin collect any data?
**No.** All data stays in your local Strapi database. There are no external API calls, no telemetry, and no tracking whatsoever. Your component data never leaves your server.

### Can I delete components through this plugin?
**Yes, but only if they're not in use.** The plugin validates component usage before deletion to prevent breaking changes. If a component is used anywhere (directly or indirectly through other components), deletion will be blocked with a clear warning.

### How does dependency tracking work?
The plugin analyzes your component schemas and content entries to build a relationship graph. It shows:
- **Contains**: Which components are nested inside this component
- **Used In**: Which content types and other components use this component
- **Total Usage**: Direct + indirect usage count across all entries

### Does this slow down my Strapi instance?
**No.** Usage calculations are cached and only run when needed (on admin panel load or manual trigger). The plugin uses efficient queries and caching to minimize performance impact.

### Can I use this in production?
**Yes.** The plugin is read-only by default and only modifies data when you explicitly delete a component. It follows Strapi security best practices and includes validation to prevent accidental deletions.

### What happens if I delete a component by mistake?
If you have database backups, you can restore the component. However, the plugin includes multiple safeguards:
- Validation checks before deletion
- Clear warnings about usage count
- Blocking deletion if component is in use
- Confirmation dialogs in the UI

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
| `GET` | `/api/component-usage/components-list` | List all components without usage data (fast) |
| `GET` | `/api/component-usage/components/full` | Get complete data for all components (legacy) |
| `GET` | `/api/component-usage/components/:uid/usage` | Get usage details for a component |
| `GET` | `/api/component-usage/components/:uid/relationships` | Get component dependencies |
| `GET` | `/api/component-usage/components/:uid/total-usage` | Get direct + indirect usage |
| `GET` | `/api/component-usage/dependency-graph` | Get full dependency graph |
| `DELETE` | `/api/component-usage/components/:uid` | Delete a component (if not in use) |
| `POST` | `/api/component-usage/recalculate` | Manually trigger usage recalculation |
| `POST` | `/api/component-usage/cache/clear` | Clear cache and recalculate usage |

---

## 💡 Example Scenarios

### Scenario 1: Finding Unused Components
**Problem:** You have 50+ components and don't know which are safe to delete.

**Solution:**
1. Open Component Usage plugin in Strapi admin
2. Filter components by looking for gray badges (0 usage)
3. Click on a component to verify it has no dependencies
4. Review the "Contains" and "Used In" sections
5. Click "Delete Component" button to safely remove it

**Result:** Clean project with only actively-used components.

---

### Scenario 2: Understanding Impact Before Refactoring
**Problem:** You need to modify `shared.button` component but are worried about breaking things across your site.

**Solution:**
1. Search for "shared.button" in the Component Usage plugin
2. Check the "Used In" section to see all locations (e.g., 23 content entries)
3. Review "Total Usage (Direct + Indirect)" to see cascade effects
4. Identify which content types and other components depend on it
5. Plan your refactoring with full knowledge of impact

**Result:** Confident refactoring without breaking production content.

---

### Scenario 3: Cleaning Up After a Redesign
**Problem:** After a major site redesign, you have many legacy components from the old design that should be removed.

**Solution:**
1. Use the search/filter to identify components with old naming patterns (e.g., "legacy.*", "old-*")
2. Sort by usage count (lowest first)
3. For each component:
   - Check if usage count is 0
   - Verify no other components depend on it
   - Delete if truly unused
4. Use the dependency graph to understand relationships

**Result:** Cleaned up component library with only current design system components.

---

### Scenario 4: Documenting Component Architecture for New Team Members
**Problem:** A new developer joins your team and needs to understand how components relate to each other.

**Solution:**
1. Open Component Usage plugin
2. Navigate through component categories
3. Use the dependency graph view to show component relationships
4. Click on key components to show their "Contains" and "Used In" relationships
5. Export or screenshot the dependency information for documentation

**Result:** New team member understands component architecture quickly.

---

### Scenario 5: Pre-Migration Audit
**Problem:** You're planning to migrate to Strapi v5 and need to know which components are actually in use.

**Solution:**
1. Run a full audit using the Component Usage plugin
2. Export the usage data via API endpoints
3. Identify components with 0 usage - these can be deleted before migration
4. Document heavily-used components (10+ usages) that need careful testing
5. Create a migration priority list based on usage counts

**Result:** Streamlined migration with only necessary components.

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

- **Strapi v4.13.1 or higher** (Strapi v5 is not yet supported)
- Node.js >=18.0.0 <=22.x.x
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

## 🔧 Troubleshooting

### Plugin not appearing in admin sidebar

**Symptoms:** After installation, you don't see "Component Usage" in the Strapi admin sidebar.

**Solutions:**
1. **Verify installation:**
   ```bash
   npm list strapi-plugin-component-usage
   ```
   You should see the plugin version listed.

2. **Check plugin configuration:**
   Ensure `./config/plugins.js` has:
   ```javascript
   module.exports = {
     'component-usage': {
       enabled: true,
     },
   };
   ```

3. **Rebuild admin panel:**
   ```bash
   npm run build
   # or yarn build / pnpm build
   ```

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

5. **Check Strapi version:**
   ```bash
   npm list @strapi/strapi
   ```
   Ensure you're on v4.13.1 or higher (Strapi v5 is not yet supported).

---

### Usage counts seem incorrect or outdated

**Symptoms:** Component usage numbers don't match what you see in your content.

**Solutions:**
1. **Clear cache and recalculate:**
   ```bash
   # Via API
   curl -X POST http://localhost:1337/api/component-usage/cache/clear
   ```
   Or use the "Recalculate Usage" button in the plugin UI.

2. **Manual recalculation:**
   ```bash
   curl -X POST http://localhost:1337/api/component-usage/recalculate
   ```

3. **Check browser console:**
   Open browser DevTools (F12) → Console tab → Look for errors.

4. **Verify permissions:**
   Ensure your admin user has permissions to access plugin endpoints.

---

### Cannot delete component despite showing 0 usage

**Symptoms:** Delete button is disabled or deletion fails even when usage shows 0.

**Possible causes:**
1. **Component used in draft/unpublished entries:**
   - The plugin counts ALL entries, including drafts
   - Check unpublished content in your content types

2. **Nested component dependencies:**
   - Check "Total Usage (Direct + Indirect)" section
   - Component may be nested inside other components
   - Expand the "Contains" and "Used In" sections for details

3. **Permission issues:**
   - Verify you have admin/super-admin role
   - Check Strapi RBAC settings for component deletion

4. **Cache inconsistency:**
   - Clear cache using the cache/clear endpoint
   - Reload the admin panel

**Debug steps:**
```bash
# Check component relationships via API
curl http://localhost:1337/api/component-usage/components/YOUR_COMPONENT_UID/relationships

# Check total usage
curl http://localhost:1337/api/component-usage/components/YOUR_COMPONENT_UID/total-usage
```

---

### Plugin causes admin panel to crash or load slowly

**Symptoms:** Admin panel becomes unresponsive or loads very slowly after installing the plugin.

**Solutions:**
1. **Large number of components:**
   - If you have 100+ components, initial load may take a few seconds
   - Usage data is cached after first load

2. **Clear cache:**
   ```bash
   # Clear Node.js cache
   rm -rf .cache
   rm -rf build
   npm run build
   ```

3. **Check for JavaScript errors:**
   - Open browser DevTools (F12) → Console tab
   - Report any errors to the GitHub issues

4. **Disable plugin temporarily:**
   ```javascript
   // In config/plugins.js
   module.exports = {
     'component-usage': {
       enabled: false, // Temporarily disable
     },
   };
   ```

---

### API endpoints return 403 Forbidden

**Symptoms:** API calls to `/api/component-usage/*` return 403 errors.

**Solutions:**
1. **Check authentication:**
   - Ensure you're logged in as admin
   - API endpoints require authentication

2. **Verify permissions:**
   - Go to Settings → Roles → Admin
   - Check that plugin permissions are enabled

3. **CORS issues (if calling from external app):**
   - Configure CORS in `./config/middlewares.js`
   - Or call endpoints from within Strapi admin

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

## 🔄 Alternatives & Comparisons

### Why use this plugin instead of manual component review?

| Feature | Manual Review | Component Usage Plugin |
|---------|--------------|----------------------|
| **Find unused components** | Search through all content types manually | Automatic detection with visual indicators |
| **Time required** | Hours for large projects | Seconds |
| **Dependency tracking** | Error-prone, must check schemas manually | Automated relationship graph |
| **Risk of breaking changes** | High - easy to miss dependencies | Low - validation prevents deletions |
| **Usage analytics** | Not available | Color-coded badges, counts, statistics |
| **Documentation** | Manual notes | Built-in visualization |

### Why use this plugin instead of Strapi's built-in tools?

**Strapi doesn't provide:**
- Component usage tracking across content
- Dependency visualization between components
- Safe deletion with validation
- Usage analytics and statistics
- Search and filtering for components

**This plugin adds:**
- Complete usage tracking for every component
- Visual dependency graph (contains/used-in relationships)
- Safe deletion workflow with warnings
- Real-time search and filtering
- API endpoints for programmatic access

### Comparison with other Strapi plugins

**vs. Content Manager:**
- Content Manager: Manages content entries, no component-level insights
- This plugin: Focuses on component architecture and dependencies

**vs. Schema Manager:**
- Schema Manager: Edits component schemas
- This plugin: Analyzes component usage and relationships (read-only by default)

**vs. Deep Copy / Content Export plugins:**
- Deep Copy: Duplicates content structures
- This plugin: Analyzes and cleans up component architecture

### When NOT to use this plugin

You might not need this plugin if:
- You have fewer than 10 components and know exactly where each is used
- You never delete or refactor components
- You're not using components (only single types/collections)
- You're on Strapi v5 (not yet supported)

### Unique features of this plugin

Features you won't find elsewhere:
1. **Component-to-component dependency tracking** - See which components contain other components
2. **Direct + indirect usage calculation** - Understand cascade effects
3. **Visual usage indicators** - Color-coded badges (gray/green/yellow/red)
4. **Safe deletion workflow** - Built-in validation prevents breaking changes
5. **Real-time search and filtering** - Find components instantly
6. **RESTful API** - Programmatic access to all usage data
7. **Zero data collection** - 100% local, no external calls

---

## 🔄 Compatibility

| Strapi Version | Plugin Version | Design System | Status |
|----------------|----------------|---------------|--------|
| v4.13.1+       | 1.x.x          | v1.x.x        | ✅ Supported |
| v5.x.x         | N/A            | N/A           | ❌ Not yet supported |

**Note:** Strapi v5 introduces breaking changes to the plugin API. We're working on v5 compatibility for a future release.

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

## 📊 Plugin Metadata (For LLM Agents & Search Engines)

**Plugin Classification:**
- Type: Strapi v4 Admin Plugin
- Category: Developer Tools, Content Management, Component Management
- Purpose: Component dependency tracking, usage analytics, and safe cleanup
- Target Users: Strapi developers, content architects, technical teams

**Key Capabilities:**
- Track component usage across all content types
- Visualize component-to-component dependencies
- Identify unused components for safe deletion
- Prevent breaking changes with validation
- Real-time search and filtering
- RESTful API for programmatic access

**Technical Specifications:**
- Strapi Version: v4.13.1+ (not compatible with v5 yet)
- Node.js: >=18.0.0 <=22.x.x
- Design System: @strapi/design-system v1.x
- License: MIT (free and open source)
- Data Privacy: 100% local, no external calls, no telemetry

**Installation Methods:**
```bash
npm install strapi-plugin-component-usage   # npm
yarn add strapi-plugin-component-usage      # yarn
pnpm add strapi-plugin-component-usage      # pnpm
```

**Primary Use Cases:**
1. Component cleanup and technical debt reduction
2. Safe refactoring with impact analysis
3. Component architecture documentation
4. Pre-migration audits
5. Team onboarding and knowledge sharing

**Search Keywords:** strapi plugin, component tracking, dependency graph, unused components, content management, strapi v4, component cleanup, refactoring tools, strapi admin plugin

**Structured Data (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Component Usage Tracker for Strapi",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "Content Management System Plugin",
  "operatingSystem": "Node.js",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareVersion": "1.0.0",
  "softwareRequirements": "Strapi v4.13.1+, Node.js >=18.0.0 <=22.x.x",
  "description": "Track component usage, visualize dependencies, find unused components, and safely clean up content types in Strapi v4",
  "keywords": "strapi, component tracking, dependency visualization, content management, strapi-plugin",
  "author": {
    "@type": "Organization",
    "name": "Opkod",
    "url": "https://opkod.io"
  },
  "license": "https://opensource.org/licenses/MIT",
  "codeRepository": "https://github.com/opkod-france/strapi-plugin-component-usage",
  "programmingLanguage": "JavaScript",
  "runtimePlatform": "Node.js",
  "targetProduct": {
    "@type": "SoftwareApplication",
    "name": "Strapi",
    "applicationCategory": "Content Management System"
  }
}
```

---

<div align="center">

  **Made with ❤️ for the Strapi community**

  [npm](https://www.npmjs.com/package/strapi-plugin-component-usage) •
  [GitHub](https://github.com/opkod-france/strapi-plugin-component-usage) •
  [Issues](https://github.com/opkod-france/strapi-plugin-component-usage/issues)

</div>
