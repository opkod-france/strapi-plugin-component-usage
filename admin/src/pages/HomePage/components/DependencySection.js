import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Flex, IconButton, Grid, GridItem } from '@strapi/design-system';
import { ChevronDown, ChevronUp } from '@strapi/icons';
import { DependencyCard } from './DependencyCard';

/**
 * Collapsible section for displaying a group of dependencies
 */
export const DependencySection = ({
  title,
  description,
  icon: Icon,
  count,
  items = [],
  emptyMessage = 'No items',
  defaultExpanded = true,
  accentColor = 'primary600'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box paddingBottom={4}>
      {/* Section Header */}
      <Box
        padding={3}
        background='neutral100'
        hasRadius
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Flex justifyContent='space-between' alignItems='center'>
          <Flex gap={3} alignItems='center'>
            {Icon && (
              <Box
                background={accentColor}
                padding={2}
                hasRadius
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon width='16px' height='16px' fill='white' />
              </Box>
            )}
            <Box>
              <Flex gap={2} alignItems='center'>
                <Typography variant='omega' fontWeight='bold' textColor='neutral800'>
                  {title}
                </Typography>
                <Badge
                  variant='default'
                  style={{
                    backgroundColor: '#DCDCE4',
                    color: '#32324D',
                    fontWeight: 600
                  }}
                >
                  {count}
                </Badge>
              </Flex>
              {description && (
                <Typography variant='pi' textColor='neutral600'>
                  {description}
                </Typography>
              )}
            </Box>
          </Flex>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            label={isExpanded ? 'Collapse' : 'Expand'}
            icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
          />
        </Flex>
      </Box>

      {/* Section Content */}
      {isExpanded && (
        <Box paddingTop={3}>
          <Grid gap={3}>
            {items.map((item, index) => (
              <GridItem key={index} col={12}>
                <DependencyCard {...item} />
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

// Import Badge from design system
const Badge = ({ children, variant, style }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    ...style
  };

  return <span style={baseStyle}>{children}</span>;
};

DependencySection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  count: PropTypes.number.isRequired,
  items: PropTypes.array,
  emptyMessage: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  accentColor: PropTypes.string
};
