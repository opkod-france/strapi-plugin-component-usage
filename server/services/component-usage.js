'use strict';

/**
 * Component usage service
 */

const searchInObject = (obj, componentName, path = '') => {
  const results = [];

  if (!obj || typeof obj !== 'object') {
    return results;
  }

  // Check if current object has __component property matching our search
  if (obj.__component === componentName) {
    results.push(path || 'root');
  }

  // Recursively search through object properties
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

// Simple in-memory cache
const cache = {
  data: new Map(),
  timestamps: new Map(),
  TTL: 5 * 60 * 1000, // 5 minutes

  set(key, value) {
    this.data.set(key, value);
    this.timestamps.set(key, Date.now());
  },

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.TTL) {
      this.data.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.data.get(key);
  },

  clear() {
    this.data.clear();
    this.timestamps.clear();
  }
};

module.exports = ({ strapi }) => ({
  /**
   * Get all components (fast - no usage data)
   */
  async getAllComponents() {
    const components = Object.keys(strapi.components).map((uid) => {
      const component = strapi.components[uid];
      return {
        uid,
        category: component.category,
        displayName: component.info?.displayName || component.modelName,
        icon: component.info?.icon,
        attributes: component.attributes
      };
    });

    return components;
  },

  /**
   * Get component usage count only (optimized - uses database query)
   */
  async getComponentUsageCount(componentUid) {
    const cacheKey = `count:${componentUid}`;
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    let totalCount = 0;

    const contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
      return (
        uid.startsWith('api::') ||
        (uid.startsWith('plugin::') &&
          !uid.startsWith('plugin::upload.') &&
          !uid.startsWith('plugin::users-permissions.'))
      );
    });

    for (const contentTypeUid of contentTypes) {
      try {
        // Use entity service with deep populate
        const entries = await strapi.entityService.findMany(contentTypeUid, {
          populate: 'deep'
        });

        if (!entries || (Array.isArray(entries) && entries.length === 0)) {
          continue;
        }

        const entriesArray = Array.isArray(entries) ? entries : [entries];

        for (const entry of entriesArray) {
          const matches = searchInObject(entry, componentUid);
          totalCount += matches.length;
        }
      } catch (error) {
        strapi.log.warn(`Could not count usage for ${contentTypeUid}: ${error.message}`);
      }
    }

    cache.set(cacheKey, totalCount);
    return totalCount;
  },

  /**
   * Get component usage across all content types (detailed)
   */
  async getComponentUsage(componentUid) {
    const cacheKey = `usage:${componentUid}`;
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
      return (
        uid.startsWith('api::') ||
        (uid.startsWith('plugin::') &&
          !uid.startsWith('plugin::upload.') &&
          !uid.startsWith('plugin::users-permissions.'))
      );
    });

    const usageData = [];

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
              usageData.push({
                contentType: contentTypeName,
                contentTypeUid,
                entryId: entry.id?.toString() || 'N/A',
                fieldPath
              });
            });
          }
        }
      } catch (error) {
        strapi.log.warn(`Could not fetch entries for ${contentTypeUid}: ${error.message}`);
      }
    }

    cache.set(cacheKey, usageData);
    return usageData;
  },

  /**
   * Get all components with usage count only (FAST)
   */
  async getAllComponentsWithUsageCount() {
    const components = await this.getAllComponents();

    // Get usage counts in parallel for better performance
    const componentsWithCount = await Promise.all(
      components.map(async (component) => {
        const usageCount = await this.getComponentUsageCount(component.uid);
        return {
          ...component,
          usageCount
        };
      })
    );

    return componentsWithCount;
  },

  /**
   * Get all components with their usage count (OLD - slow method)
   * Kept for backward compatibility
   */
  async getAllComponentsWithUsage() {
    const components = await this.getAllComponents();

    const componentsWithUsage = await Promise.all(
      components.map(async (component) => {
        const usage = await this.getComponentUsage(component.uid);
        return {
          ...component,
          usageCount: usage.length,
          usage
        };
      })
    );

    return componentsWithUsage;
  },

  /**
   * Delete a component
   */
  async deleteComponent(componentUid) {
    const fs = require('fs');
    const path = require('path');

    // Check if component exists
    if (!strapi.components[componentUid]) {
      throw new Error(`Component ${componentUid} not found`);
    }

    // Check usage before deleting (use fast count method)
    const usageCount = await this.getComponentUsageCount(componentUid);
    if (usageCount > 0) {
      throw new Error(
        `Cannot delete component ${componentUid}. It is being used in ${usageCount} place(s).`
      );
    }

    // Get component file path
    const component = strapi.components[componentUid];
    const componentPath = component.__filename__;

    if (!componentPath) {
      throw new Error(`Could not find file path for component ${componentUid}`);
    }

    // Delete the component file
    try {
      if (fs.existsSync(componentPath)) {
        fs.unlinkSync(componentPath);
        strapi.log.info(`Deleted component file: ${componentPath}`);
      }

      // Remove from strapi.components
      delete strapi.components[componentUid];

      // Clear cache
      cache.clear();

      return { success: true, message: `Component ${componentUid} deleted successfully` };
    } catch (error) {
      strapi.log.error(`Error deleting component file: ${error.message}`);
      throw new Error(`Failed to delete component file: ${error.message}`);
    }
  },

  /**
   * Clear cache manually
   */
  clearCache() {
    cache.clear();
    return { success: true, message: 'Cache cleared' };
  }
});
