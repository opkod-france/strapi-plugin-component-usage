/**
 * Pure function to determine badge variant based on usage count
 * @param {number} count - Usage count
 * @returns {string} Badge variant name
 */
export const getBadgeVariant = (count) => {
  if (count === 0) return 'secondary';
  if (count < 5) return 'success';
  if (count < 10) return 'warning';
  return 'danger';
};

/**
 * Checks if a component is selected
 * @param {Object|null} selectedComponent - Currently selected component
 * @param {string} componentUid - UID of component to check
 * @returns {boolean} Whether the component is selected
 */
export const isComponentSelected = (selectedComponent, componentUid) => {
  return selectedComponent?.uid === componentUid;
};
