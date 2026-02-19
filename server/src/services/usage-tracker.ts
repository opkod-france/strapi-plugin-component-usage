import {
  searchInObject,
  getScannableContentTypes,
  CONTENT_TYPE_UID,
} from '../utils';

export default ({ strapi }: { strapi: any }) => ({
  async initializeTracking() {
    strapi.log.info('[Component Usage] Initializing component tracking...');

    const components = Object.keys(strapi.components).map((uid: string) => {
      const component = strapi.components[uid];
      return {
        uid,
        category: component.category,
        displayName: component.info?.displayName || component.modelName,
      };
    });

    for (const component of components) {
      try {
        const existing = await strapi.documents(CONTENT_TYPE_UID).findMany({
          filters: { componentUid: component.uid },
          limit: 1,
        });

        if (!existing || existing.length === 0) {
          await strapi.documents(CONTENT_TYPE_UID).create({
            data: {
              componentUid: component.uid,
              componentName: component.displayName,
              componentCategory: component.category,
              usageCount: 0,
              usages: [],
              lastUpdated: new Date(),
            },
          });
        }
      } catch (error: any) {
        strapi.log.error(
          `[Component Usage] Error creating tracker for ${component.uid}: ${error.message}`
        );
      }
    }

    strapi.log.info('[Component Usage] Component tracking initialized');
  },

  async recalculateAllUsage() {
    strapi.log.info('[Component Usage] Recalculating all component usage...');

    const components = Object.keys(strapi.components);
    const contentTypes = getScannableContentTypes(strapi);

    for (const componentUid of components) {
      const usages: any[] = [];

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
                usages.push({
                  contentType: contentTypeName,
                  contentTypeUid,
                  entryId:
                    entry.documentId || entry.id?.toString() || 'N/A',
                  fieldPath,
                });
              });
            }
          }
        } catch (error: any) {
          strapi.log.warn(
            `[Component Usage] Could not scan ${contentTypeUid} for ${componentUid}: ${error.message}`
          );
        }
      }

      await this.updateComponentUsage(componentUid, usages);
    }

    strapi.log.info('[Component Usage] Recalculation complete');
  },

  async updateComponentUsage(componentUid: string, usages: any[] = []) {
    try {
      const existing = await strapi.documents(CONTENT_TYPE_UID).findMany({
        filters: { componentUid },
        limit: 1,
      });

      if (existing && existing.length > 0) {
        await strapi.documents(CONTENT_TYPE_UID).update({
          documentId: existing[0].documentId,
          data: {
            usageCount: usages.length,
            usages,
            lastUpdated: new Date(),
          },
        });
      }
    } catch (error: any) {
      strapi.log.error(
        `[Component Usage] Error updating tracker for ${componentUid}: ${error.message}`
      );
    }
  },

  async updateUsageForEntry(contentTypeUid: string, entry: any) {
    if (!entry) return;

    const components = Object.keys(strapi.components);

    for (const componentUid of components) {
      const matches = searchInObject(entry, componentUid);

      if (matches.length > 0) {
        await this.recalculateComponentUsage(componentUid);
      }
    }
  },

  async recalculateComponentUsage(componentUid: string) {
    const contentTypes = getScannableContentTypes(strapi);
    const usages: any[] = [];

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
              usages.push({
                contentType: contentTypeName,
                contentTypeUid,
                entryId:
                  entry.documentId || entry.id?.toString() || 'N/A',
                fieldPath,
              });
            });
          }
        }
      } catch (error: any) {
        strapi.log.warn(
          `[Component Usage] Could not scan ${contentTypeUid}: ${error.message}`
        );
      }
    }

    await this.updateComponentUsage(componentUid, usages);
  },

  async getAllTrackedComponents() {
    try {
      const trackers = await strapi.documents(CONTENT_TYPE_UID).findMany({
        limit: 1000,
      });

      return trackers || [];
    } catch (error: any) {
      strapi.log.error(
        '[Component Usage] Error fetching trackers:',
        error.message
      );
      return [];
    }
  },

  async getComponentUsage(componentUid: string) {
    try {
      const tracker = await strapi.documents(CONTENT_TYPE_UID).findMany({
        filters: { componentUid },
        limit: 1,
      });

      if (tracker && tracker.length > 0) {
        return tracker[0].usages || [];
      }

      return [];
    } catch (error: any) {
      strapi.log.error(
        `[Component Usage] Error fetching usage for ${componentUid}: ${error.message}`
      );
      return [];
    }
  },
});
