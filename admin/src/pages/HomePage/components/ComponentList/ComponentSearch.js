import React from 'react';
import PropTypes from 'prop-types';
import { Box, Searchbar } from '@strapi/design-system';

export const ComponentSearch = ({ searchQuery, onSearchChange }) => {
  return (
    <Box paddingLeft={4} paddingRight={4} paddingBottom={3}>
      <Searchbar
        name='searchbar'
        onClear={() => onSearchChange('')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        clearLabel='Clear'
        placeholder='Search components...'
      >
        Search components
      </Searchbar>
    </Box>
  );
};

ComponentSearch.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};
