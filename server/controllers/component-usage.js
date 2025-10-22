'use strict';

/**
 * Component usage controller
 */

module.exports = ({ strapi }) => ({
  /**
   * Get all components with usage statistics (SLOW - legacy)
   */
  async index(ctx) {
    try {
      const data = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .getAllComponentsWithUsage();

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get all components with usage COUNT from tracker (FAST - recommended)
   */
  async indexFast(ctx) {
    try {
      // Get tracked components
      const trackers = await strapi
        .plugin('component-usage')
        .service('usage-tracker')
        .getAllTrackedComponents();

      // Get all components metadata
      const allComponents = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .getAllComponents();

      // Merge tracker data with component metadata
      const data = allComponents.map((comp) => {
        const tracker = trackers.find((t) => t.componentUid === comp.uid);
        return {
          ...comp,
          usageCount: tracker?.usageCount || 0
        };
      });

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get specific component usage details from tracker (lazy loaded)
   */
  async show(ctx) {
    try {
      const { uid } = ctx.params;
      const usage = await strapi
        .plugin('component-usage')
        .service('usage-tracker')
        .getComponentUsage(uid);

      ctx.body = { data: usage };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get all components (without usage data - fastest)
   */
  async getComponents(ctx) {
    try {
      const data = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .getAllComponents();

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Delete a component
   */
  async delete(ctx) {
    try {
      const { uid } = ctx.params;

      if (!uid) {
        return ctx.badRequest('Component UID is required');
      }

      const result = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .deleteComponent(uid);

      // Delete tracker entry
      const tracker = await strapi.entityService.findMany(
        'plugin::component-usage.component-usage-tracker',
        {
          filters: { componentUid: uid },
          limit: 1
        }
      );

      if (tracker && tracker.length > 0) {
        await strapi.entityService.delete(
          'plugin::component-usage.component-usage-tracker',
          tracker[0].id
        );
      }

      ctx.body = { data: result };
    } catch (err) {
      strapi.log.error('Error deleting component:', err);

      if (err.message.includes('not found')) {
        return ctx.notFound(err.message);
      }

      if (err.message.includes('being used')) {
        return ctx.badRequest(err.message);
      }

      ctx.throw(500, err);
    }
  },

  /**
   * Clear cache and trigger recalculation
   */
  async clearCache(ctx) {
    try {
      // Clear old cache
      const cacheResult = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .clearCache();

      // Trigger recalculation
      const trackerService = strapi.plugin('component-usage').service('usage-tracker');
      await trackerService.recalculateAllUsage();

      ctx.body = {
        data: {
          ...cacheResult,
          message: 'Cache cleared and usage recalculated'
        }
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Manually trigger recalculation
   */
  async recalculate(ctx) {
    try {
      const trackerService = strapi.plugin('component-usage').service('usage-tracker');
      await trackerService.recalculateAllUsage();

      ctx.body = {
        data: {
          success: true,
          message: 'Component usage recalculated successfully'
        }
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get component relationships (which components use other components)
   */
  async getRelationships(ctx) {
    try {
      const { uid } = ctx.params;
      const relationshipsService = strapi
        .plugin('component-usage')
        .service('component-relationships');

      const data = relationshipsService.getComponentWithRelationships(uid);

      if (!data) {
        return ctx.notFound(`Component ${uid} not found`);
      }

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get full dependency graph for all components
   */
  async getDependencyGraph(ctx) {
    try {
      const relationshipsService = strapi
        .plugin('component-usage')
        .service('component-relationships');

      const data = relationshipsService.getDependencyGraph();

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get total usage including direct and indirect usage
   */
  async getTotalUsage(ctx) {
    try {
      const { uid } = ctx.params;
      const relationshipsService = strapi
        .plugin('component-usage')
        .service('component-relationships');

      const data = await relationshipsService.getTotalUsageCount(uid);

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
});
