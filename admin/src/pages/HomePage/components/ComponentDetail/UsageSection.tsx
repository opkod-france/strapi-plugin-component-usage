import { useIntl } from 'react-intl';
import {
  Box,
  Typography,
  Button,
  Flex,
  Loader,
  EmptyStateLayout,
} from '@strapi/design-system';
import { ArrowClockwise, Information } from '@strapi/icons';
import getTranslation from '../../../../utils/getTranslation';
import { UsageTable } from './UsageTable';

interface UsageSectionProps {
  component: { usageCount: number };
  usage: any[] | null;
  loadingUsage: boolean;
  onRefresh: () => void;
}

const UsageSection = ({
  component,
  usage,
  loadingUsage,
  onRefresh,
}: UsageSectionProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={6}>
      <Flex justifyContent="space-between" alignItems="center" paddingBottom={4}>
        <Typography variant="delta">
          {formatMessage({
            id: getTranslation('UsageSection.title'),
            defaultMessage: 'Usage Details',
          })}
        </Typography>
        {component.usageCount > 0 && (
          <Button
            size="S"
            variant="secondary"
            startIcon={<ArrowClockwise />}
            onClick={onRefresh}
            loading={loadingUsage}
          >
            {formatMessage({
              id: getTranslation('UsageSection.refresh'),
              defaultMessage: 'Refresh',
            })}
          </Button>
        )}
      </Flex>

      {loadingUsage ? (
        <Box padding={8}>
          <Flex justifyContent="center">
            <Loader small>
              {formatMessage({
                id: getTranslation('UsageSection.loading'),
                defaultMessage: 'Loading usage details...',
              })}
            </Loader>
          </Flex>
        </Box>
      ) : component.usageCount === 0 ? (
        <EmptyStateLayout
          icon={<Information width="64px" height="64px" />}
          content={formatMessage({
            id: getTranslation('UsageSection.emptyState'),
            defaultMessage: 'This component is not used in any content',
          })}
        />
      ) : (
        <UsageTable usage={usage} />
      )}
    </Box>
  );
};

export { UsageSection };
