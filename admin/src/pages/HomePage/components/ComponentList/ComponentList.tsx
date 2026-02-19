import { useMemo } from 'react';
import { Box } from '@strapi/design-system';
import { ComponentSearch } from './ComponentSearch';
import { EmptyResults } from './EmptyResults';
import { CategoryGroup } from './CategoryGroup';
import {
  filterComponentsByQuery,
  groupComponentsByCategory,
  getSortedCategories,
} from './utils/componentFilters';

interface ComponentListProps {
  components: any[];
  selectedComponent: any;
  onSelectComponent: (component: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ComponentList = ({
  components,
  selectedComponent,
  onSelectComponent,
  searchQuery,
  onSearchChange,
}: ComponentListProps) => {
  const filteredComponents = useMemo(
    () => filterComponentsByQuery(components, searchQuery),
    [components, searchQuery]
  );

  const groupedComponents = useMemo(
    () => groupComponentsByCategory(filteredComponents),
    [filteredComponents]
  );

  const sortedCategories = useMemo(
    () => getSortedCategories(groupedComponents),
    [groupedComponents]
  );

  const hasNoResults = sortedCategories.length === 0;

  return (
    <Box
      background="neutral0"
      hasRadius
      shadow="tableShadow"
      paddingTop={4}
      paddingBottom={4}
      overflow="auto"
      height="calc(100vh - 200px)"
    >
      <ComponentSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {hasNoResults ? (
        <EmptyResults />
      ) : (
        sortedCategories.map((category) => (
          <CategoryGroup
            key={category}
            category={category}
            components={groupedComponents[category]}
            selectedComponent={selectedComponent}
            onSelectComponent={onSelectComponent}
          />
        ))
      )}
    </Box>
  );
};

export { ComponentList };
