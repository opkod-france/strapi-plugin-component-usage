interface NestedComponent {
  componentUid: string;
  attributeName: string;
  repeatable?: boolean;
  isDynamicZone?: boolean;
}

const findNestedComponents = (attributes: any): NestedComponent[] => {
  const nestedComponents: NestedComponent[] = [];

  if (!attributes || typeof attributes !== 'object') {
    return nestedComponents;
  }

  for (const [attrName, attrConfig] of Object.entries(attributes) as [
    string,
    any,
  ][]) {
    if (attrConfig.type === 'component' && attrConfig.component) {
      nestedComponents.push({
        componentUid: attrConfig.component,
        attributeName: attrName,
        repeatable: attrConfig.repeatable || false,
      });
    }

    if (attrConfig.type === 'dynamiczone' && attrConfig.components) {
      attrConfig.components.forEach((componentUid: string) => {
        nestedComponents.push({
          componentUid,
          attributeName: attrName,
          isDynamicZone: true,
        });
      });
    }
  }

  return nestedComponents;
};

const buildDependencyGraph = (components: any) => {
  const graph: Record<string, any> = {};

  Object.keys(components).forEach((uid) => {
    graph[uid] = {
      uid,
      displayName:
        components[uid].info?.displayName || components[uid].modelName,
      category: components[uid].category,
      uses: [],
      usedIn: [],
    };
  });

  Object.keys(components).forEach((parentUid) => {
    const component = components[parentUid];
    const nestedComponents = findNestedComponents(component.attributes);

    nestedComponents.forEach(
      ({ componentUid, attributeName, repeatable, isDynamicZone }) => {
        graph[parentUid].uses.push({
          componentUid,
          attributeName,
          repeatable,
          isDynamicZone,
        });

        if (graph[componentUid]) {
          graph[componentUid].usedIn.push({
            componentUid: parentUid,
            attributeName,
            repeatable,
            isDynamicZone,
          });
        }
      }
    );
  });

  return graph;
};

export default ({ strapi }: { strapi: any }) => ({
  getComponentDependencies(componentUid: string) {
    const component = strapi.components[componentUid];
    if (!component) {
      return [];
    }

    return findNestedComponents(component.attributes);
  },

  getComponentUsedIn(componentUid: string) {
    const usedIn: any[] = [];

    Object.keys(strapi.components).forEach((parentUid: string) => {
      const parentComponent = strapi.components[parentUid];
      const nestedComponents = findNestedComponents(
        parentComponent.attributes
      );

      const isUsed = nestedComponents.some(
        (nested) => nested.componentUid === componentUid
      );

      if (isUsed) {
        usedIn.push({
          componentUid: parentUid,
          displayName:
            parentComponent.info?.displayName || parentComponent.modelName,
          category: parentComponent.category,
          attributes: nestedComponents
            .filter((nested) => nested.componentUid === componentUid)
            .map((nested) => ({
              name: nested.attributeName,
              repeatable: nested.repeatable,
              isDynamicZone: nested.isDynamicZone,
            })),
        });
      }
    });

    return usedIn;
  },

  getDependencyGraph() {
    return buildDependencyGraph(strapi.components);
  },

  getComponentWithRelationships(componentUid: string) {
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
      usedIn: this.getComponentUsedIn(componentUid),
    };
  },

  async getTotalUsageCount(componentUid: string) {
    const componentUsageService = strapi
      .plugin('component-usage')
      .service('component-usage');

    const directUsageCount =
      await componentUsageService.getComponentUsageCount(componentUid);
    const usedInComponents = this.getComponentUsedIn(componentUid);

    return {
      directUsage: directUsageCount,
      indirectUsage: usedInComponents.length,
      totalUsage: directUsageCount + usedInComponents.length,
      usedInComponents,
    };
  },
});
