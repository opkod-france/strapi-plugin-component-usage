import React, { useState, useEffect } from 'react';
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

import { ComponentList, ComponentDetail } from './components';

const HomePage = () => {
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
      setError('Failed to load components. Please try again.');
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
          title='Component Usage'
          subtitle='Manage components and track their usage across content types'
        />
        <ContentLayout>
          <Box padding={8} background='neutral0'>
            <Flex justifyContent='center'>
              <Loader>Loading components...</Loader>
            </Flex>
          </Box>
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeaderLayout
        title='Component Usage'
        subtitle={`${components.length} component${
          components.length !== 1 ? 's' : ''
        } • ${calculateTotalUsages()} total usage${calculateTotalUsages() !== 1 ? 's' : ''}`}
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
