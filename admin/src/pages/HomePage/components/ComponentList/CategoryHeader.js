import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@strapi/design-system';

export const CategoryHeader = ({ category }) => {
  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      paddingTop={2}
      paddingBottom={2}
      background='neutral100'
    >
      <Typography variant='sigma' textColor='neutral600'>
        {category.toUpperCase()}
      </Typography>
    </Box>
  );
};

CategoryHeader.propTypes = {
  category: PropTypes.string.isRequired
};
