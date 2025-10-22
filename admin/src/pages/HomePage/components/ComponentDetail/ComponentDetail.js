import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Box, Typography, Button, Flex, EmptyStateLayout } from '@strapi/design-system';
import { Trash, Puzzle } from '@strapi/icons';
import { request, useNotification } from '@strapi/helper-plugin';
import { pluginId } from '../../../../utils/constants';
import getTranslation from '../../../../utils/getTranslation';
import { UsageSection } from './UsageSection';
import { DeleteDialog } from './DeleteDialog';
import { ComponentRelationships } from './ComponentRelationships';

const ComponentDetail = ({ component, onDelete, onRefresh }) => {
  const { formatMessage } = useIntl();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [relationships, setRelationships] = useState(null);
  const [loadingRelationships, setLoadingRelationships] = useState(false);
  const toggleNotification = useNotification();

  // Lazy load usage details and relationships when component changes
  useEffect(() => {
    if (component) {
      if (component.usageCount > 0) {
        fetchUsageDetails();
      } else {
        setUsage([]);
      }
      fetchRelationships();
    }
  }, [component?.uid]);

  const fetchUsageDetails = async () => {
    if (!component) return;

    try {
      setLoadingUsage(true);
      const data = await request(
        `/${pluginId}/components/${encodeURIComponent(component.uid)}/usage`,
        {
          method: 'GET'
        }
      );
      setUsage(data.data || []);
    } catch (err) {
      console.error('Error fetching usage details:', err);
      toggleNotification({
        type: 'warning',
        message: 'Failed to load usage details'
      });
      setUsage([]);
    } finally {
      setLoadingUsage(false);
    }
  };

  const fetchRelationships = async () => {
    if (!component) return;

    try {
      setLoadingRelationships(true);
      const data = await request(
        `/${pluginId}/components/${encodeURIComponent(component.uid)}/relationships`,
        {
          method: 'GET'
        }
      );
      setRelationships(data.data || null);
    } catch (err) {
      console.error('Error fetching relationships:', err);
      setRelationships(null);
    } finally {
      setLoadingRelationships(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await request(`/${pluginId}/components/${encodeURIComponent(component.uid)}`, {
        method: 'DELETE'
      });

      toggleNotification({
        type: 'success',
        message: `Component "${component.displayName}" deleted successfully`
      });

      setIsDeleteDialogOpen(false);
      onDelete();
      onRefresh();
    } catch (err) {
      console.error('Error deleting component:', err);
      toggleNotification({
        type: 'warning',
        message:
          err?.response?.data?.error?.message || 'Failed to delete component. It may be in use.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!component) {
    return (
      <Box
        background='neutral0'
        hasRadius
        shadow='tableShadow'
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <EmptyStateLayout
          icon={<Puzzle width='10rem' height='10rem' />}
          content={formatMessage({ id: getTranslation('ComponentDetail.emptyState'), defaultMessage: 'Choose a component from the list to view its details and usage' })}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        background='neutral0'
        hasRadius
        shadow='tableShadow'
        style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        {/* Header */}
        <Box padding={6} borderBottom='1px solid' borderColor='neutral200'>
          <Flex justifyContent='space-between' alignItems='flex-start'>
            <Box>
              <Typography variant='beta' as='h2'>
                {`${component.category}/${component.displayName}`}
              </Typography>
              <Typography variant='omega' textColor='neutral600' paddingTop={1}>
                {component.uid}
              </Typography>
            </Box>
            <Button
              variant='danger-light'
              startIcon={<Trash />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {formatMessage({ id: getTranslation('ComponentDetail.deleteButton'), defaultMessage: 'Delete Component' })}
            </Button>
          </Flex>
        </Box>

        {/* Usage Details */}
        <UsageSection
          component={component}
          usage={usage}
          loadingUsage={loadingUsage}
          onRefresh={fetchUsageDetails}
        />

        {/* Component Relationships */}
        {!loadingRelationships && <ComponentRelationships relationships={relationships} />}
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        component={component}
        isDeleting={isDeleting}
      />
    </>
  );
};

ComponentDetail.propTypes = {
  component: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    usageCount: PropTypes.number.isRequired,
    attributes: PropTypes.object
  }),
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export { ComponentDetail };
