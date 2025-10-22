'use strict';

module.exports = async ({ strapi }) => {
  // Initialize component tracking on bootstrap
  setTimeout(async () => {
    try {
      const trackerService = strapi.plugin('component-usage').service('usage-tracker');

      // Initialize trackers for all components
      await trackerService.initializeTracking();

      // Perform initial full recalculation
      await trackerService.recalculateAllUsage();

      strapi.log.info('[Component Usage] Bootstrap complete');
    } catch (error) {
      strapi.log.error('[Component Usage] Bootstrap error:', error);
    }
  }, 5000); // Wait 5 seconds for Strapi to fully initialize

  // Register lifecycle hooks for all content types
  const contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
    return (
      uid.startsWith('api::') ||
      (uid.startsWith('plugin::') &&
        !uid.startsWith('plugin::upload.') &&
        !uid.startsWith('plugin::users-permissions.') &&
        !uid.startsWith('plugin::component-usage.'))
    );
  });

  for (const uid of contentTypes) {
    // After create
    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterCreate(event) {
        const { result } = event;
        try {
          const trackerService = strapi.plugin('component-usage').service('usage-tracker');
          await trackerService.updateUsageForEntry(uid, result);
        } catch (error) {
          strapi.log.warn(`[Component Usage] Lifecycle error in afterCreate: ${error.message}`);
        }
      }
    });

    // After update
    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterUpdate(event) {
        const { result } = event;
        try {
          const trackerService = strapi.plugin('component-usage').service('usage-tracker');
          await trackerService.updateUsageForEntry(uid, result);
        } catch (error) {
          strapi.log.warn(`[Component Usage] Lifecycle error in afterUpdate: ${error.message}`);
        }
      }
    });

    // After delete
    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterDelete(event) {
        try {
          // Trigger full recalculation after delete (to remove deleted entries from usage)
          const trackerService = strapi.plugin('component-usage').service('usage-tracker');

          // Recalculate all - this is necessary because we don't know which components were in the deleted entry
          setTimeout(async () => {
            await trackerService.recalculateAllUsage();
          }, 1000);
        } catch (error) {
          strapi.log.warn(`[Component Usage] Lifecycle error in afterDelete: ${error.message}`);
        }
      }
    });
  }

  strapi.log.info(
    `[Component Usage] Registered lifecycle hooks for ${contentTypes.length} content types`
  );
};
