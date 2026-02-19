import { Box, Typography } from '@strapi/design-system';

interface CategoryHeaderProps {
  category: string;
}

export const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      paddingTop={2}
      paddingBottom={2}
      background="neutral100"
    >
      <Typography variant="sigma" textColor="neutral600">
        {category.toUpperCase()}
      </Typography>
    </Box>
  );
};
