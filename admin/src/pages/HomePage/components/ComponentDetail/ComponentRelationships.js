import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Box, Typography, Alert } from '@strapi/design-system';
import { ArrowRight, ArrowLeft, Information } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';
import { DependencySection } from '../DependencySection';

/**
 * Improved component relationships display with better UX
 * Following dependency visualization best practices
 */
export const ComponentRelationships = ({ relationships }) => {
  const { formatMessage } = useIntl();

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
      badges.push({ label: formatMessage({ id: getTranslation('ComponentRelationships.badge.repeatable'), defaultMessage: 'Repeatable' }), variant: 'secondary' });
    }
    if (use.isDynamicZone) {
      badges.push({ label: formatMessage({ id: getTranslation('ComponentRelationships.badge.dynamicZone'), defaultMessage: 'Dynamic Zone' }), variant: 'primary' });
    }

    return {
      title: use.componentUid,
      subtitle: formatMessage({ id: getTranslation('ComponentRelationships.field'), defaultMessage: 'Field: {name}' }, { name: use.attributeName }),
      badges,
      metadata: []
    };
  });

  // Transform usedIn data for DependencyCard format
  const usedInItems = (usedIn || []).map((parent) => {
    const metadata = [];

    if (parent.attributes && parent.attributes.length > 0) {
      const fieldNames = parent.attributes.map((attr) => attr.name).join(', ');
      metadata.push(formatMessage({ id: getTranslation('ComponentRelationships.fields'), defaultMessage: 'Fields: {names}' }, { names: fieldNames }));
    }

    const badges = parent.attributes
      ? parent.attributes.map((attr) => {
          const labels = [];
          if (attr.repeatable) labels.push(formatMessage({ id: getTranslation('ComponentRelationships.badge.repeatable'), defaultMessage: 'Repeatable' }).toLowerCase());
          if (attr.isDynamicZone) labels.push(formatMessage({ id: getTranslation('ComponentRelationships.badge.dynamicZone'), defaultMessage: 'Dynamic Zone' }).toLowerCase());
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
          {formatMessage({ id: getTranslation('ComponentRelationships.title'), defaultMessage: 'Component Dependencies' })}
        </Typography>
        <Alert
          variant='default'
          closeLabel={formatMessage({ id: getTranslation('DeleteDialog.closeLabel'), defaultMessage: 'Close' })}
          title={formatMessage({ id: getTranslation('ComponentRelationships.noDependencies.title'), defaultMessage: 'No Dependencies' })}
          icon={<Information />}
        >
          {formatMessage({ id: getTranslation('ComponentRelationships.noDependencies.message'), defaultMessage: "This component is independent - it doesn't use other components and isn't used by other components." })}
        </Alert>
      </Box>
    );
  }

  return (
    <Box padding={6} paddingTop={0}>
      <Typography variant='delta' paddingBottom={4}>
        {formatMessage({ id: getTranslation('ComponentRelationships.title'), defaultMessage: 'Component Dependencies' })}
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
            title={formatMessage({ id: getTranslation('ComponentRelationships.uses.title'), defaultMessage: 'Uses Components' })}
            description={formatMessage({ id: getTranslation('ComponentRelationships.uses.description'), defaultMessage: 'Components nested within this component' })}
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
            title={formatMessage({ id: getTranslation('ComponentRelationships.usedIn.title'), defaultMessage: 'Used In Components' })}
            description={formatMessage({ id: getTranslation('ComponentRelationships.usedIn.description'), defaultMessage: 'Components that include this component' })}
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
              {formatMessage({ id: getTranslation('ComponentRelationships.summary.title'), defaultMessage: 'Dependency Summary' })}
            </Typography>
            <Typography variant='pi' textColor='neutral600' paddingTop={1}>
              {hasUses && formatMessage({ id: getTranslation('ComponentRelationships.summary.uses'), defaultMessage: 'Uses {count, plural, one {# component} other {# components}}' }, { count: uses.length })}
              {hasUses && hasUsedIn && ' • '}
              {hasUsedIn && formatMessage({ id: getTranslation('ComponentRelationships.summary.usedBy'), defaultMessage: 'Used by {count, plural, one {# component} other {# components}}' }, { count: usedIn.length })}
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
