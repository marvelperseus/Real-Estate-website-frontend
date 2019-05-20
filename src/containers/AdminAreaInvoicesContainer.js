import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
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
import AdminAreaInvoicesTableContainer from './AdminAreaInvoicesTableContainer';
import ViewInvoiceDialogBox from '../components/ViewInvoiceDialogBox';
import deleteInvoice from '../effects/invoices/deleteInvoice';
import acceptInvoice from '../effects/invoices/acceptInvoice';

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

const invoicesQuery = gql`
  query allInvoices {
    allInvoices {
      invoiceID
      date
      agentType
      agentName
      invoiceType
      clientName
      clientPhoneNumber
      propertyAddress
      city
      state
      managementOrCobrokeCompany
      price
      total
      status
    }
  }
`;

@observer
class AdminAreaDealsContainer extends Component {
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
      invoicesViewDialogBoxOpen: false,
      viewingInvoiceID: '',
      viewingInvoiceStatus: '',
      deletedInvoiceIDS: [],
      acceptedInvoiceIDS: [],
    };
  }

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

  openInvoicesViewDialogBox = (invoiceID, status) => {
    this.setState({
      invoicesViewDialogBoxOpen: true,
      viewingInvoiceID: invoiceID,
      viewingInvoiceStatus: status,
    });
  };

  closeInvoicesViewDialogBox = () => {
    this.setState({
      invoicesViewDialogBoxOpen: false,
      viewingInvoiceID: '',
      viewingInvoiceStatus: '',
    });
  };

  invoiceAccepted = invoiceID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Invoice accepted successfully!',
      invoicesViewDialogBoxOpen: false,
      acceptedInvoiceIDS: [...this.state.acceptedInvoiceIDS, invoiceID],
    });
  };

  invoiceDeleted = invoiceID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Invoice deleted successfully!',
      invoicesViewDialogBoxOpen: false,
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
      invoicesViewDialogBoxOpen,
      viewingInvoiceID,
      viewingInvoiceStatus,
      deletedInvoiceIDS,
    } = this.state;
    const {
      onStartDateCHange,
      onEndDateCHange,
      onDateRangeSearch,
      onSpecificSearch,
      openInvoicesViewDialogBox,
      closeInvoicesViewDialogBox,
    } = this;

    return (
      <div className={classes.wrapper}>
        {/*<div className={classes.searchWrapper}>
          <Grid container spacing={16}>
            <Grid item xs={12} lg={6}>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography align="center" color="inherit" className={classes.heading}>
                    Search Deals By: Date Range (Default)
                    {currentSearchType === searchTypes.dateRange ? <CheckCircleIcon classes={{ root: classes.checkIcon }} /> : null}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={classes.tableFormWrapper}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.formControlWrapperCenter}>

                          {isBrowser ? <DatePicker
                            value={startDate}
                            onChange={onStartDateCHange}
                            clearable
                            label="Start Day"
                            className={classes.textField}
                            minDate={this.state.minDate}
                            maxDate={this.state.endDate || this.state.maxDate}
                            disableFuture
                            format="MMM Do YYYY"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            maxDateMessage="Date must be less than today"
                          /> : null}


                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.formControlWrapperCenter}>
                          {isBrowser ? <DatePicker
                            value={endDate}
                            onChange={onEndDateCHange}
                            clearable
                            label="End Day"
                            className={classes.textField}
                            disableFuture
                            format="MMM Do YYYY"
                            minDate={startDate || this.state.minDate}
                            maxDate={this.state.maxDate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            maxDateMessage="Date must be less than today"
                          /> : null}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={classes.submitBtnWrapper}>
                          <Button
                            variant="raised"
                            onClick={onDateRangeSearch}
                            color="secondary"
                          >
                            <SearchIcon />
                            Search
                          </Button>
                        </div>
                      </Grid>
                    </Grid>

                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>

            <Grid item xs={12} lg={6}>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography align="center" color="inherit" className={classes.heading}>
                    Search Deals By: Other
                    {currentSearchType === searchTypes.specific ? <CheckCircleIcon classes={{ root: classes.checkIcon }} /> : null}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={classes.tableFormWrapper}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.formControlWrapperCenter}>
                          <MaterialCustomSelectInput
                            className={classes.selectInput}
                            value={fineGrainSearchType || undefined}
                            onChange={({ target }) => this.setState({ fineGrainSearchType: target.value })}
                            placeholder="Search Type..."
                            label="Search Type"
                            inputProps={{}}
                            selectInputItems={selectInputItems}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className={classes.formControlWrapperCenter}>
                          <TextField
                            id="fineGrainSearchValue"
                            label="Search Item..."
                            type="text"
                            value={fineGrainSearchValue}
                            onChange={({ target }) => this.setState({ fineGrainSearchValue: target.value })}
                            className={classes.textField}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={classes.submitBtnWrapper2}>
                          <Button
                            variant="raised"
                            onClick={onSpecificSearch}
                            color="secondary"
                          >
                            <SearchIcon />
                            Search
                          </Button>
                        </div>
                      </Grid>
                    </Grid>

                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>

          </Grid>
                          </div>*/}

        <Query query={invoicesQuery} ssr={false}>
          {({ loading, error, data }) => {
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

            const intInvoices = {};

            if (error) {
              console.log(error);
              return (
                <div style={{ textAlign: 'center' }}>
                  We're sorry. There was an error processing your request.
                </div>
              );
            }

            const allInvoices = data.allInvoices;

            allInvoices.forEach(invoice => {
              intInvoices[invoice.invoiceID] = invoice;
            });

            let uniqueInvoices = [];

            Object.keys(intInvoices).forEach(key => {
              uniqueInvoices.push(intInvoices[key]);
            });

            uniqueInvoices = uniqueInvoices
              .filter(
                invoice =>
                  !this.state.deletedInvoiceIDS.includes(invoice.invoiceID)
              )
              .map(invoice => {
                if (this.state.acceptedInvoiceIDS.includes(invoice.invoiceID)) {
                  return { ...invoice, status: 'accepted' };
                } else {
                  return invoice;
                }
              });

            return (
              <div className={classes.wrapper}>
                <ViewInvoiceDialogBox
                  invoicesViewDialogBoxOpen={invoicesViewDialogBoxOpen}
                  closeInvoicesViewDialogBox={closeInvoicesViewDialogBox}
                  viewingInvoiceID={viewingInvoiceID}
                  viewingInvoiceStatus={viewingInvoiceStatus}
                  toggleSnackbarOpen={this.toggleSnackbarOpen}
                  acceptInvoice={this.acceptInvoice}
                  setInvoiceSuccessfullySubmitted={
                    this.setInvoiceSuccessfullyEditted
                  }
                  userRole={this.props.userRole}
                  invoiceAccepted={this.invoiceAccepted}
                  invoiceDeleted={this.invoiceDeleted}
                />

                <AdminAreaInvoicesTableContainer
                  invoices={uniqueInvoices}
                  openInvoicesViewDialogBox={openInvoicesViewDialogBox}
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
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaDealsContainer);
