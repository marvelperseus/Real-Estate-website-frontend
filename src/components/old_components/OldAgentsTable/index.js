import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import faker from 'faker';
import ProfilePictureFormatter from '../dataTableFormatters/ProfilePictureFormatter';
import PhoneNumberFormatter from '../dataTableFormatters/PhoneNumberFormatter';
import EmailFormatter from '../dataTableFormatters/EmailFormatter';
import EmptyRowsView from '../EmptyRowsView';
import MyToolbar from '../Toolbar';


const chance = new Chance();

let ReactDataGrid;
let mySelectors;
if (typeof window !== 'undefined') {
  const PropTypes = require('prop-types');
  // next line is only required until ron-react-autocomplete is rebuilt and republished
  PropTypes.component = PropTypes.element;
  require('react').PropTypes = PropTypes;
  require('react').createClass = require('create-react-class');
  ReactDataGrid = require('react-data-grid');
  const {
    Data: { Selectors },
  } = require('react-data-grid-addons');
  mySelectors = Selectors;
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
class AgentsTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.createRows();
    this._columns = [
      {
        key: 'agentID',
        name: 'Agent ID',
        resizable: true,
        locked: true,
        filterable: true,
        sortable: true,
      },
      {
        key: 'photo',
        name: 'Photo',
        width: 65,
        formatter: ProfilePictureFormatter,
      },
      { key: 'name', name: 'Name', resizable: true, filterable: true, sortable: true },
      {
        key: 'email',
        name: 'Email',
        resizable: true,
        filterable: true,
        sortable: true,
        formatter: EmailFormatter,
      },
      {
        key: 'telephoneNumber',
        name: 'Telephone Number',
        resizable: true,
        filterable: true,
        sortable: true,
        formatter: PhoneNumberFormatter,
      },
      {
        key: 'region',
        name: 'Region',
        resizable: true,
        filterable: true,
        sortable: true,
      },
    ];

    this.state = {
      rows: this.createRows(1000),
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
      rows.push({
        agentID: chance.integer({ min: 1, max: 2000000000 }),
        photo: { imageURL: faker.image.avatar(), profileURL: '#' },
        name: chance.name(),
        email: chance.email(),
        telephoneNumber: chance.phone(),
        region: chance.integer({ min: 0, max: 100 }) > 70 ? chance.state({ full: true }) : 'New York',
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

  onClearFilters = () => {
    // all filters removed
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
            toolbar={<MyToolbar tableTitle="Agents" enableFilter />}
            minHeight={this.getSize() ? 600 : 100}
            minColumnWidth={120}
            enableCellSelect
            onGridSort={this.handleGridSort}
            onAddFilter={this.handleFilterChange}
            onClearFilters={this.onClearFilters}
            rowScrollTimeout={200}
            emptyRowsView={EmptyRowsView}
            cellNavigationMode="changeRow"
          /> : null}
      </div>
    );
  }
}

export default withStyles(styles)(AgentsTable);
