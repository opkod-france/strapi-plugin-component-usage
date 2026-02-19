import { useState, type ElementType } from 'react';
import { Box, Typography, Flex, IconButton, Badge, Grid } from '@strapi/design-system';
import { ChevronDown, ChevronUp } from '@strapi/icons';
import { DependencyCard } from './DependencyCard';

interface DependencySectionProps {
  title: string;
  description?: string;
  icon?: ElementType;
  count: number;
  items?: any[];
  defaultExpanded?: boolean;
  accentColor?: string;
}

export const DependencySection = ({
  title,
  description,
  icon: Icon,
  count,
  items = [],
  defaultExpanded = true,
  accentColor = 'primary600',
}: DependencySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box paddingBottom={4}>
      <Box
        padding={3}
        background="neutral100"
        hasRadius
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={3} alignItems="center">
            {Icon && (
              <Box
                background={accentColor}
                padding={2}
                hasRadius
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon width="16px" height="16px" fill="white" />
              </Box>
            )}
            <Box>
              <Flex gap={2} alignItems="center">
                <Typography
                  variant="omega"
                  fontWeight="bold"
                  textColor="neutral800"
                >
                  {title}
                </Typography>
                <Badge>{count}</Badge>
              </Flex>
              {description && (
                <Typography variant="pi" textColor="neutral600">
                  {description}
                </Typography>
              )}
            </Box>
          </Flex>
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </Flex>
      </Box>

      {isExpanded && (
        <Box paddingTop={3}>
          <Grid.Root gap={3}>
            {items.map((item, index) => (
              <Grid.Item key={index} col={12} direction="column">
                <DependencyCard {...item} />
              </Grid.Item>
            ))}
          </Grid.Root>
        </Box>
      )}
    </Box>
  );
};
