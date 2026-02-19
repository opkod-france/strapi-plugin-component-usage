import { CONTENT_TYPE_UID } from '../utils';

export default ({ strapi }: { strapi: any }) => ({
  async index(ctx: any) {
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

  async indexFast(ctx: any) {
    try {
      const trackers = await strapi
        .plugin('component-usage')
        .service('usage-tracker')
        .getAllTrackedComponents();

      const allComponents = await strapi
        .plugin('component-usage')
        .service('component-usage')
        .getAllComponents();

      const data = allComponents.map((comp: any) => {
        const tracker = trackers.find(
          (t: any) => t.componentUid === comp.uid
        );
        return {
          ...comp,
          usageCount: tracker?.usageCount || 0,
        };
      });

      ctx.body = { data };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async show(ctx: any) {
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

  async getComponents(ctx: any) {
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

  async delete(ctx: any) {
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
      const tracker = await strapi.documents(CONTENT_TYPE_UID).findMany({
        filters: { componentUid: uid },
        limit: 1,
      });

      if (tracker && tracker.length > 0) {
        await strapi.documents(CONTENT_TYPE_UID).delete({
          documentId: tracker[0].documentId,
        });
      }

      ctx.body = { data: result };
    } catch (err: any) {
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

  async clearCache(ctx: any) {
    try {
      const cacheResult = strapi
        .plugin('component-usage')
        .service('component-usage')
        .clearCache();

      const trackerService = strapi
        .plugin('component-usage')
        .service('usage-tracker');
      await trackerService.recalculateAllUsage();

      ctx.body = {
        data: {
          ...cacheResult,
          message: 'Cache cleared and usage recalculated',
        },
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async recalculate(ctx: any) {
    try {
      const trackerService = strapi
        .plugin('component-usage')
        .service('usage-tracker');
      await trackerService.recalculateAllUsage();

      ctx.body = {
        data: {
          success: true,
          message: 'Component usage recalculated successfully',
        },
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getRelationships(ctx: any) {
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

  async getDependencyGraph(ctx: any) {
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

  async getTotalUsage(ctx: any) {
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
  },
});
