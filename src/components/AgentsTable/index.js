import React, { Component } from 'react';
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
  DataTypeProvider,
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
} from '@devexpress/dx-react-grid-material-ui';
import Cell from '../../utils/backEndTableUtils/DefaultVirtualTableCell';
import TableComponent from '../../utils/backEndTableUtils/TableComponent';
import TableContainerComponent from '../../utils/backEndTableUtils/TableContainerComponent';
import NoDataCellComponent from '../../utils/backEndTableUtils/NoDataCellComponent';
import ProfilePictureFormatter from '../dataTableFormatters/ProfilePictureFormatter';
import ViewFormatter from '../dataTableFormatters/ViewFormatter';
import AreaOfFocusFormatter from '../dataTableFormatters/AreaOfFocusFormatter';

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
    height: 'calc(100vh - 245px) !important',
    // maxHeight: '800px',
  },
  myNoDataCellComponent: {
    borderBottom: 'none !important',
  },
});

const sortingStateColumnExtensions = [
  { columnName: 'photo', sortingEnabled: false },
  { columnName: 'view', sortingEnabled: false },
];

const filteringStateColumnExtensions = [
  { columnName: 'photo', filteringEnabled: false },
  { columnName: 'view', filteringEnabled: false },
];

const getRowId = row => row.email;

const FilterCell = props => {
  return <TableFilterRow.Cell {...props} />;
};

const defaultColumnWidths = [
  { columnName: 'agentID', width: 120 },
  { columnName: 'photo', width: 95 },
  { columnName: 'name', width: 150 },
  { columnName: 'email', width: 160 },
  { columnName: 'areaOfFocus', width: 150 },
  { columnName: 'mobileNumber', width: 150 },
  { columnName: 'companyNumberAndExt', width: 180 },
  { columnName: 'branch', width: 140 },
  { columnName: 'view', width: 120 },
];

const pageSizes = [5, 10, 15, 20, 50, 100, 0];

const mapSizesToProps = ({ width }) => ({
  xsViewport: width < 412,
  smViewport: width < 600,
  mdViewport: width < 960,
  lgViewport: width < 1280,
});

const PhotoFormatter = ({ value }) => <ProfilePictureFormatter value={value} />;

const PhotoTypeProvider = props => (
  <DataTypeProvider formatterComponent={PhotoFormatter} {...props} />
);

const ViewCellFormatter = ({ value }) => <ViewFormatter value={value} />;

const ViewTypeProvider = props => (
  <DataTypeProvider formatterComponent={ViewCellFormatter} {...props} />
);

const AreaOfFocusCellFormatter = ({ value }) => (
  <AreaOfFocusFormatter value={value} />
);

const AreaOfFocusTypeProvider = props => (
  <DataTypeProvider formatterComponent={AreaOfFocusCellFormatter} {...props} />
);

const TableContainerComponentWrapperBase = ({ classes, ...restProps }) => (
  <TableContainerComponent
    {...restProps}
    className={classes.myTableContainer}
  />
);

const TableContainerComponentWrapper = withStyles(styles)(
  TableContainerComponentWrapperBase
);

@withStyles(styles)
@withSizes(mapSizesToProps)
class AgentsTable extends Component {
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
    const { classes, columns, rows } = this.props;
    return (
      <div className={classes.root}>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <PhotoTypeProvider for={['photo']} />
          <ViewTypeProvider for={['view']} />
          <AreaOfFocusTypeProvider for={['areaOfFocus']} />

          <DragDropProvider />
          <SearchState />
          <FilteringState columnExtensions={filteringStateColumnExtensions} />
          <SortingState
            defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
            columnExtensions={sortingStateColumnExtensions}
          />
          <PagingState
            currentPage={this.state.currentPage}
            pageSize={this.state.pageSize}
            onPageSizeChange={this.changePageSize}
            onCurrentPageChange={this.currentPageChange}
          />

          <IntegratedFiltering />

          <IntegratedSorting />

          <IntegratedPaging />

          <VirtualTable
            height={isBrowser ? window.innerHeight - 245 : undefined}
            tableComponent={TableComponent}
            containerComponent={TableContainerComponentWrapper}
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
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </div>
    );
  }
}

export default AgentsTable;
