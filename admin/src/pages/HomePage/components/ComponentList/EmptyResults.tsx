import { useIntl } from 'react-intl';
import { Box, EmptyStateLayout } from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';

export const EmptyResults = () => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={8}>
      <EmptyStateLayout
        icon={<WarningCircle width="6rem" height="6rem" />}
        content={formatMessage({
          id: getTranslation('EmptyResults.message'),
          defaultMessage: 'No components match your search',
        })}
      />
    </Box>
  );
};
