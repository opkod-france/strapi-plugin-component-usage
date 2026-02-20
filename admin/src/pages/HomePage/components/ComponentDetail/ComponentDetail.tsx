import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Box, Typography, Button, Flex, EmptyStateLayout } from '@strapi/design-system';
import { Trash, PuzzlePiece as Puzzle } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../../../../pluginId';
import getTranslation from '../../../../utils/getTranslation';
import { UsageSection } from './UsageSection';
import { DeleteDialog } from './DeleteDialog';
import { ComponentRelationships } from './ComponentRelationships';

interface ComponentDetailProps {
  component: any;
  onDelete: () => void;
  onRefresh: () => void;
}

const ComponentDetail = ({ component, onDelete, onRefresh }: ComponentDetailProps) => {
  const { formatMessage } = useIntl();
  const { get, del } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usage, setUsage] = useState<any[] | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [relationships, setRelationships] = useState<any>(null);
  const [loadingRelationships, setLoadingRelationships] = useState(false);

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
      const { data } = await get(
        `/${PLUGIN_ID}/components/${encodeURIComponent(component.uid)}/usage`
      );
      setUsage(data.data || []);
    } catch (err) {
      console.error('Error fetching usage details:', err);
      toggleNotification({
        type: 'warning',
        message: 'Failed to load usage details',
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
      const { data } = await get(
        `/${PLUGIN_ID}/components/${encodeURIComponent(component.uid)}/relationships`
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
      await del(
        `/${PLUGIN_ID}/components/${encodeURIComponent(component.uid)}`
      );

      toggleNotification({
        type: 'success',
        message: `Component "${component.displayName}" deleted successfully`,
      });

      setIsDeleteDialogOpen(false);
      onDelete();
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting component:', err);
      toggleNotification({
        type: 'warning',
        message:
          err?.response?.data?.error?.message ||
          'Failed to delete component. It may be in use.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!component) {
    return (
      <Box
        background="neutral0"
        hasRadius
        shadow="tableShadow"
        height="calc(100vh - 200px)"
      >
        <EmptyStateLayout
          icon={<Puzzle width="10rem" height="10rem" />}
          content={formatMessage({
            id: getTranslation('ComponentDetail.emptyState'),
            defaultMessage:
              'Choose a component from the list to view its details and usage',
          })}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        background="neutral0"
        hasRadius
        shadow="tableShadow"
        overflow="auto"
        height="calc(100vh - 200px)"
      >
        {/* Header */}
        <Box padding={6} borderColor="neutral200">
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="beta" tag="h2">
                {`${component.category}/${component.displayName}`}
              </Typography>
              <Typography variant="omega" textColor="neutral600">
                {component.uid}
              </Typography>
            </Box>
            <Button
              variant="danger-light"
              startIcon={<Trash />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {formatMessage({
                id: getTranslation('ComponentDetail.deleteButton'),
                defaultMessage: 'Delete Component',
              })}
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
        {!loadingRelationships && (
          <ComponentRelationships relationships={relationships} />
        )}
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

export { ComponentDetail };
