import { searchInObject, getScannableContentTypes, CONTENT_TYPE_UID } from '../utils';

// Simple in-memory cache
const cache = {
  data: new Map<string, any>(),
  timestamps: new Map<string, number>(),
  TTL: 5 * 60 * 1000, // 5 minutes

  set(key: string, value: any) {
    this.data.set(key, value);
    this.timestamps.set(key, Date.now());
  },

  get(key: string) {
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
  },
};

export default ({ strapi }: { strapi: any }) => ({
  async getAllComponents() {
    const components = Object.keys(strapi.components).map((uid: string) => {
      const component = strapi.components[uid];
      return {
        uid,
        category: component.category,
        displayName: component.info?.displayName || component.modelName,
        icon: component.info?.icon,
        attributes: component.attributes,
      };
    });

    return components;
  },

  async getComponentUsageCount(componentUid: string) {
    const cacheKey = `count:${componentUid}`;
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    let totalCount = 0;
    const contentTypes = getScannableContentTypes(strapi);

    for (const contentTypeUid of contentTypes) {
      try {
        const entries = await strapi.documents(contentTypeUid).findMany({
          populate: '*',
          status: 'draft',
        });

        if (!entries || entries.length === 0) {
          continue;
        }

        for (const entry of entries) {
          const matches = searchInObject(entry, componentUid);
          totalCount += matches.length;
        }
      } catch (error: any) {
        strapi.log.warn(
          `Could not count usage for ${contentTypeUid}: ${error.message}`
        );
      }
    }

    cache.set(cacheKey, totalCount);
    return totalCount;
  },

  async getComponentUsage(componentUid: string) {
    const cacheKey = `usage:${componentUid}`;
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const contentTypes = getScannableContentTypes(strapi);
    const usageData: any[] = [];

    for (const contentTypeUid of contentTypes) {
      try {
        const entries = await strapi.documents(contentTypeUid).findMany({
          populate: '*',
          status: 'draft',
        });

        if (!entries || entries.length === 0) {
          continue;
        }

        for (const entry of entries) {
          const matches = searchInObject(entry, componentUid);

          if (matches.length > 0) {
            const contentTypeName = contentTypeUid
              .replace('api::', '')
              .replace('plugin::', '');

            matches.forEach((fieldPath) => {
              usageData.push({
                contentType: contentTypeName,
                contentTypeUid,
                entryId: entry.documentId || entry.id?.toString() || 'N/A',
                fieldPath,
              });
            });
          }
        }
      } catch (error: any) {
        strapi.log.warn(
          `Could not fetch entries for ${contentTypeUid}: ${error.message}`
        );
      }
    }

    cache.set(cacheKey, usageData);
    return usageData;
  },

  async getAllComponentsWithUsage() {
    const components = await this.getAllComponents();

    const componentsWithUsage = await Promise.all(
      components.map(async (component: any) => {
        const usage = await this.getComponentUsage(component.uid);
        return {
          ...component,
          usageCount: usage.length,
          usage,
        };
      })
    );

    return componentsWithUsage;
  },

  async deleteComponent(componentUid: string) {
    const fs = require('fs');

    if (!strapi.components[componentUid]) {
      throw new Error(`Component ${componentUid} not found`);
    }

    const usageCount = await this.getComponentUsageCount(componentUid);
    if (usageCount > 0) {
      throw new Error(
        `Cannot delete component ${componentUid}. It is being used in ${usageCount} place(s).`
      );
    }

    const component = strapi.components[componentUid];
    const componentPath = component.__filename__;

    if (!componentPath) {
      throw new Error(
        `Could not find file path for component ${componentUid}`
      );
    }

    try {
      if (fs.existsSync(componentPath)) {
        fs.unlinkSync(componentPath);
        strapi.log.info(`Deleted component file: ${componentPath}`);
      }

      delete strapi.components[componentUid];
      cache.clear();

      return {
        success: true,
        message: `Component ${componentUid} deleted successfully`,
      };
    } catch (error: any) {
      strapi.log.error(`Error deleting component file: ${error.message}`);
      throw new Error(`Failed to delete component file: ${error.message}`);
    }
  },

  clearCache() {
    cache.clear();
    return { success: true, message: 'Cache cleared' };
  },
});
