'use strict';

/**
 * Component relationships service
 * Tracks which components use other components (nested component usage)
 */

/**
 * Analyzes component attributes to find nested component references
 * @param {Object} attributes - Component attributes
 * @returns {Array} Array of component UIDs that are used within this component
 */
const findNestedComponents = (attributes) => {
  const nestedComponents = [];

  if (!attributes || typeof attributes !== 'object') {
    return nestedComponents;
  }

  for (const [attrName, attrConfig] of Object.entries(attributes)) {
    // Check for direct component reference
    if (attrConfig.type === 'component' && attrConfig.component) {
      nestedComponents.push({
        componentUid: attrConfig.component,
        attributeName: attrName,
        repeatable: attrConfig.repeatable || false
      });
    }

    // Check for dynamic zone (can contain multiple components)
    if (attrConfig.type === 'dynamiczone' && attrConfig.components) {
      attrConfig.components.forEach((componentUid) => {
        nestedComponents.push({
          componentUid,
          attributeName: attrName,
          isDynamicZone: true
        });
      });
    }
  }

  return nestedComponents;
};

/**
 * Builds a dependency graph showing which components depend on which
 * @param {Object} components - All Strapi components
 * @returns {Object} Dependency graph with usedIn and uses relationships
 */
const buildDependencyGraph = (components) => {
  const graph = {};

  // Initialize graph for all components
  Object.keys(components).forEach((uid) => {
    graph[uid] = {
      uid,
      displayName: components[uid].info?.displayName || components[uid].modelName,
      category: components[uid].category,
      uses: [], // Components this component uses
      usedIn: [] // Components that use this component
    };
  });

  // Build relationships
  Object.keys(components).forEach((parentUid) => {
    const component = components[parentUid];
    const nestedComponents = findNestedComponents(component.attributes);

    nestedComponents.forEach(({ componentUid, attributeName, repeatable, isDynamicZone }) => {
      // Add to "uses" relationship for parent
      graph[parentUid].uses.push({
        componentUid,
        attributeName,
        repeatable,
        isDynamicZone
      });

      // Add to "usedIn" relationship for nested component
      if (graph[componentUid]) {
        graph[componentUid].usedIn.push({
          componentUid: parentUid,
          attributeName,
          repeatable,
          isDynamicZone
        });
      }
    });
  });

  return graph;
};

module.exports = ({ strapi }) => ({
  /**
   * Get components that are used within a specific component
   */
  getComponentDependencies(componentUid) {
    const component = strapi.components[componentUid];
    if (!component) {
      return [];
    }

    return findNestedComponents(component.attributes);
  },

  /**
   * Get components that use a specific component (inverse relationship)
   */
  getComponentUsedIn(componentUid) {
    const usedIn = [];

    Object.keys(strapi.components).forEach((parentUid) => {
      const parentComponent = strapi.components[parentUid];
      const nestedComponents = findNestedComponents(parentComponent.attributes);

      const isUsed = nestedComponents.some((nested) => nested.componentUid === componentUid);

      if (isUsed) {
        usedIn.push({
          componentUid: parentUid,
          displayName: parentComponent.info?.displayName || parentComponent.modelName,
          category: parentComponent.category,
          attributes: nestedComponents
            .filter((nested) => nested.componentUid === componentUid)
            .map((nested) => ({
              name: nested.attributeName,
              repeatable: nested.repeatable,
              isDynamicZone: nested.isDynamicZone
            }))
        });
      }
    });

    return usedIn;
  },

  /**
   * Get full dependency graph for all components
   */
  getDependencyGraph() {
    return buildDependencyGraph(strapi.components);
  },

  /**
   * Get enhanced component info with relationships
   */
  getComponentWithRelationships(componentUid) {
    const component = strapi.components[componentUid];
    if (!component) {
      return null;
    }

    return {
      uid: componentUid,
      displayName: component.info?.displayName || component.modelName,
      category: component.category,
      attributes: component.attributes,
      uses: this.getComponentDependencies(componentUid),
      usedIn: this.getComponentUsedIn(componentUid)
    };
  },

  /**
   * Get total usage count including both direct and indirect usage
   * This combines:
   * 1. Direct usage in content (from component-usage service)
   * 2. Indirect usage through other components
   */
  async getTotalUsageCount(componentUid) {
    const componentUsageService = strapi.plugin('component-usage').service('component-usage');

    // Get direct usage from content
    const directUsageCount = await componentUsageService.getComponentUsageCount(componentUid);

    // Get indirect usage (used in other components)
    const usedInComponents = this.getComponentUsedIn(componentUid);

    return {
      directUsage: directUsageCount,
      indirectUsage: usedInComponents.length,
      totalUsage: directUsageCount + usedInComponents.length,
      usedInComponents
    };
  }
});
