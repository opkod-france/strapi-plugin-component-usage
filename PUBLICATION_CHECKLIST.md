# Strapi Market Publication Checklist

Use this checklist before submitting to Strapi Market and npm.

## ✅ Business Requirements

- [x] **Hosted on npm** - Package name: `strapi-plugin-component-usage`
- [x] **MIT License** - LICENSE file created
- [x] **Clear name** - Does not imply Strapi endorsement
- [ ] **Logo/Image** - Add 160x160px image (JPG or PNG)
  - Replace placeholder in README
  - Add to `/assets/logo.png`
- [x] **Short description** (50-150 characters)
  - Current: "Track and manage Strapi component usage across content types with dependency visualization"
  - Length: 95 characters ✅
- [x] **Substantial README** - Comprehensive documentation provided
- [ ] **Terms & Conditions** - Agree during submission

## ✅ Design Requirements

- [x] **Design System** - Uses @strapi/design-system v1.x for Strapi v4
- [x] **UI Standards** - Follows Strapi UI/UX patterns
- [x] **Clarity & Consistency** - Professional, clear interface
- [x] **Settings Page** - Configuration through UI (no settings needed for this plugin)
- [x] **Injection Zones** - Not applicable (standalone plugin page)

## ✅ Technical Requirements

### General
- [x] **Public on npm** - Ready to publish
- [x] **README.md** - In English, explains install & usage
- [x] **No tracking** - Plugin does NOT track usage data
- [x] **Completely free** - No paywalls or premium features
- [x] **Strapi v4 compatible** - Tested with v4.13.1+
- [x] **peerDependency** - `@strapi/strapi: ^4.13.1` specified
- [x] **Design System v1** - Uses correct version for v4
- [x] **Readable code** - Well-organized, commented
- [x] **Issue instructions** - CONTRIBUTING.md provided

### Security
- [x] **No credential collection** - Plugin doesn't collect secrets
- [x] **No sensitive data** - All data stays local
- [x] **OWASP compliance** - Protected from common vulnerabilities
- [ ] **Dependencies audit** - Run `npm audit` and fix issues
- [x] **Protected endpoints** - API routes are safe

## 📝 Pre-Publication Steps

### 1. Update Repository URLs

Replace placeholders in:
- [ ] `package.json` - Update GitHub URLs
- [ ] `README.md` - Update all GitHub links
- [ ] `CONTRIBUTING.md` - Update GitHub links

### 2. Add Logo

- [ ] Create 160x160px logo (JPG or PNG)
- [ ] Save to `/assets/logo.png`
- [ ] Update README.md image reference
- [ ] Test image displays correctly

### 3. Run Security Audit

```bash
cd /path/to/plugin
npm audit
npm audit fix
```

- [ ] No high/critical vulnerabilities
- [ ] Document any remaining issues in README

### 4. Test Installation

```bash
# Create test Strapi project
npx create-strapi-app test-app --quickstart

# Install plugin
cd test-app
npm install ../path/to/plugin

# Configure
# Edit config/plugins.js

# Test
npm run develop
```

- [ ] Plugin installs successfully
- [ ] Plugin appears in admin sidebar
- [ ] All features work correctly
- [ ] No console errors
- [ ] UI renders properly

### 5. Update Version

```bash
npm version patch  # or minor, or major
```

- [ ] Version bumped in package.json
- [ ] Git tag created

## 📦 npm Publication

### First Time Setup

```bash
# Login to npm
npm login

# Verify account
npm whoami
```

### Publish

```bash
# Dry run (check what will be published)
npm publish --dry-run

# Actual publish
npm publish
```

- [ ] Published successfully
- [ ] Package visible on npm
- [ ] README displays correctly on npm

## 🏪 Strapi Market Submission

### Submit via Form

1. Go to: https://market.strapi.io/submit-plugin
2. Fill in:
   - [ ] Plugin name: Component Usage
   - [ ] npm package name: strapi-plugin-component-usage
   - [ ] Short description
   - [ ] Category: Developer Tools / Admin Panel
   - [ ] Repository URL
   - [ ] Logo/Image (160x160px)
   - [ ] Strapi version compatibility: v4.13.1+
   - [ ] Agree to Terms & Conditions

## ✅ Post-Publication

- [ ] Test installation from npm
  ```bash
  npm install strapi-plugin-component-usage
  ```
- [ ] Verify npm page displays correctly
- [ ] Check Strapi Market listing (may take time for approval)
- [ ] Share on:
  - [ ] Strapi Discord
  - [ ] Twitter/X
  - [ ] Dev.to
  - [ ] Your blog/website

## 📋 Maintenance

### Regular Updates

- [ ] Monitor GitHub issues
- [ ] Respond to community questions
- [ ] Keep dependencies updated
- [ ] Test with new Strapi versions
- [ ] Update documentation as needed

### Version Strategy

- **Patch (1.0.x)** - Bug fixes
- **Minor (1.x.0)** - New features, backward compatible
- **Major (x.0.0)** - Breaking changes

## 🔗 Important Links

- npm Package: https://www.npmjs.com/package/strapi-plugin-component-usage
- GitHub Repo: https://github.com/yourusername/strapi-plugin-component-usage
- Strapi Market: https://market.strapi.io/
- Submit Plugin: https://market.strapi.io/submit-plugin
- Design System: https://design-system-git-main-strapijs.vercel.app/

## ⚠️ Common Issues

### Publication Fails

- Check npm credentials: `npm whoami`
- Verify package name is available
- Check package.json for errors

### Market Rejection

- Review Design System compliance
- Ensure README is comprehensive
- Check security requirements
- Verify no tracking/data collection

---

**Ready to publish?** Double-check all items above! ✅
