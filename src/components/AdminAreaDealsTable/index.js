import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import withSizes from 'react-sizes';
import isBrowser from 'is-browser';
import Tooltip from 'material-ui/Tooltip';
import classnames from 'classnames';
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
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
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
  GroupingPanel,
  TableGroupRow,
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
  myTableContainerSmallViewPort: {
    minHeight: '300px',
    height: 'calc(100vh - 445px) !important',
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
  tableDealsSummaryBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    right: '-13px',
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
  { columnName: 'dealID', sortingEnabled: false },
  { columnName: 'view', filteringEnabled: false },
];

const filteringStateColumnExtensions = [
  { columnName: 'view', filteringEnabled: false },
];

const getRowId = row => row.dealID;

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
  { columnName: 'deductionsTotal', compare: compareNumber },
  { columnName: 'paymentsTotal', compare: compareNumber },
  { columnName: 'netPaymentsTotal', compare: compareNumber },
];

const defaultColumnWidths = [
  { columnName: 'dealID', width: 120 },
  { columnName: 'date', width: 120 },
  { columnName: 'agentName', width: 140 },
  { columnName: 'agentType', width: 120 },
  { columnName: 'coBrokeringAgent', width: 140 },
  { columnName: 'dealType', width: 120 },
  { columnName: 'clientName', width: 140 },
  { columnName: 'clientEmail', width: 140 },
  { columnName: 'propertyAddress', width: 140 },
  { columnName: 'propertyCity', width: 120 },
  { columnName: 'propertyState', width: 120 },
  { columnName: 'managementOrCobrokeCompany', width: 160 },
  { columnName: 'rentOrSalePrice', width: 110 },
  { columnName: 'deductionsTotal', width: 110 },
  { columnName: 'paymentsTotal', width: 110 },
  { columnName: 'netPaymentsTotal', width: 110 },
  { columnName: 'bonusPercentageAddedByAdmin', width: 120 },
  { columnName: 'netAgentCommission', width: 170 },
  { columnName: 'netCompanyCommission', width: 170 },
  { columnName: 'outsideCompanyCheck', width: 120 },
  { columnName: 'status', width: 120 },
  { columnName: 'view', width: 100 },
];

const defaultHiddenColumnNames = [
  'paymentsTotal',
  'propertyState',
  'clientEmail',
  'managementOrCobrokeCompany',
  'bonusPercentageAddedByAdmin',
  'propertyCity',
  'coBrokeringAgent',
  'outsideCompanyCheck'
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
class DealsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 10,
      currentPage: 0,
      grouping: [{ columnName: 'status' }],
      groupingStateColumnExtensions: [
        { columnName: 'dealID', groupingEnabled: false },
        { columnName: 'date', groupingEnabled: false },
        { columnName: 'clientName', groupingEnabled: false },
        { columnName: 'clientEmail', groupingEnabled: false },
        { columnName: 'propertyAddress', groupingEnabled: false },
        { columnName: 'propertyCity', groupingEnabled: false },
        { columnName: 'propertyState', groupingEnabled: false },
        { columnName: 'managementOrCobrokeCompany', groupingEnabled: false },
        { columnName: 'rentOrSalePrice', groupingEnabled: false },
        { columnName: 'deductionsTotal', groupingEnabled: false },
        { columnName: 'paymentsTotal', groupingEnabled: false },
        { columnName: 'netPaymentsTotal', groupingEnabled: false },
        { columnName: 'bonusPercentageAddedByAdmin', groupingEnabled: false },
        { columnName: 'netAgentCommission', groupingEnabled: false },
        { columnName: 'netCompanyCommission', groupingEnabled: false },
        { columnName: 'outsideCompanyCheck', groupingEnabled: false },
        { columnName: 'view', groupingEnabled: false },
      ],
      integratedGroupingColumnExtensions: [
        { columnName: 'view', criteria: value => ({ key: value.id }) },
      ],
      defaultExpandedGroups: ['Pending'],
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

  getTableContainerComponent = props => {
    const { lgViewport, classes } = this.props;
    const className = lgViewport
      ? classes.myTableContainerSmallViewPort
      : classes.myTableContainer;
    return <TableContainerComponent className={className} {...props} />;
  };

  render() {
    const {
      classes,
      columns,
      rows,
      changeSelection,
      convertDealsToCSV,
    } = this.props;
    const {
      grouping,
      groupingStateColumnExtensions,
      integratedGroupingColumnExtensions,
      defaultExpandedGroups,
    } = this.state;
    return (
      <div className={classnames(classes.root, 'deal-table-wrapper')}>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <ViewTypeProvider for={['view']} />

          <DragDropProvider />
          <SearchState />
          <FilteringState columnExtensions={filteringStateColumnExtensions} />
          <SortingState
            defaultSorting={[{ columnName: 'date', direction: 'desc' }]}
            columnExtensions={sortingStateColumnExtensions}
          />
          <SelectionState
            selection={this.props.selection}
            onSelectionChange={changeSelection}
          />
          <GroupingState
            defaultGrouping={grouping}
            columnExtensions={groupingStateColumnExtensions}
            defaultExpandedGroups={defaultExpandedGroups}
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

          <IntegratedGrouping
            columnExtensions={integratedGroupingColumnExtensions}
          />

          <IntegratedSelection />

          <IntegratedPaging />

          <VirtualTable
            height={isBrowser ? window.innerHeight - 310 : undefined}
            tableComponent={TableComponent}
            containerComponent={this.getTableContainerComponent}
            cellComponent={Cell}
            noDataCellComponent={NoDataCellComponent}
          />
          <TableColumnReordering
            defaultOrder={columns.map(column => column.name)}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />

          <TableFilterRow cellComponent={FilterCell} />
          <TableGroupRow />
          <Toolbar />
          <SearchPanel />

          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
          />
          <ColumnChooser />

          <TableHeaderRow showSortingControls showGroupingControls />
          <TableSelection showSelectAll selectByRowClick />
          <GroupingPanel showGroupingControls />
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

        {this.props.isDealsWithGQLQuery ? (
          <Tooltip
            title="Click to view deals summary"
            enterDelay={300}
            leaveDelay={100}
          >
            <span className={classes.tableDealsSummaryBtnsWrapper}>
              <button
                className={classes.tableDealsSummaryBtn}
                onClick={this.props.toggleDealsSummaryDialogBox}
              >
                <GraphIcon />
              </button>
            </span>
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

export default DealsTable;
