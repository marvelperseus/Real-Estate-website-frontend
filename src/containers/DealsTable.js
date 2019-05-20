import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { DotLoader } from 'react-spinners';
import moment from 'moment';
import Papa from 'papaparse';
import DealsTable from '../components/DealsTable';
import { capitalize } from '../utils/stringUtils';
import debounce from '../utils/debounce';
import { padStringToDecimalString } from '../utils/Math';

const Loader = DotLoader;

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
  { name: 'dealID', title: 'Deal ID' },
  { name: 'date', title: 'Date' },
  { name: 'dealType', title: 'Deal Type' },
  { name: 'clientName', title: 'Client Name' },
  { name: 'clientEmail', title: 'Client Email' },
  { name: 'propertyAddress', title: 'Property Address' },
  { name: 'propertyCity', title: 'Property City' },
  { name: 'managementOrCobrokeCompany', title: 'Mgmt/Co-Broke Co.' },
  { name: 'rentOrSalePrice', title: 'Rent/Sale Price' },
  { name: 'bonusPercentageAddedByAdmin', title: "Agent's Bonus %" },
  { name: 'netAgentCommission', title: 'Net Commission' },
  { name: 'dealTotal', title: 'Deal Total' },
  { name: 'status', title: 'Status' },
  { name: 'view', title: 'View' },
];

@observer
class DealsTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
      selection: [],
    };
  }

  createRows = () => {
    const { deals, openDealsViewDialogBox } = this.props;
    return deals.map(deal => {
      const {
        dealID,
        date,
        dealType,
        clientName,
        clientEmail,
        propertyAddress,
        city,
        managementOrCobrokeCompany,
        price,
        bonusPercentageAddedByAdmin,
        netAgentCommission,
        status,
        total,
        isCoAgent,
      } = deal;

      return {
        dealID,
        date: moment(date).format('MM/DD/YYYY'),
        dealType,
        clientName,
        clientEmail,
        propertyAddress,
        propertyCity: city,
        managementOrCobrokeCompany,
        rentOrSalePrice: `$${padStringToDecimalString(
          Number(price || 0).toLocaleString()
        )}`,
        bonusPercentageAddedByAdmin:
          status === 'pending'
            ? undefined
            : `%${bonusPercentageAddedByAdmin || 0}`,
        netAgentCommission:
          status === 'pending'
            ? undefined
            : `$${padStringToDecimalString(
              Number(netAgentCommission || 0).toLocaleString()
            )}`,
        dealTotal: `$${padStringToDecimalString(
          Number(total || 0).toLocaleString()
        )}`,
        status: capitalize(status),
        view: {
          type: 'action',
          onClick: debounce(
            () => openDealsViewDialogBox({ dealID, status, isCoAgent }),
            1000,
            true
          ),
        },
      };
    });
  };

  convertDealsToCSV = () => {
    const { deals } = this.props;
    const { selection } = this.state;

    if (!selection || !selection.length) return;

    const csvContent = Papa.unparse(
      deals.filter(deal => selection.includes(deal.dealID)).map(deal => ({
        ...deal,
        date: moment(deal.date).format('MM/DD/YYYY'),
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
      this._csvLink.setAttribute('download', 'deals_data.csv');
      this._csvLink.click();
    }
  };

  changeSelection = selection => {
    this.setState({ selection });
  };

  render() {
    const { tableIsLoading, selection } = this.state;
    const { classes, deals, ...rest } = this.props;
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
        <DealsTable
          {...rest}
          convertDealsToCSV={this.convertDealsToCSV}
          changeSelection={this.changeSelection}
          selection={selection}
          onMount={() => tableIsLoading ? this.setState({ tableIsLoading: false }) : null
          }
          columns={columns}
          rows={this.createRows()}
          toggleDealsSummaryDialogBox={this.props.toggleDealsSummaryDialogBox}
          isDealsWithGQLQuery={this.props.isDealsWithGQLQuery}
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

export default withStyles(styles)(DealsTableContainer);
