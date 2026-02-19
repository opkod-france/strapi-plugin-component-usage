import { useIntl } from 'react-intl';
import { Box, Searchbar, SearchForm } from '@strapi/design-system';
import getTranslation from '../../../../utils/getTranslation';

interface ComponentSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ComponentSearch = ({
  searchQuery,
  onSearchChange,
}: ComponentSearchProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box paddingLeft={4} paddingRight={4} paddingBottom={3}>
      <SearchForm>
        <Searchbar
          name="searchbar"
          onClear={() => onSearchChange('')}
          value={searchQuery}
          onChange={(e: any) => onSearchChange(e.target.value)}
          clearLabel={formatMessage({
            id: getTranslation('ComponentSearch.clearLabel'),
            defaultMessage: 'Clear',
          })}
          placeholder={formatMessage({
            id: getTranslation('ComponentSearch.placeholder'),
            defaultMessage: 'Search components...',
          })}
        >
          {formatMessage({
            id: getTranslation('ComponentSearch.label'),
            defaultMessage: 'Search components',
          })}
        </Searchbar>
      </SearchForm>
    </Box>
  );
};
