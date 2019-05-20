import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import EmptyRowsView from '../EmptyRowsView';
import MyToolbar from '../Toolbar';
import ViewFormatter from '../dataTableFormatters/ViewFormatter';
import RowRenderer from '../RowRenderer';
import { round } from '../../utils/Math';


const chance = new Chance();

let ReactDataGrid;
let mySelectors;
let MySingleSelectFilter;
let MyNumericFilter;
if (typeof window !== 'undefined') {
  const PropTypes = require('prop-types');
  // next line is only required until ron-react-autocomplete is rebuilt and republished
  PropTypes.component = PropTypes.element;
  require('react').PropTypes = PropTypes;
  require('react').createClass = require('create-react-class');
  ReactDataGrid = require('react-data-grid');
  const {
    Data: { Selectors, },
    Filters: { SingleSelectFilter, NumericFilter },
  } = require('react-data-grid-addons');
  mySelectors = Selectors;
  MySingleSelectFilter = SingleSelectFilter;
  MyNumericFilter = NumericFilter;
}

const styles = theme => ({
  gridWrapper: {
    boxShadow: theme.shadows[1],
    fontFamily: theme.typography.fontFamily,
    borderRadius: '8px',
    overflow: 'hidden',
    '& > :first-child': {
      width: '100% !important',
    },
  },
});

@observer
class InvoicesTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'invoiceID',
        name: 'Invoice ID',
        resizable: true,
        locked: true,
        filterable: true,
        sortable: true,
      },
      { key: 'clientName', name: 'Client Name', resizable: true, filterable: true, sortable: true },
      { key: 'date', name: 'Date', resizable: true, filterable: true, sortable: true },
      {
        key: 'type',
        name: 'Type',
        resizable: true,
        filterable: true,
        sortable: true,
        width: 110,
        filterRenderer: MySingleSelectFilter,
      },
      {
        key: 'propertyAddress',
        name: 'Property Address',
        resizable: true,
        filterable: true,
        sortable: true,
        width: 150,
      },
      {
        key: 'propertyCity',
        name: 'Property City',
        resizable: true,
        filterable: true,
        sortable: true,
        width: 110,
      },
      {
        key: 'managementOrCobrokeCompany',
        name: 'Mgmt/Co-Broke Co.',
        resizable: true,
        filterable: true,
        sortable: true,
        width: 155,
      },
      {
        key: 'rentOrSalePrice',
        name: 'Rent/Sale Price',
        resizable: true,
        filterable: true,
        sortable: true,
        filterRenderer: MyNumericFilter,
      },
      {
        key: 'totalAmount',
        name: 'Total Amount',
        resizable: true,
        filterable: true,
        sortable: true,
        filterRenderer: MyNumericFilter,
      },
      {
        key: 'status',
        name: 'Status',
        resizable: true,
        filterable: true,
        sortable: true,
        filterRenderer: MySingleSelectFilter,
      },
      {
        key: 'view',
        name: 'View',
        formatter: ViewFormatter,
        width: 55,
      },
    ];

    this.state = {
      rows: this.createRows(150),
      filters: {},
      sortColumn: null,
      sortDirection: null,
      tableIsLoading: true,
    };
  }

  componentDidMount() {
    if (this.props.onMount) this.props.onMount();
  }

  createRows = numOfRows => {
    const rows = [];
    for (let i = 1; i < numOfRows; i++) {
      const rentOrSalePrice = chance.dollar().substring(1);
      rows.push({
        invoiceID: chance.integer({ min: 1, max: 2000000000 }),
        clientName: chance.name(),
        date: chance.date({ string: true }),
        type: chance.bool() === true ? 'Residential' : 'Commercial',
        propertyAddress: chance.address(),
        propertyCity: chance.city(),
        managementOrCobrokeCompany: chance.company(),
        rentOrSalePrice,
        totalAmount: round(Number(rentOrSalePrice) + 4250, 2),
        status: chance.bool() === true ? 'Pending' : 'Approved',
        view: '#',
      });
    }
    return rows;
  };

  getRows = () => (
    mySelectors.getRows(this.state)
  );

  getSize = () => (
    this.getRows().length
  );

  rowGetter = rowIdx => {
    const rows = this.getRows();
    return rows[rowIdx];
  };

  handleFilterChange = filter => {
    const newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    let values = this.state.rows.map(r => r[columnId]);
    return values.filter((item, i, a) => { return i === a.indexOf(item); });
  };

  handleOnClearFilters = () => {
    this.setState({ filters: {} });
  };

  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn, sortDirection });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.gridWrapper}>
        {typeof window !== 'undefined' ?
          <ReactDataGrid
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.getSize()}
            rowHeight={50}
            headerRowHeight={37}
            toolbar={<MyToolbar tableTitle="Invoices" enableFilter />}
            minHeight={this.getSize() ? 600 : 100}
            minColumnWidth={120}
            enableCellSelect
            onGridSort={this.handleGridSort}
            onAddFilter={this.handleFilterChange}
            getValidFilterValues={this.getValidFilterValues}
            onClearFilters={this.handleOnClearFilters}
            rowScrollTimeout={200}
            rowRenderer={RowRenderer}
            emptyRowsView={EmptyRowsView}
            cellNavigationMode="changeRow"
          /> : null}
      </div>
    );
  }
}

export default withStyles(styles)(InvoicesTable);
