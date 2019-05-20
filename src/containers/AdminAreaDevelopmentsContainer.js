import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from 'material-ui/Typography';
import GraphIcon from '@material-ui/icons/Equalizer';
import SearchIcon from '@material-ui/icons/Search';
import { observer } from 'mobx-react';
import moment from 'moment';
import isBrowser from 'is-browser';
import Grid from 'material-ui/Grid';
import { DatePicker } from 'material-ui-pickers';
import TextField from 'material-ui/TextField';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MaterialCustomSelectInput from '../components/MaterialCustomSelectInput';
import AdminAreaDevelopmentsTableContainer from './AdminAreaDevelopmentsTableContainer';
import ViewListingDialogBox from '../components/ViewListingDialogBox';
import ViewDevelopmentDialogBox from '../components/ViewDevelopmentDialogBox';
import SubmitDevelopmentDialogBox from '../components/SubmitDevelopmentDialogBox';

const Loader = DotLoader;

const styles = theme => ({
  addDealBtn: {},
  dealsSummaryBtn: {
    marginLeft: '25px',
    backgroundColor: '#2995F3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2380D1',
    },
  },
  wrapper: {
    position: 'relative',
  },
  buttonsWrapper: {
    display: 'flex',
    marginBottom: '25px',
    justifyContent: 'center',
  },
  tableFormWrapper: {
    width: '100%',
    zIndex: 2,
    marginBottom: '20px',
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: '20px',
  }),
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  formControlWrapperCenter: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    textAlign: 'center',
  },
  submitBtnWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  submitBtnWrapper2: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2px',
  },
  searchBoxHeader: {
    marginBottom: '20px',
  },
  searchWrapper: {
    marginBottom: '25px',
  },
  heading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    color: 'rgba(0,0,0,.7)',
  },
  selectInput: {
    width: '167px',
    marginTop: '0px',
  },
  checkIcon: {
    marginLeft: '10px',
    color: 'green',
    fontSize: '.95rem',
  },
});

const selectInputItems = [
  { label: '' },
  { label: 'Agent Name' },
  { label: 'Client Name' },
  { label: 'Deal ID' },
];

const searchTypes = {
  dateRange: 'dateRange',
  specific: 'specific',
};

const listingsQuery = gql`
  query newdevelopments {
    newdevelopments {
      newdevelopmentID
      address
      description
      neighborhood
      borough
      category
      ownership
      type
    }
  }
`;

@observer
class AdminAreaDevelopmentsContainer extends Component {
  constructor(props) {
    super(props);

    const today = moment();

    this.state = {
      startDate: moment().subtract(1, 'months'),
      endDate: today,
      fineGrainSearchType: '',
      fineGrainSearchValue: '',
      currentSearchType: searchTypes.dateRange,
      maxDate: today,
      minDate: moment('2018-04-01'),
      listingsViewDialogBoxOpen: false,
      viewingListingID: '',
      viewingInvoiceStatus: '',
      deletedListingIDS: [],
      acceptedInvoiceIDS: [],
      formOpen: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ formOpen: true });
  };

  handleClose = () => {
    this.setState({ formOpen: false });
  };

  onStartDateCHange = date => {
    if (!date) this.setState({ startDate: date });
    if (date.isAfter(moment())) return;
    if (date.isAfter(this.state.endDate)) return;
    this.setState({ startDate: date });
  };

  onEndDateCHange = date => {
    if (!date) this.setState({ endDate: date });
    if (date.isAfter(moment())) return;
    if (date.isBefore(this.state.startDate)) return;
    this.setState({ endDate: date });
  };

  onDateRangeSearch = () => {
    const { currentSearchType } = this.state;

    if (currentSearchType !== searchTypes.dateRange) {
      this.setState({ currentSearchType: searchTypes.dateRange });
    }
  };

  onSpecificSearch = () => {
    const { currentSearchType } = this.state;

    if (currentSearchType !== searchTypes.specific) {
      this.setState({ currentSearchType: searchTypes.specific });
    }
  };

  handleCloseSnackbar = invoice => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  openListingsViewDialogBox = (listingID, status) => {
    this.setState({
      listingsViewDialogBoxOpen: true,
      viewingListingID: listingID,
      viewingInvoiceStatus: status,
    });
  };

  closeListingsViewDialogBox = () => {
    this.setState({
      listingsViewDialogBoxOpen: false,
      viewingListingID: null,
      viewingInvoiceStatus: '',
    });
  };

  invoiceAccepted = invoiceID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Invoice accepted successfully!',
      listingsViewDialogBoxOpen: false,
      acceptedInvoiceIDS: [...this.state.acceptedInvoiceIDS, invoiceID],
    });
  };

  invoiceDeleted = invoiceID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Invoice deleted successfully!',
      listingsViewDialogBoxOpen: false,
      deletedInvoiceIDS: [...this.state.deletedInvoiceIDS, invoiceID],
    });
  };

  render() {
    const { classes, userRole } = this.props;
    const {
      startDate,
      endDate,
      fineGrainSearchType,
      fineGrainSearchValue,
      currentSearchType,
      listingsViewDialogBoxOpen,
      viewingListingID,
      viewingInvoiceStatus,
      deletedInvoiceIDS,
      formOpen,
    } = this.state;
    const {
      onStartDateCHange,
      onEndDateCHange,
      onDateRangeSearch,
      onSpecificSearch,
      openListingsViewDialogBox,
      closeListingsViewDialogBox,
    } = this;

    return (
      <div className={classes.wrapper}>
        <div className={classes.buttonsWrapper}>
          <Button
            variant="raised"
            color="secondary"
            aria-label="add"
            onClick={this.handleClickOpen}
            classes={{ root: classes.addDealBtn }}
          >
            <AddIcon />
            Add a Development
          </Button>
        </div>
        <Query query={listingsQuery} ssr={false}>
          {({ loading, error, data, refetch }) => {
            if (loading)
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 110px)',
                    boxShadow:
                      '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Loader color="#f44336" loading />
                </div>
              );
            // TODO: change the error message to a generic
            // 'error connecting to server' message

            const intListings = {};

            if (error) {
              console.log(error);
              return (
                <div style={{ textAlign: 'center' }}>
                  We're sorry. There was an error processing your request.
                </div>
              );
            }

            const allListings = data.newdevelopments;

            allListings.forEach(listing => {
              intListings[listing.newdevelopmentID] = listing;
            });

            let uniqueListings = [];

            Object.keys(intListings).forEach(key => {
              uniqueListings.push(intListings[key]);
            });

            /*
            uniqueListings = uniqueListings.filter(
              listing =>
                !this.state.deletedListingIDS.includes(listing.newdevelopmentID)
            );
            */
            // .map(listing => {
            //   if (this.state.acceptedInvoiceIDS.includes(invoice.invoiceID)) {
            //     return { ...invoice, status: 'accepted' };
            //   } else {
            //     return invoice;
            //   }
            // });
            return (
              <div className={classes.wrapper}>
                {viewingListingID && (
                  <ViewDevelopmentDialogBox
                    formOpen={listingsViewDialogBoxOpen}
                    onClose={() => {
                      closeListingsViewDialogBox();
                      refetch();
                    }}
                    newdevelopmentID={viewingListingID}
                  />
                )}

                <AdminAreaDevelopmentsTableContainer
                  listings={uniqueListings}
                  openListingsViewDialogBox={openListingsViewDialogBox}
                />

                <Snackbar
                  classes={{ root: classes.snackBar }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  open={this.state.snackbarOpen}
                  autoHideDuration={4000}
                  onClose={this.handleCloseSnackbar}
                  message={
                    <span id="snackbar-id">{this.state.snackbarText}</span>
                  }
                  action={[
                    this.snackbarUndoFunction ? (
                      <Button
                        key="undo"
                        color="secondary"
                        size="small"
                        onClick={() => {
                          this.handleCloseSnackbar();
                          if (
                            this.state.snackbarUndoFunction &&
                            typeof snackbarUndoFunction === 'function'
                          ) {
                            this.snackbarUndoFunction();
                          }
                        }}
                      >
                        UNDO
                      </Button>
                    ) : (
                      undefined
                    ),
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleCloseSnackbar}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
                <SubmitDevelopmentDialogBox
                  open={formOpen}
                  onClickOpen={this.handleClickOpen}
                  onClose={() => {
                    this.handleClose();
                    refetch();
                  }}
                />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaDevelopmentsContainer);
