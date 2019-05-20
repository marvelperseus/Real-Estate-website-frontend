import React from 'react';
import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';

const VirtualCell = props => (
  <VirtualTable.Cell {...props} />
);

export default VirtualCell;
