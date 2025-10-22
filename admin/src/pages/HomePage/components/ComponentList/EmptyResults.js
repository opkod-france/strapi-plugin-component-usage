import React from 'react';
import { Box, EmptyStateLayout } from '@strapi/design-system';
import { EmotionUnhappy } from '@strapi/icons';

export const EmptyResults = () => {
  return (
    <Box padding={8}>
      <EmptyStateLayout
        icon={<EmotionUnhappy width='6rem' height='6rem' />}
        content='No components match your search'
      />
    </Box>
  );
};
