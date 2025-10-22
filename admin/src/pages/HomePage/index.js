import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Layout,
  HeaderLayout,
  ContentLayout,
  Box,
  Loader,
  Alert,
  Flex,
  Grid,
  GridItem
} from '@strapi/design-system';
import { request } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';

import { ComponentList, ComponentDetail } from './components';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      // Use the FAST endpoint that only loads usage counts
      const data = await request(`/${pluginId}/components`, {
        method: 'GET'
      });
      setComponents(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching components:', err);
      setError(formatMessage({ id: getTrad('HomePage.error'), defaultMessage: 'Failed to load components. Please try again.' }));
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
      <Layout>
        <HeaderLayout
          title={formatMessage({ id: getTrad('HomePage.title'), defaultMessage: 'Component Usage' })}
          subtitle={formatMessage({ id: getTrad('plugin.description'), defaultMessage: 'View all components and their usage across content types' })}
        />
        <ContentLayout>
          <Box padding={8} background='neutral0'>
            <Flex justifyContent='center'>
              <Loader>{formatMessage({ id: getTrad('HomePage.loading'), defaultMessage: 'Loading components...' })}</Loader>
            </Flex>
          </Box>
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeaderLayout
        title={formatMessage({ id: getTrad('HomePage.title'), defaultMessage: 'Component Usage' })}
        subtitle={formatMessage(
          { id: getTrad('HomePage.subtitle'), defaultMessage: '{count, plural, =0 {No components} one {# component} other {# components}} • {usages, plural, =0 {no usage} one {# total usage} other {# total usages}}' },
          { count: components.length, usages: calculateTotalUsages() }
        )}
      />
      <ContentLayout>
        {error && (
          <Box paddingBottom={4}>
            <Alert closeLabel='Close' variant='danger'>
              {error}
            </Alert>
          </Box>
        )}

        <Grid gap={4}>
          <GridItem col={4}>
            <ComponentList
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </GridItem>
          <GridItem col={8}>
            <ComponentDetail
              component={selectedComponent}
              onDelete={handleDeleteComplete}
              onRefresh={fetchComponents}
            />
          </GridItem>
        </Grid>
      </ContentLayout>
    </Layout>
  );
};

export { HomePage };
