/**
 * Pure utility functions for filtering and grouping components
 */

/**
 * Filters components by search query
 * @param {Array} components - Array of component objects
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered components
 */
export const filterComponentsByQuery = (components, searchQuery) => {
  if (!searchQuery) return components;

  const lowerQuery = searchQuery.toLowerCase();
  return components.filter(
    (comp) =>
      comp.displayName.toLowerCase().includes(lowerQuery) ||
      comp.category.toLowerCase().includes(lowerQuery) ||
      comp.uid.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Groups components by category
 * @param {Array} components - Array of component objects
 * @returns {Object} Components grouped by category
 */
export const groupComponentsByCategory = (components) => {
  return components.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {});
};

/**
 * Gets sorted category names from grouped components
 * @param {Object} groupedComponents - Components grouped by category
 * @returns {Array} Sorted category names
 */
export const getSortedCategories = (groupedComponents) => {
  return Object.keys(groupedComponents).sort();
};
