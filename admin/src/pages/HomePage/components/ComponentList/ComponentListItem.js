import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Badge, Flex } from '@strapi/design-system';
import { getBadgeVariant, isComponentSelected } from './utils/badgeVariant';

export const ComponentListItem = ({ component, selectedComponent, onSelectComponent }) => {
  const isSelected = isComponentSelected(selectedComponent, component.uid);

  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      paddingTop={3}
      paddingBottom={3}
      background={isSelected ? 'primary100' : 'neutral0'}
      style={{
        cursor: 'pointer',
        borderLeft: isSelected ? '3px solid #4945FF' : '3px solid transparent'
      }}
      onClick={() => onSelectComponent(component)}
    >
      <Flex justifyContent='space-between' alignItems='center' >
        <Flex direction='column' alignItems='start'>
          <Typography
            fontWeight='semiBold'
            textColor={isSelected ? 'primary600' : 'neutral800'}
          >
            {component.displayName}
          </Typography>
          <Typography variant='pi' textColor='neutral600'>
            {component.uid}
          </Typography>
        </Flex>
        <Badge variant={getBadgeVariant(component.usageCount)}>
          {component.usageCount}
        </Badge>
      </Flex>
    </Box>
  );
};

ComponentListItem.propTypes = {
  component: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    usageCount: PropTypes.number.isRequired
  }).isRequired,
  selectedComponent: PropTypes.object,
  onSelectComponent: PropTypes.func.isRequired
};
