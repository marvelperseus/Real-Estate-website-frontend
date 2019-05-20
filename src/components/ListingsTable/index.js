import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import withSizes from 'react-sizes';
import isBrowser from 'is-browser';
import Tooltip from 'material-ui/Tooltip';
import {
  SortingState,
  FilteringState,
  SearchState,
  IntegratedFiltering,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
  SelectionState,
  IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  TableColumnResizing,
  DragDropProvider,
  TableColumnReordering,
  Toolbar,
  SearchPanel,
  PagingPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import { MdFileDownload } from 'react-icons/lib/md';
import GraphIcon from '@material-ui/icons/Equalizer';
import SelectFilterCell from '../../utils/backEndTableUtils/SelectFilterCell';
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
    position: 'relative',
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
  editBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    left: '-13px',
  },
  tableDealsSummaryBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    right: '-13px',
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
  tableDealsSummaryBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '34px',
    width: '34px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#2995F3',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out, color .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
      backgroundColor: '#2380D1',
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
  { label: 'Pending' },
  { label: 'Approved' },
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
  { columnName: 'listingID', width: 120 },
  { columnName: 'category', width: 120 },
  { columnName: 'type', width: 120 },
  { columnName: 'ownership', width: 120 },
  { columnName: 'agentName', width: 120 },
  { columnName: 'address', width: 120 }, 
  { columnName: 'price', width: 120 },
  { columnName: 'description', width: 120 },
  { columnName: 'view', width: 80 },
];

const pageSizes = [5, 10, 15, 20, 50, 100, 0];

const mapSizesToProps = ({ width }) => ({
  xsViewport: width < 412,
  smViewport: width < 600,
  mdViewport: width < 960,
  lgViewport: width < 1280,
});

const ViewCellFormatter = ({ value }) => <ViewFormatter value={value} />;

const ViewTypeProvider = props => (
  <DataTypeProvider formatterComponent={ViewCellFormatter} {...props} />
);

@withStyles(styles)
@withSizes(mapSizesToProps)
class ListingsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 10,
      currentPage: 0,
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

  render() {
    const {
      classes,
      columns,
      rows,
      convertDealsToCSV,
      changeSelection,
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
            height={isBrowser ? window.innerHeight - 310 : undefined}
            tableComponent={TableComponent}
            containerComponent={TableContainerComponent}
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

          <TableHeaderRow showSortingControls />
          <TableSelection showSelectAll selectByRowClick />
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

export default ListingsTable;
