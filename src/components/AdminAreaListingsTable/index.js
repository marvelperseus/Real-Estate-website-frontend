import React, { Component, Fragment } from 'react';
import { withStyles } from 'material-ui/styles';
import withSizes from 'react-sizes';
import isBrowser from 'is-browser';
import {
  SortingState,
  FilteringState,
  SearchState,
  IntegratedFiltering,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  SelectionState,
  IntegratedSelection,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import MaterialGrid from 'material-ui/Grid';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  TableColumnResizing,
  TableSelection,
  DragDropProvider,
  TableColumnReordering,
  Toolbar,
  SearchPanel,
  PagingPanel,
  ColumnChooser,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import { MdFileDownload } from 'react-icons/lib/md';
import SelectFilterCell from '../../utils/backEndTableUtils/SelectFilterCell';
import featureListing from '../../effects/listings/featureListing';
import {
  compareDate,
  compareNumber,
} from '../../utils/backEndTableUtils/tableSortingUtils';
import Cell from '../../utils/backEndTableUtils/DefaultVirtualTableCell';
import TableComponent from '../../utils/backEndTableUtils/TableComponent';
import TableContainerComponent from '../../utils/backEndTableUtils/TableContainerComponent';
import NoDataCellComponent from '../../utils/backEndTableUtils/NoDataCellComponent';
import ViewFormatter from '../dataTableFormatters/ViewFormatter';

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
    height: 'calc(100vh - 246px) !important',
    // maxHeight: '800px',
  },
  /*
  myTableContainerSmallViewPort: {
    minHeight: '300px',
    height: 'calc(100vh - 310px) !important',
  },
  */
  myNoDataCellComponent: {
    borderBottom: 'none !important',
  },
  editBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    left: '-13px',
  },
  downloadCSVBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '34px',
    width: '34px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#646d64',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
  },
});

const sortingStateColumnExtensions = [
  { columnName: 'listingID', sortingEnabled: false },
  { columnName: 'view', filteringEnabled: false },
];

const filteringStateColumnExtensions = [
  { columnName: 'view', filteringEnabled: false },
];

const getRowId = row => row.listingID;

const statusSelectInputItems = [
  { label: '' },
  // { label: 'Pending' },
  // { label: 'Approved' },
];

const FilterCell = props => {
  if (props.column.name === 'status') {
    return (
      <SelectFilterCell selectInputItems={statusSelectInputItems} {...props} />
    );
  }
  return <TableFilterRow.Cell {...props} />;
};

const integratedSortingColumnExtensions = [
  { columnName: 'date', compare: compareDate },
  { columnName: 'rentOrSalePrice', compare: compareNumber },
];

const defaultColumnWidths = [
  { columnName: 'newdevelopmentID', width: 120 },
  { columnName: 'listingID', width: 120 },
  { columnName: 'agentName', width: 130 },
  { columnName: 'category', width: 130 },
  { columnName: 'type', width: 130 },
  { columnName: 'ownership', width: 130 },
  { columnName: 'address', width: 120 },
  { columnName: 'description', width: 140 },
  { columnName: 'price', width: 140 },
  // { columnName: 'propertyAddress', width: 140 },
  // { columnName: 'propertyCity', width: 130 },
  // { columnName: 'propertyState', width: 120 },
  // { columnName: 'managementOrCobrokeCompany', width: 160 },
  // { columnName: 'rentOrSalePrice', width: 100 },
  // { columnName: 'totalAmount', width: 120 },
  // { columnName: 'status', width: 120 },
  { columnName: 'view', width: 80 },
];

const defaultHiddenColumnNames = [
  'propertyAddress',
  'propertyState',
  'clientPhoneNumber',
  'managementOrCobrokeCompany',
];

const ViewCellFormatter = ({ value }) => <ViewFormatter value={value} />;

const ViewTypeProvider = props => (
  <DataTypeProvider formatterComponent={ViewCellFormatter} {...props} />
);

const pageSizes = [5, 10, 15, 20, 50, 100, 0];

const mapSizesToProps = ({ width }) => ({
  xsViewport: width < 412,
  smViewport: width < 600,
  mdViewport: width < 960,
  lgViewport: width < 1280,
});

@withStyles(styles)
@withSizes(mapSizesToProps)
class ListingsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 10,
      currentPage: 0,
      selection: [],
    };
  }

  componentDidMount() {
    if (this.props.onMount) this.props.onMount();
  }

  changePageSize = pageSize => {
    this.setState({ pageSize });
    if (this.state.pageSize < pageSize) {
      document.getElementById('myTableContainer').scrollTop = 0;
    }
  };

  currentPageChange = currentPage => {
    this.setState({ currentPage });
    document.getElementById('myTableContainer').scrollTop = 0;
  };

  changeSelection = selection => {
    this.setState({ selection });
  };

  render() {
    const {
      classes,
      columns,
      rows,
      lgViewport,
      changeSelection,
      convertDealsToCSV,
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <ViewTypeProvider for={['view']} />

          <DragDropProvider />
          <SearchState />
          <FilteringState columnExtensions={filteringStateColumnExtensions} />
          <SortingState
            defaultSorting={[{ columnName: 'listingID', direction: 'desc' }]}
            columnExtensions={sortingStateColumnExtensions}
          />
          <SelectionState
            selection={this.props.selection}
            onSelectionChange={changeSelection}
          />
          <PagingState
            currentPage={this.state.currentPage}
            pageSize={this.state.pageSize}
            onPageSizeChange={this.changePageSize}
            onCurrentPageChange={this.currentPageChange}
          />

          <IntegratedFiltering />

          <IntegratedSorting
            columnExtensions={integratedSortingColumnExtensions}
          />

          <IntegratedSelection />

          <IntegratedPaging />

          <VirtualTable
            height={isBrowser ? window.innerHeight - 246 : undefined}
            tableComponent={TableComponent}
            containerComponent={props => (
              <TableContainerComponent
                className={
                  lgViewport
                    ? classes.myTableContainerSmallViewPort
                    : classes.myTableContainer
                }
                {...props}
              />
            )}
            cellComponent={Cell}
            noDataCellComponent={NoDataCellComponent}
          />
          <TableColumnReordering
            defaultOrder={columns.map(column => column.name)}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />

          <TableFilterRow cellComponent={FilterCell} />
          <Toolbar />
          <SearchPanel />

          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
          />
          <ColumnChooser />

          <TableHeaderRow showSortingControls />
          <TableSelection showSelectAll selectByRowClick />
          <FeaturedForm listings={this.props.listings} />
          <PagingPanel pageSizes={pageSizes} />
        </Grid>

        {rows && rows.length ? (
          <Tooltip
            title="Download selected rows from table as CSV file."
            enterDelay={300}
            leaveDelay={100}
          >
            <span className={classes.editBtnsWrapper}>
              <button
                className={classes.downloadCSVBtn}
                onClick={convertDealsToCSV}
              >
                <MdFileDownload />
              </button>
            </span>
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

const featuredStyles = theme => ({
  formControl: {
    marginTop: 3 * theme.spacing.unit,
  },
});

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.featured.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

@withStyles(featuredStyles, {withTheme: true})
class FeaturedForm extends Component {
  state = {
    featured: [] 
  }

  createOptions = () => {
    return this.props.listings.map(listing => (
      <MenuItem key={listing.listingID} value={listing.listingID} style={getStyles(listing.listingID, this)}>
        {listing.listingID + ' - ' + listing.address}
      </MenuItem>
    ))
  }

  handleChange = (event) => {
    this.setState({featured: event.target.value});
  }

  handleSubmit = (event) => {
    featureListing(this.state.featured).then(console.log);
  }

  componentDidMount() {
    let featured = this.props.listings.filter(l => l.featured).map(l => l.listingID)
    this.setState({featured})
  }

  render() {
    return (
      <MaterialGrid container justify="center">
        <MaterialGrid item xs={5}>
          <FormControl fullWidth>
            <InputLabel htmlFor="age-native-simple">
              Featured Listing
            </InputLabel>
            <Select
              multiple
              value={this.state.featured}
              onChange={this.handleChange}
              renderValue={() => this.state.featured.join(', ')}
              inputProps={{
                name: 'age',
                id: 'age-native-simple',
              }}
            >
              {this.createOptions()}
            </Select>
            <Button color="secondary" onClick={this.handleSubmit}>Submit</Button>
          </FormControl>
        </MaterialGrid>
      </MaterialGrid>
    );
  }
}

export default ListingsTable;
