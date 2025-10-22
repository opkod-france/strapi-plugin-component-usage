import React from 'react';
import PropTypes from 'prop-types';
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

const DeleteDialog = ({ isOpen, onClose, onConfirm, component, isDeleting }) => {
  if (!component) return null;

  return (
    <Dialog onClose={onClose} title='Confirm Deletion' isOpen={isOpen}>
      <DialogBody icon={<Trash />}>
        <Flex direction='column' alignItems='stretch' gap={2}>
          <Typography id='confirm-description'>
            Are you sure you want to delete the component <strong>"{component.displayName}"</strong>
            ?
          </Typography>
          {component.usageCount > 0 && (
            <Alert variant='danger' closeLabel='Close'>
              <Typography>
                Warning: This component is used in {component.usageCount} place
                {component.usageCount > 1 ? 's' : ''}. Deleting it may break your content types.
              </Typography>
            </Alert>
          )}
          <Typography textColor='neutral600' variant='pi'>
            This action cannot be undone.
          </Typography>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onClose} variant='tertiary'>
            Cancel
          </Button>
        }
        endAction={
          <Button onClick={onConfirm} variant='danger' startIcon={<Trash />} loading={isDeleting}>
            Delete Component
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
