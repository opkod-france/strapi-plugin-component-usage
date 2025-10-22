import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system';
import { ComponentSearch } from './ComponentSearch';
import { EmptyResults } from './EmptyResults';
import { CategoryGroup } from './CategoryGroup';
import {
  filterComponentsByQuery,
  groupComponentsByCategory,
  getSortedCategories
} from './utils/componentFilters';

const ComponentList = ({
  components,
  selectedComponent,
  onSelectComponent,
  searchQuery,
  onSearchChange
}) => {
  // Use pure functions with memoization for performance
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
      background='neutral0'
      hasRadius
      shadow='tableShadow'
      paddingTop={4}
      paddingBottom={4}
      style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <ComponentSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />

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

ComponentList.propTypes = {
  components: PropTypes.array.isRequired,
  selectedComponent: PropTypes.object,
  onSelectComponent: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export { ComponentList };
