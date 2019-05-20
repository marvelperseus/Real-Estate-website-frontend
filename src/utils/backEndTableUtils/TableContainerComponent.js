import React from 'react';
import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    boxShadow: theme.shadows[1],
    backgroundColor: '#fff',
    borderRadius: '3px',
    '& [class^="Pager-pager-"]': {
      borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '100%',
  },
  myTable: {},
  myTableContainer: {
    minHeight: '300px',
    height: 'calc(100vh - 310px) !important',
    // maxHeight: '800px',
  },
  myNoDataCellComponent: {
    borderBottom: 'none !important',
  },
});

const TableContainerBase = ({ classes, className, ...restProps }) => (
  <VirtualTable.Container
    {...restProps}
    className={classnames(classes.myTableContainer, className)}
    id="myTableContainer"
  />
);

export default withStyles(styles, { name: 'TableContainerComponent' })(
  TableContainerBase
);
