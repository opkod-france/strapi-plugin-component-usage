import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Flex,
  Grid,
  Loader,
} from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../../pluginId';
import getTranslation from '../../utils/getTranslation';
import { ComponentList } from './components/ComponentList';
import { ComponentDetail } from './components/ComponentDetail';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const { data } = await get(`/${PLUGIN_ID}/components`);
      setComponents(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching components:', err);
      setError(
        formatMessage({
          id: getTranslation('HomePage.error'),
          defaultMessage: 'Failed to load components. Please try again.',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplete = () => {
    setSelectedComponent(null);
  };

  const calculateTotalUsages = () => {
    return components.reduce((sum, c) => sum + c.usageCount, 0);
  };

  if (loading) {
    return (
      <Layouts.Root>
        <Layouts.Header
          title={formatMessage({
            id: getTranslation('HomePage.title'),
            defaultMessage: 'Component Usage',
          })}
          subtitle={formatMessage({
            id: getTranslation('plugin.description'),
            defaultMessage:
              'View all components and their usage across content types',
          })}
        />
        <Layouts.Content>
          <Box padding={8} background="neutral0">
            <Flex justifyContent="center">
              <Loader>
                {formatMessage({
                  id: getTranslation('HomePage.loading'),
                  defaultMessage: 'Loading components...',
                })}
              </Loader>
            </Flex>
          </Box>
        </Layouts.Content>
      </Layouts.Root>
    );
  }

  return (
    <Layouts.Root>
      <Layouts.Header
        title={formatMessage({
          id: getTranslation('HomePage.title'),
          defaultMessage: 'Component Usage',
        })}
        subtitle={formatMessage(
          {
            id: getTranslation('HomePage.subtitle'),
            defaultMessage:
              '{count, plural, =0 {No components} one {# component} other {# components}} • {usages, plural, =0 {no usage} one {# total usage} other {# total usages}}',
          },
          { count: components.length, usages: calculateTotalUsages() }
        )}
      />
      <Layouts.Content>
        {error && (
          <Box paddingBottom={4}>
            <Box padding={4} background="danger100" hasRadius>
              {error}
            </Box>
          </Box>
        )}

        <Grid.Root gap={4}>
          <Grid.Item col={4} direction="column" alignItems="stretch">
            <ComponentList
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Grid.Item>
          <Grid.Item col={8} direction="column" alignItems="stretch">
            <ComponentDetail
              component={selectedComponent}
              onDelete={handleDeleteComplete}
              onRefresh={fetchComponents}
            />
          </Grid.Item>
        </Grid.Root>
      </Layouts.Content>
    </Layouts.Root>
  );
};

export { HomePage };
