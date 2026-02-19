import { Box, Typography, Badge, Flex } from '@strapi/design-system';

interface DependencyCardProps {
  title: string;
  subtitle?: string;
  category?: string;
  badges?: { label: string; variant?: string }[];
  metadata?: string[];
  onClick?: () => void;
}

export const DependencyCard = ({
  title,
  subtitle,
  category,
  badges = [],
  metadata = [],
  onClick,
}: DependencyCardProps) => {
  return (
    <Box
      padding={4}
      background="neutral0"
      hasRadius
      borderColor="neutral200"
      borderStyle="solid"
      borderWidth="1px"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        width: '100%',
      }}
      onClick={onClick}
    >
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Box style={{ flex: 1 }}>
            <Typography fontWeight="semiBold" textColor="neutral800">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="pi" textColor="neutral600">
                {subtitle}
              </Typography>
            )}
          </Box>
          {category && <Badge variant="secondary">{category}</Badge>}
        </Flex>

        {badges.length > 0 && (
          <Flex gap={2} wrap="wrap">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'} size="S">
                {badge.label}
              </Badge>
            ))}
          </Flex>
        )}

        {metadata.length > 0 && (
          <Box paddingTop={1}>
            {metadata.map((item, index) => (
              <Typography key={index} variant="pi" textColor="neutral500">
                {item}
              </Typography>
            ))}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
