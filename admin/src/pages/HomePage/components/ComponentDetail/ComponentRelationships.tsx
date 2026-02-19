import { useIntl } from 'react-intl';
import { Box, Typography } from '@strapi/design-system';
import { ArrowRight, ArrowLeft } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';
import { DependencySection } from '../DependencySection';

interface ComponentRelationshipsProps {
  relationships: {
    uses?: any[];
    usedIn?: any[];
  } | null;
}

export const ComponentRelationships = ({
  relationships,
}: ComponentRelationshipsProps) => {
  const { formatMessage } = useIntl();

  if (!relationships) {
    return null;
  }

  const { uses, usedIn } = relationships;
  const hasUses = uses && uses.length > 0;
  const hasUsedIn = usedIn && usedIn.length > 0;

  const usesItems = (uses || []).map((use: any) => {
    const badges: { label: string; variant: string }[] = [];

    if (use.repeatable) {
      badges.push({
        label: formatMessage({
          id: getTranslation('ComponentRelationships.badge.repeatable'),
          defaultMessage: 'Repeatable',
        }),
        variant: 'secondary',
      });
    }
    if (use.isDynamicZone) {
      badges.push({
        label: formatMessage({
          id: getTranslation('ComponentRelationships.badge.dynamicZone'),
          defaultMessage: 'Dynamic Zone',
        }),
        variant: 'primary',
      });
    }

    return {
      title: use.componentUid,
      subtitle: formatMessage(
        {
          id: getTranslation('ComponentRelationships.field'),
          defaultMessage: 'Field: {name}',
        },
        { name: use.attributeName }
      ),
      badges,
      metadata: [],
    };
  });

  const usedInItems = (usedIn || []).map((parent: any) => {
    const metadata: string[] = [];

    if (parent.attributes && parent.attributes.length > 0) {
      const fieldNames = parent.attributes
        .map((attr: any) => attr.name)
        .join(', ');
      metadata.push(
        formatMessage(
          {
            id: getTranslation('ComponentRelationships.fields'),
            defaultMessage: 'Fields: {names}',
          },
          { names: fieldNames }
        )
      );
    }

    const badges = parent.attributes
      ? parent.attributes
          .map((attr: any) => {
            const labels: string[] = [];
            if (attr.repeatable)
              labels.push(
                formatMessage({
                  id: getTranslation(
                    'ComponentRelationships.badge.repeatable'
                  ),
                  defaultMessage: 'Repeatable',
                }).toLowerCase()
              );
            if (attr.isDynamicZone)
              labels.push(
                formatMessage({
                  id: getTranslation(
                    'ComponentRelationships.badge.dynamicZone'
                  ),
                  defaultMessage: 'Dynamic Zone',
                }).toLowerCase()
              );
            return labels.length > 0
              ? { label: labels.join(', '), variant: 'secondary' }
              : null;
          })
          .filter(Boolean)
      : [];

    return {
      title: parent.displayName,
      subtitle: parent.componentUid,
      category: parent.category,
      badges,
      metadata,
    };
  });

  if (!hasUses && !hasUsedIn) {
    return (
      <Box padding={6} paddingTop={0}>
        <Typography variant="delta" paddingBottom={4}>
          {formatMessage({
            id: getTranslation('ComponentRelationships.title'),
            defaultMessage: 'Component Dependencies',
          })}
        </Typography>
        <Box padding={4} background="neutral100" hasRadius>
          <Typography variant="omega" fontWeight="semiBold">
            {formatMessage({
              id: getTranslation(
                'ComponentRelationships.noDependencies.title'
              ),
              defaultMessage: 'No Dependencies',
            })}
          </Typography>
          <Typography variant="pi" textColor="neutral600">
            {formatMessage({
              id: getTranslation(
                'ComponentRelationships.noDependencies.message'
              ),
              defaultMessage:
                "This component is independent - it doesn't use other components and isn't used by other components.",
            })}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box padding={6} paddingTop={0}>
      <Typography variant="delta" paddingBottom={4}>
        {formatMessage({
          id: getTranslation('ComponentRelationships.title'),
          defaultMessage: 'Component Dependencies',
        })}
      </Typography>

      <Box
        padding={4}
        background="neutral100"
        hasRadius
        borderColor="neutral200"
        borderStyle="solid"
        borderWidth="1px"
      >
        {hasUses && (
          <DependencySection
            title={formatMessage({
              id: getTranslation('ComponentRelationships.uses.title'),
              defaultMessage: 'Uses Components',
            })}
            description={formatMessage({
              id: getTranslation('ComponentRelationships.uses.description'),
              defaultMessage: 'Components nested within this component',
            })}
            icon={ArrowRight}
            count={uses!.length}
            items={usesItems}
            defaultExpanded={true}
            accentColor="success600"
          />
        )}

        {hasUsedIn && (
          <DependencySection
            title={formatMessage({
              id: getTranslation('ComponentRelationships.usedIn.title'),
              defaultMessage: 'Used In Components',
            })}
            description={formatMessage({
              id: getTranslation('ComponentRelationships.usedIn.description'),
              defaultMessage: 'Components that include this component',
            })}
            icon={ArrowLeft}
            count={usedIn!.length}
            items={usedInItems}
            defaultExpanded={true}
            accentColor="primary600"
          />
        )}

        <Box paddingTop={4} paddingLeft={3} paddingRight={3}>
          <Box
            padding={3}
            background="neutral0"
            hasRadius
            style={{ borderLeft: '3px solid #4945FF' }}
          >
            <Typography
              variant="omega"
              fontWeight="semiBold"
              textColor="neutral700"
            >
              {formatMessage({
                id: getTranslation('ComponentRelationships.summary.title'),
                defaultMessage: 'Dependency Summary',
              })}
            </Typography>
            <Typography variant="pi" textColor="neutral600">
              {hasUses &&
                formatMessage(
                  {
                    id: getTranslation(
                      'ComponentRelationships.summary.uses'
                    ),
                    defaultMessage:
                      'Uses {count, plural, one {# component} other {# components}}',
                  },
                  { count: uses!.length }
                )}
              {hasUses && hasUsedIn && ' • '}
              {hasUsedIn &&
                formatMessage(
                  {
                    id: getTranslation(
                      'ComponentRelationships.summary.usedBy'
                    ),
                    defaultMessage:
                      'Used by {count, plural, one {# component} other {# components}}',
                  },
                  { count: usedIn!.length }
                )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
