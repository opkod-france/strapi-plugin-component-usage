import { Box, Typography, Table, Thead, Tbody, Tr, Td, Th, Badge } from '@strapi/design-system';

interface UsageItem {
  contentType: string;
  entryId: string;
  fieldPath: string;
}

interface UsageTableProps {
  usage: UsageItem[] | null;
}

const UsageTable = ({ usage }: UsageTableProps) => {
  if (!usage || usage.length === 0) {
    return null;
  }

  return (
    <Box background="neutral0" hasRadius shadow="tableShadow">
      <Table colCount={3} rowCount={usage.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Content Type</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Entry ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Field Path</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {usage.map((usageItem, index) => (
            <Tr key={`${usageItem.contentType}-${usageItem.entryId}-${index}`}>
              <Td>
                <Typography fontWeight="semiBold">
                  {usageItem.contentType}
                </Typography>
              </Td>
              <Td>
                <Badge>{usageItem.entryId}</Badge>
              </Td>
              <Td>
                <Typography variant="pi" textColor="neutral600">
                  {usageItem.fieldPath}
                </Typography>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export { UsageTable };
