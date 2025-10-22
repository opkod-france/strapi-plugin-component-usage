import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Flex, Loader, EmptyStateLayout } from '@strapi/design-system';
import { Refresh, Information } from '@strapi/icons';
import { UsageTable } from './UsageTable';

const UsageSection = ({ component, usage, loadingUsage, onRefresh }) => {
  return (
    <Box padding={6}>
      <Flex justifyContent='space-between' alignItems='center' paddingBottom={4}>
        <Typography variant='delta'>Usage Details</Typography>
        {component.usageCount > 0 && (
          <Button
            size='S'
            variant='secondary'
            startIcon={<Refresh />}
            onClick={onRefresh}
            loading={loadingUsage}
          >
            Refresh
          </Button>
        )}
      </Flex>

      {loadingUsage ? (
        <Box padding={8}>
          <Flex justifyContent='center'>
            <Loader small>Loading usage details...</Loader>
          </Flex>
        </Box>
      ) : component.usageCount === 0 ? (
        <EmptyStateLayout
          icon={<Information width='64px' height='64px' />}
          content='This component is not used in any content'
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
