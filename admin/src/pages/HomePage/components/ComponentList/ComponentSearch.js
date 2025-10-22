import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Box, Searchbar } from '@strapi/design-system';
import getTrad from '../../../../utils/getTrad';

export const ComponentSearch = ({ searchQuery, onSearchChange }) => {
  const { formatMessage } = useIntl();

  return (
    <Box paddingLeft={4} paddingRight={4} paddingBottom={3}>
      <Searchbar
        name='searchbar'
        onClear={() => onSearchChange('')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        clearLabel={formatMessage({ id: getTrad('ComponentSearch.clearLabel'), defaultMessage: 'Clear' })}
        placeholder={formatMessage({ id: getTrad('ComponentSearch.placeholder'), defaultMessage: 'Search components...' })}
      >
        {formatMessage({ id: getTrad('ComponentSearch.label'), defaultMessage: 'Search components' })}
      </Searchbar>
    </Box>
  );
};

ComponentSearch.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};
