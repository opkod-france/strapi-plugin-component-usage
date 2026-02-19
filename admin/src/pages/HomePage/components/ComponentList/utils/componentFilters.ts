export const filterComponentsByQuery = (components: any[], searchQuery: string) => {
  if (!searchQuery) return components;

  const lowerQuery = searchQuery.toLowerCase();
  return components.filter(
    (comp) =>
      comp.displayName.toLowerCase().includes(lowerQuery) ||
      comp.category.toLowerCase().includes(lowerQuery) ||
      comp.uid.toLowerCase().includes(lowerQuery)
  );
};

export const groupComponentsByCategory = (components: any[]) => {
  return components.reduce((acc: Record<string, any[]>, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {});
};

export const getSortedCategories = (
  groupedComponents: Record<string, any[]>
) => {
  return Object.keys(groupedComponents).sort();
};
