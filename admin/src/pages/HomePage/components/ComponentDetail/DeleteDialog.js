import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Alert,
  Typography,
  Flex
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import getTrad from '../../../../utils/getTrad';

const DeleteDialog = ({ isOpen, onClose, onConfirm, component, isDeleting }) => {
  const { formatMessage } = useIntl();

  if (!component) return null;

  return (
    <Dialog onClose={onClose} title={formatMessage({ id: getTrad('DeleteDialog.title'), defaultMessage: 'Confirm Deletion' })} isOpen={isOpen}>
      <DialogBody icon={<Trash />}>
        <Flex direction='column' alignItems='stretch' gap={2}>
          <Typography id='confirm-description'>
            {formatMessage(
              { id: getTrad('DeleteDialog.message'), defaultMessage: 'Are you sure you want to delete the component <strong>"{name}"</strong>?' },
              { name: component.displayName, strong: (...chunks) => <strong>{chunks}</strong> }
            )}
          </Typography>
          {component.usageCount > 0 && (
            <Alert variant='danger' closeLabel={formatMessage({ id: getTrad('DeleteDialog.closeLabel'), defaultMessage: 'Close' })}>
              <Typography>
                {formatMessage(
                  { id: getTrad('DeleteDialog.warning'), defaultMessage: 'Warning: This component is used in {count, plural, one {# place} other {# places}}. Deleting it may break your content types.' },
                  { count: component.usageCount }
                )}
              </Typography>
            </Alert>
          )}
          <Typography textColor='neutral600' variant='pi'>
            {formatMessage({ id: getTrad('DeleteDialog.irreversible'), defaultMessage: 'This action cannot be undone.' })}
          </Typography>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onClose} variant='tertiary'>
            {formatMessage({ id: getTrad('DeleteDialog.cancel'), defaultMessage: 'Cancel' })}
          </Button>
        }
        endAction={
          <Button onClick={onConfirm} variant='danger' startIcon={<Trash />} loading={isDeleting}>
            {formatMessage({ id: getTrad('DeleteDialog.confirm'), defaultMessage: 'Delete Component' })}
          </Button>
        }
      />
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  component: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    usageCount: PropTypes.number.isRequired
  }),
  isDeleting: PropTypes.bool.isRequired
};

export { DeleteDialog };
