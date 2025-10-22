import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Badge, Flex } from '@strapi/design-system';

/**
 * Reusable card component for displaying a single dependency item
 */
export const DependencyCard = ({
  title,
  subtitle,
  category,
  badges = [],
  metadata = [],
  onClick
}) => {
  return (
    <Box
      padding={4}
      background='neutral0'
      hasRadius
      borderColor='neutral200'
      borderStyle='solid'
      borderWidth='1px'
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#4945FF';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(73, 69, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#EAEAEF';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <Flex direction='column' gap={2}>
        {/* Header with title and category */}
        <Flex justifyContent='space-between' alignItems='flex-start'>
          <Box flex='1'>
            <Typography fontWeight='semiBold' textColor='neutral800'>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='pi' textColor='neutral600'>
                {subtitle}
              </Typography>
            )}
          </Box>
          {category && (
            <Badge variant='secondary' minWidth='fit-content'>
              {category}
            </Badge>
          )}
        </Flex>

        {/* Badges row */}
        {badges.length > 0 && (
          <Flex gap={2} wrap='wrap'>
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'} size='S'>
                {badge.label}
              </Badge>
            ))}
          </Flex>
        )}

        {/* Metadata row */}
        {metadata.length > 0 && (
          <Box paddingTop={1}>
            {metadata.map((item, index) => (
              <Typography key={index} variant='pi' textColor='neutral500'>
                {item}
              </Typography>
            ))}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

DependencyCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  category: PropTypes.string,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string
    })
  ),
  metadata: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
};
