import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Table, Thead, Tbody, Tr, Td, Th, Badge } from '@strapi/design-system';

const UsageTable = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return null;
  }

  return (
    <Box background='neutral0' hasRadius shadow='tableShadow'>
      <Table colCount={3} rowCount={usage.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant='sigma'>Content Type</Typography>
            </Th>
            <Th>
              <Typography variant='sigma'>Entry ID</Typography>
            </Th>
            <Th>
              <Typography variant='sigma'>Field Path</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {usage.map((usageItem, index) => (
            <Tr key={`${usageItem.contentType}-${usageItem.entryId}-${index}`}>
              <Td>
                <Typography fontWeight='semiBold'>{usageItem.contentType}</Typography>
              </Td>
              <Td>
                <Badge>{usageItem.entryId}</Badge>
              </Td>
              <Td>
                <Typography variant='pi' textColor='neutral600'>
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

UsageTable.propTypes = {
  usage: PropTypes.arrayOf(
    PropTypes.shape({
      contentType: PropTypes.string.isRequired,
      entryId: PropTypes.string.isRequired,
      fieldPath: PropTypes.string.isRequired
    })
  )
};

export { UsageTable };
