import { Box } from '@strapi/design-system';
import { CategoryHeader } from './CategoryHeader';
import { ComponentListItem } from './ComponentListItem';

interface CategoryGroupProps {
  category: string;
  components: any[];
  selectedComponent: any;
  onSelectComponent: (component: any) => void;
}

export const CategoryGroup = ({
  category,
  components,
  selectedComponent,
  onSelectComponent,
}: CategoryGroupProps) => {
  return (
    <Box paddingBottom={2}>
      <CategoryHeader category={category} />
      {components.map((component: any) => (
        <ComponentListItem
          key={component.uid}
          component={component}
          selectedComponent={selectedComponent}
          onSelectComponent={onSelectComponent}
        />
      ))}
    </Box>
  );
};
