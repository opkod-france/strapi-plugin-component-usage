import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Alert } from '@strapi/design-system';
import { ArrowRight, ArrowLeft, Information } from '@strapi/icons';
import { DependencySection } from '../DependencySection';

/**
 * Improved component relationships display with better UX
 * Following dependency visualization best practices
 */
export const ComponentRelationships = ({ relationships }) => {
  if (!relationships) {
    return null;
  }

  const { uses, usedIn } = relationships;
  const hasUses = uses && uses.length > 0;
  const hasUsedIn = usedIn && usedIn.length > 0;

  // Transform uses data for DependencyCard format
  const usesItems = (uses || []).map((use) => {
    const badges = [];

    if (use.repeatable) {
      badges.push({ label: 'Repeatable', variant: 'secondary' });
    }
    if (use.isDynamicZone) {
      badges.push({ label: 'Dynamic Zone', variant: 'primary' });
    }

    return {
      title: use.componentUid,
      subtitle: `Field: ${use.attributeName}`,
      badges,
      metadata: []
    };
  });

  // Transform usedIn data for DependencyCard format
  const usedInItems = (usedIn || []).map((parent) => {
    const metadata = [];

    if (parent.attributes && parent.attributes.length > 0) {
      const fieldNames = parent.attributes.map((attr) => attr.name).join(', ');
      metadata.push(`Fields: ${fieldNames}`);
    }

    const badges = parent.attributes
      ? parent.attributes.map((attr) => {
          const labels = [];
          if (attr.repeatable) labels.push('repeatable');
          if (attr.isDynamicZone) labels.push('dynamic zone');
          return labels.length > 0
            ? { label: labels.join(', '), variant: 'secondary' }
            : null;
        }).filter(Boolean)
      : [];

    return {
      title: parent.displayName,
      subtitle: parent.componentUid,
      category: parent.category,
      badges,
      metadata
    };
  });

  // Show info message if no dependencies
  if (!hasUses && !hasUsedIn) {
    return (
      <Box padding={6} paddingTop={0}>
        <Typography variant='delta' paddingBottom={4}>
          Component Dependencies
        </Typography>
        <Alert
          variant='default'
          closeLabel='Close'
          title='No Dependencies'
          icon={<Information />}
        >
          This component is independent - it doesn't use other components and isn't used by other
          components.
        </Alert>
      </Box>
    );
  }

  return (
    <Box padding={6} paddingTop={0}>
      <Typography variant='delta' paddingBottom={4}>
        Component Dependencies
      </Typography>

      <Box
        padding={4}
        background='neutral100'
        hasRadius
        style={{ border: '1px solid #EAEAEF' }}
      >
        {/* Outgoing Dependencies */}
        {hasUses && (
          <DependencySection
            title='Uses Components'
            description='Components nested within this component'
            icon={ArrowRight}
            count={uses.length}
            items={usesItems}
            defaultExpanded={true}
            accentColor='success600'
          />
        )}

        {/* Incoming Dependencies */}
        {hasUsedIn && (
          <DependencySection
            title='Used In Components'
            description='Components that include this component'
            icon={ArrowLeft}
            count={usedIn.length}
            items={usedInItems}
            defaultExpanded={true}
            accentColor='primary600'
          />
        )}

        {/* Dependency Summary */}
        <Box paddingTop={4} paddingX={3}>
          <Box
            padding={3}
            background='neutral0'
            hasRadius
            style={{ borderLeft: '3px solid #4945FF' }}
          >
            <Typography variant='omega' fontWeight='semiBold' textColor='neutral700'>
              Dependency Summary
            </Typography>
            <Typography variant='pi' textColor='neutral600' paddingTop={1}>
              {hasUses && `Uses ${uses.length} component${uses.length !== 1 ? 's' : ''}`}
              {hasUses && hasUsedIn && ' • '}
              {hasUsedIn && `Used by ${usedIn.length} component${usedIn.length !== 1 ? 's' : ''}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ComponentRelationships.propTypes = {
  relationships: PropTypes.shape({
    uses: PropTypes.arrayOf(
      PropTypes.shape({
        componentUid: PropTypes.string.isRequired,
        attributeName: PropTypes.string.isRequired,
        repeatable: PropTypes.bool,
        isDynamicZone: PropTypes.bool
      })
    ),
    usedIn: PropTypes.arrayOf(
      PropTypes.shape({
        componentUid: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        attributes: PropTypes.array
      })
    )
  })
};
