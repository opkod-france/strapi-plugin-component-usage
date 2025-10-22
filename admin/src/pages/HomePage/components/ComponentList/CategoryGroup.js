import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system';
import { CategoryHeader } from './CategoryHeader';
import { ComponentListItem } from './ComponentListItem';

export const CategoryGroup = ({ category, components, selectedComponent, onSelectComponent }) => {
  return (
    <Box paddingBottom={2}>
      <CategoryHeader category={category} />
      {components.map((component) => (
        <ComponentListItem
          key={component.uid}
          component={component}
          selectedComponent={selectedComponent}
          onSelectComponent={onSelectComponent}
        />
      ))}
    </Box>
  );
};

CategoryGroup.propTypes = {
  category: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  selectedComponent: PropTypes.object,
  onSelectComponent: PropTypes.func.isRequired
};
