export const bootstrap = async ({ strapi }: { strapi: any }) => {
  // Initialize component tracking on bootstrap
  setTimeout(async () => {
    try {
      const trackerService = strapi
        .plugin('component-usage')
        .service('usage-tracker');

      await trackerService.initializeTracking();
      await trackerService.recalculateAllUsage();

      strapi.log.info('[Component Usage] Bootstrap complete');
    } catch (error: any) {
      strapi.log.error('[Component Usage] Bootstrap error:', error);
    }
  }, 5000);

  // Register lifecycle hooks for all content types
  const contentTypes = Object.keys(strapi.contentTypes).filter(
    (uid: string) => {
      return (
        uid.startsWith('api::') ||
        (uid.startsWith('plugin::') &&
          !uid.startsWith('plugin::upload.') &&
          !uid.startsWith('plugin::users-permissions.') &&
          !uid.startsWith('plugin::component-usage.'))
      );
    }
  );

  for (const uid of contentTypes) {
    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterCreate(event: any) {
        const { result } = event;
        try {
          const trackerService = strapi
            .plugin('component-usage')
            .service('usage-tracker');
          await trackerService.updateUsageForEntry(uid, result);
        } catch (error: any) {
          strapi.log.warn(
            `[Component Usage] Lifecycle error in afterCreate: ${error.message}`
          );
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterUpdate(event: any) {
        const { result } = event;
        try {
          const trackerService = strapi
            .plugin('component-usage')
            .service('usage-tracker');
          await trackerService.updateUsageForEntry(uid, result);
        } catch (error: any) {
          strapi.log.warn(
            `[Component Usage] Lifecycle error in afterUpdate: ${error.message}`
          );
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterDelete() {
        try {
          const trackerService = strapi
            .plugin('component-usage')
            .service('usage-tracker');
          setTimeout(async () => {
            await trackerService.recalculateAllUsage();
          }, 1000);
        } catch (error: any) {
          strapi.log.warn(
            `[Component Usage] Lifecycle error in afterDelete: ${error.message}`
          );
        }
      },
    });
  }

  strapi.log.info(
    `[Component Usage] Registered lifecycle hooks for ${contentTypes.length} content types`
  );
};
