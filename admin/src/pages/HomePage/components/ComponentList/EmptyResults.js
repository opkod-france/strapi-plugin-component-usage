import React from 'react';
import { useIntl } from 'react-intl';
import { Box, EmptyStateLayout } from '@strapi/design-system';
import { EmotionUnhappy } from '@strapi/icons';
import getTrad from '../../../../utils/getTrad';

export const EmptyResults = () => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={8}>
      <EmptyStateLayout
        icon={<EmotionUnhappy width='6rem' height='6rem' />}
        content={formatMessage({ id: getTrad('EmptyResults.message'), defaultMessage: 'No components match your search' })}
      />
    </Box>
  );
};
