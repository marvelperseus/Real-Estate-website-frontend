import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { DotLoader } from 'react-spinners';
import moment from 'moment';
import Papa from 'papaparse';
import ListingsTable from '../components/ListingsTable';
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
  { name: 'listingID', title: 'Listing ID' },
  // { name: 'agentName', title: 'Agent Name' },
  { name: 'category', title: 'Category' },
  { name: 'type', title: 'Type' },
  { name: 'ownership', title: 'Ownership' },
  { name: 'address', title: 'Location' },
  { name: 'price', title: 'Price' },
  { name: 'description', title: 'Description' },
  { name: 'view', title: 'View' },
];

@observer
class ListingsTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
      selection: [],
    };
  }

  createRows = () => {
    const { listings, openDealsViewDialogBox } = this.props;
    return listings.map(listing => {
      const {
        listingID,
        address,
        agentName,
        price,
        description,
        category,
        ownership,
        type,
      } = listing;

      return {
        listingID,
        address,
        agentName,
        price: `$${price}`,
        description,
        category,
        ownership,
        type,
        view: {
          type: 'action',
          onClick: debounce(
            () => openDealsViewDialogBox({ listingID }),
            1000,
            true
          ),
        },
      };
    });
  };

  convertDealsToCSV = () => {
    // const { listings } = this.props;
    // const { selection } = this.state;
    // if (!selection || !selection.length) return;
    // const csvContent = Papa.unparse(
    //   deals
    //     .filter(deal => selection.includes(deal.dealID))
    //     .map(deal => ({
    //       ...deal,
    //       date: moment(deal.date).format('MM/DD/YYYY'),
    //     })),
    //   {
    //     header: true,
    //   }
    // );
    // if (this._csvLink) {
    //   this._csvLink.setAttribute(
    //     'href',
    //     `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
    //   );
    //   this._csvLink.setAttribute('download', 'deals_data.csv');
    //   this._csvLink.click();
    // }
  };

  changeSelection = selection => {
    this.setState({ selection });
  };

  render() {
    const { tableIsLoading, selection } = this.state;
    const { classes, listings, ...rest } = this.props;
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
        <ListingsTable
          {...rest}
          convertDealsToCSV={this.convertDealsToCSV}
          changeSelection={this.changeSelection}
          selection={selection}
          onMount={() =>
            tableIsLoading ? this.setState({ tableIsLoading: false }) : null
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

export default withStyles(styles)(ListingsTableContainer);
