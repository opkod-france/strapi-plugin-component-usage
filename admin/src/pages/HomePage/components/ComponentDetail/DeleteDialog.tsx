import { useIntl } from 'react-intl';
import {
  Button,
  Dialog,
  Typography,
  Flex,
  Box,
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  component: { displayName: string; usageCount: number } | null;
  isDeleting: boolean;
}

const DeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  component,
  isDeleting,
}: DeleteDialogProps) => {
  const { formatMessage } = useIntl();

  if (!component || !isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Content>
        <Dialog.Header>
          {formatMessage({
            id: getTranslation('DeleteDialog.title'),
            defaultMessage: 'Confirm Deletion',
          })}
        </Dialog.Header>
        <Dialog.Body icon={<Trash />}>
          <Flex direction="column" alignItems="stretch" gap={2}>
            <Typography>
              {formatMessage(
                {
                  id: getTranslation('DeleteDialog.message'),
                  defaultMessage:
                    'Are you sure you want to delete the component "{name}"?',
                },
                { name: component.displayName }
              )}
            </Typography>
            {component.usageCount > 0 && (
              <Box padding={3} background="danger100" hasRadius>
                <Typography textColor="danger700">
                  {formatMessage(
                    {
                      id: getTranslation('DeleteDialog.warning'),
                      defaultMessage:
                        'Warning: This component is used in {count, plural, one {# place} other {# places}}. Deleting it may break your content types.',
                    },
                    { count: component.usageCount }
                  )}
                </Typography>
              </Box>
            )}
            <Typography textColor="neutral600" variant="pi">
              {formatMessage({
                id: getTranslation('DeleteDialog.irreversible'),
                defaultMessage: 'This action cannot be undone.',
              })}
            </Typography>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button onClick={onClose} variant="tertiary">
              {formatMessage({
                id: getTranslation('DeleteDialog.cancel'),
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button
              onClick={onConfirm}
              variant="danger"
              startIcon={<Trash />}
              loading={isDeleting}
            >
              {formatMessage({
                id: getTranslation('DeleteDialog.confirm'),
                defaultMessage: 'Delete Component',
              })}
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { DeleteDialog };
