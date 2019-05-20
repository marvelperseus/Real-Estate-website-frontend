import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { DotLoader } from 'react-spinners';
import Chance from 'chance';
import isBrowser from 'is-browser';
import moment from 'moment';
import Papa from 'papaparse';
import AdminAreaDevelopmentsTable from '../components/AdminAreaDevelopmentsTable';
import { capitalize } from '../utils/stringUtils';
import { round } from '../utils/Math';
import debounce from '../utils/debounce';

const chance = new Chance();

const Loader = DotLoader;

const returnAgentType = number => {
  if (number < 33) {
    return 60;
  } else if (number < 66) {
    return 70;
  } else {
    return 80;
  }
};

const styles = theme => ({
  root: {
    position: 'relative',
  },
  progress: {
    margin: theme.spacing.unit * 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'block',
  },
  progressWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '60px 20px',
    borderRadius: '3px',
    backgroundColor: '#fff',
    zIndex: 2,
  },
});

const columns = [
  { name: 'newdevelopmentID', title: 'Listing ID' },
  { name: 'category', title: 'Category' },
  { name: 'type', title: 'Type' },
  { name: 'ownership', title: 'Ownership' },
  { name: 'address', title: 'Address' },
  { name: 'neighborhood', title: 'Neighborhood' },
  { name: 'borough', title: 'Borough' },
  { name: 'description', title: 'Description' },
  // { name: 'managementOrCobrokeCompany', title: 'Mgmt/Co-Broke Co.' },
  // { name: 'rentOrSalePrice', title: 'Rent/Sale Price' },
  // { name: 'totalAmount', title: 'Total Amount' },
  // { name: 'status', title: 'Status' },
  { name: 'view', title: 'View' },
];

@observer
class AdminAreaListingsTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
      selection: [],
    };
  }

  createRows = () => {
    return this.props.listings.map(listing => {
      const {
        newdevelopmentID,
        address,
        agentName,
        description,
        neighborhood,
        borough,
        price,
        category,
        type,
        ownership,
      } = listing;

      return {
        ...listing,
        view: {
          type: 'action',
          onClick: () =>
            debounce(
              this.props.openListingsViewDialogBox.bind(
                null,
                newdevelopmentID,
                status
              ),
              1000,
              true
            )(),
        },
      };
    });
  };

  convertDealsToCSV = () => {
    const { invoices } = this.props;
    const { selection } = this.state;

    if (!selection || !selection.length) return;

    const csvContent = Papa.unparse(
      invoices
        .filter(invoice => selection.includes(invoice.invoiceID))
        .map(invoice => ({
          ...invoice,
          date: moment(invoice.date).format('MM/DD/YYYY'),
        })),
      {
        header: true,
      }
    );

    if (this._csvLink) {
      this._csvLink.setAttribute(
        'href',
        `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
      );
      this._csvLink.setAttribute('download', 'invoices_data.csv');
      this._csvLink.click();
    }
  };

  changeSelection = selection => {
    this.setState({ selection });
  };

  render() {
    const { tableIsLoading, rows, selection } = this.state;
    const { classes, small, ...rest } = this.props;
    return (
      <div className={classes.root}>
        {tableIsLoading ? (
          <div
            className={classes.progressWrapper}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100vh - 180px)',
            }}
          >
            <Loader color="#f44336" loading />
          </div>
        ) : null}
        <AdminAreaDevelopmentsTable
          {...rest}
          changeSelection={this.changeSelection}
          selection={selection}
          convertDealsToCSV={this.convertDealsToCSV}
          small={small}
          onMount={() =>
            tableIsLoading ? this.setState({ tableIsLoading: false }) : null
          }
          columns={columns}
          rows={this.createRows()}
        />
        <a
          href="#"
          id="csvLink"
          ref={ref => (this._csvLink = ref)}
          style={{
            visibility: 'hidden',
            position: 'absolute',
            poniterEvents: 'none',
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaListingsTableContainer);
