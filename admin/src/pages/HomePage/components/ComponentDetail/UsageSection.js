import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Box, Typography, Button, Flex, Loader, EmptyStateLayout } from '@strapi/design-system';
import { Refresh, Information } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';
import { UsageTable } from './UsageTable';

const UsageSection = ({ component, usage, loadingUsage, onRefresh }) => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={6}>
      <Flex justifyContent='space-between' alignItems='center' paddingBottom={4}>
        <Typography variant='delta'>
          {formatMessage({ id: getTranslation('UsageSection.title'), defaultMessage: 'Usage Details' })}
        </Typography>
        {component.usageCount > 0 && (
          <Button
            size='S'
            variant='secondary'
            startIcon={<Refresh />}
            onClick={onRefresh}
            loading={loadingUsage}
          >
            {formatMessage({ id: getTranslation('UsageSection.refresh'), defaultMessage: 'Refresh' })}
          </Button>
        )}
      </Flex>

      {loadingUsage ? (
        <Box padding={8}>
          <Flex justifyContent='center'>
            <Loader small>
              {formatMessage({ id: getTranslation('UsageSection.loading'), defaultMessage: 'Loading usage details...' })}
            </Loader>
          </Flex>
        </Box>
      ) : component.usageCount === 0 ? (
        <EmptyStateLayout
          icon={<Information width='64px' height='64px' />}
          content={formatMessage({ id: getTranslation('UsageSection.emptyState'), defaultMessage: 'This component is not used in any content' })}
        />
      ) : (
        <UsageTable usage={usage} />
      )}
    </Box>
  );
};

UsageSection.propTypes = {
  component: PropTypes.shape({
    usageCount: PropTypes.number.isRequired
  }).isRequired,
  usage: PropTypes.array,
  loadingUsage: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export { UsageSection };
