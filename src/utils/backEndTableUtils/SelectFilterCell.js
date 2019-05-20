import React from 'react';
import { withStyles } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';
import MaterialCustomSelectInput from '../../components/MaterialCustomSelectInput';

const styles = theme => ({
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '100%',
  },
});

const FilterCellBase = ({ filter, onFilter, classes, selectInputItems, fullWidth }) => (
  <TableCell className={classes.cell}>
    <MaterialCustomSelectInput
      className={classes.input}
      value={filter ? filter.value : ''}
      onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
      placeholder="Filter..."
      inputProps={{}}
      fullWidth={fullWidth}
      selectInputItems={selectInputItems}
    />
  </TableCell>
);
const SelectFilterCell = withStyles(styles, { name: 'SexFilterCell' })(FilterCellBase);

export default SelectFilterCell;
