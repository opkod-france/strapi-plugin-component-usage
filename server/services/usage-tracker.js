'use strict';

/**
 * Usage tracker service - manages component usage tracking collection
 */

const searchInObject = (obj, componentName, path = '') => {
  const results = [];

  if (!obj || typeof obj !== 'object') {
    return results;
  }

  if (obj.__component === componentName) {
    results.push(path || 'root');
  }

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayPath = `${currentPath}[${index}]`;
        results.push(...searchInObject(item, componentName, arrayPath));
      });
    } else if (value && typeof value === 'object') {
      results.push(...searchInObject(value, componentName, currentPath));
    }
  }

  return results;
};

module.exports = ({ strapi }) => ({
  /**
   * Initialize tracking for all components
   */
  async initializeTracking() {
    strapi.log.info('[Component Usage] Initializing component tracking...');

    const components = Object.keys(strapi.components).map((uid) => {
      const component = strapi.components[uid];
      return {
        uid,
        category: component.category,
        displayName: component.info?.displayName || component.modelName
      };
    });

    for (const component of components) {
      try {
        // Check if tracker already exists
        const existing = await strapi.entityService.findMany(
          'plugin::component-usage.component-usage-tracker',
          {
            filters: { componentUid: component.uid },
            limit: 1
          }
        );

        if (!existing || existing.length === 0) {
          // Create new tracker
          await strapi.entityService.create('plugin::component-usage.component-usage-tracker', {
            data: {
              componentUid: component.uid,
              componentName: component.displayName,
              componentCategory: component.category,
              usageCount: 0,
              usages: [],
              lastUpdated: new Date()
            }
          });
          strapi.log.info(`[Component Usage] Created tracker for ${component.uid}`);
        }
      } catch (error) {
        strapi.log.error(
          `[Component Usage] Error creating tracker for ${component.uid}:`,
          error.message
        );
      }
    }

    strapi.log.info('[Component Usage] Component tracking initialized');
  },

  /**
   * Recalculate usage for all components
   */
  async recalculateAllUsage() {
    strapi.log.info('[Component Usage] Recalculating all component usage...');

    const components = Object.keys(strapi.components);
    const contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
      return (
        uid.startsWith('api::') ||
        (uid.startsWith('plugin::') &&
          !uid.startsWith('plugin::upload.') &&
          !uid.startsWith('plugin::users-permissions.'))
      );
    });

    for (const componentUid of components) {
      const usages = [];

      for (const contentTypeUid of contentTypes) {
        try {
          const entries = await strapi.entityService.findMany(contentTypeUid, {
            populate: 'deep'
          });

          if (!entries || (Array.isArray(entries) && entries.length === 0)) {
            continue;
          }

          const entriesArray = Array.isArray(entries) ? entries : [entries];

          for (const entry of entriesArray) {
            const matches = searchInObject(entry, componentUid);

            if (matches.length > 0) {
              const contentTypeName = contentTypeUid.replace('api::', '').replace('plugin::', '');

              matches.forEach((fieldPath) => {
                usages.push({
                  contentType: contentTypeName,
                  contentTypeUid,
                  entryId: entry.id?.toString() || 'N/A',
                  fieldPath
                });
              });
            }
          }
        } catch (error) {
          strapi.log.warn(
            `[Component Usage] Could not scan ${contentTypeUid} for ${componentUid}: ${error.message}`
          );
        }
      }

      // Update tracker
      await this.updateComponentUsage(componentUid, usages);
    }

    strapi.log.info('[Component Usage] Recalculation complete');
  },

  /**
   * Update usage for a specific component
   */
  async updateComponentUsage(componentUid, usages = []) {
    try {
      const existing = await strapi.entityService.findMany(
        'plugin::component-usage.component-usage-tracker',
        {
          filters: { componentUid },
          limit: 1
        }
      );

      if (existing && existing.length > 0) {
        await strapi.entityService.update(
          'plugin::component-usage.component-usage-tracker',
          existing[0].id,
          {
            data: {
              usageCount: usages.length,
              usages,
              lastUpdated: new Date()
            }
          }
        );
      }
    } catch (error) {
      strapi.log.error(
        `[Component Usage] Error updating tracker for ${componentUid}:`,
        error.message
      );
    }
  },

  /**
   * Update usage when entry is created/updated
   */
  async updateUsageForEntry(contentTypeUid, entry) {
    if (!entry) return;

    const components = Object.keys(strapi.components);

    for (const componentUid of components) {
      const matches = searchInObject(entry, componentUid);

      if (matches.length > 0) {
        // Component is used in this entry - trigger recalculation
        await this.recalculateComponentUsage(componentUid);
      }
    }
  },

  /**
   * Recalculate usage for specific component (lighter than full recalc)
   */
  async recalculateComponentUsage(componentUid) {
    const contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
      return (
        uid.startsWith('api::') ||
        (uid.startsWith('plugin::') &&
          !uid.startsWith('plugin::upload.') &&
          !uid.startsWith('plugin::users-permissions.'))
      );
    });

    const usages = [];

    for (const contentTypeUid of contentTypes) {
      try {
        const entries = await strapi.entityService.findMany(contentTypeUid, {
          populate: 'deep'
        });

        if (!entries || (Array.isArray(entries) && entries.length === 0)) {
          continue;
        }

        const entriesArray = Array.isArray(entries) ? entries : [entries];

        for (const entry of entriesArray) {
          const matches = searchInObject(entry, componentUid);

          if (matches.length > 0) {
            const contentTypeName = contentTypeUid.replace('api::', '').replace('plugin::', '');

            matches.forEach((fieldPath) => {
              usages.push({
                contentType: contentTypeName,
                contentTypeUid,
                entryId: entry.id?.toString() || 'N/A',
                fieldPath
              });
            });
          }
        }
      } catch (error) {
        strapi.log.warn(`[Component Usage] Could not scan ${contentTypeUid}: ${error.message}`);
      }
    }

    await this.updateComponentUsage(componentUid, usages);
  },

  /**
   * Get all tracked components with usage data
   */
  async getAllTrackedComponents() {
    try {
      const trackers = await strapi.entityService.findMany(
        'plugin::component-usage.component-usage-tracker',
        {
          limit: -1 // Get all
        }
      );

      return trackers || [];
    } catch (error) {
      strapi.log.error('[Component Usage] Error fetching trackers:', error.message);
      return [];
    }
  },

  /**
   * Get usage for specific component
   */
  async getComponentUsage(componentUid) {
    try {
      const tracker = await strapi.entityService.findMany(
        'plugin::component-usage.component-usage-tracker',
        {
          filters: { componentUid },
          limit: 1
        }
      );

      if (tracker && tracker.length > 0) {
        return tracker[0].usages || [];
      }

      return [];
    } catch (error) {
      strapi.log.error(
        `[Component Usage] Error fetching usage for ${componentUid}:`,
        error.message
      );
      return [];
    }
  }
});
