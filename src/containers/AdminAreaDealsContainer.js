import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import GraphIcon from '@material-ui/icons/Equalizer';
import { observer } from 'mobx-react';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import AdminAreaDealsTableContainer from './AdminAreaDealsTableContainer';
import AdminDealsSummaryDialogBox from '../components/AdminDealsSummaryDialogBox';
import ViewDealDialogBox from '../components/ViewDealDialogBox';
import deleteDeal from '../effects/deals/deleteDeal';

const Loader = DotLoader;

const styles = theme => ({
  dealsSummaryBtn: {
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

const dealsQuery = gql`
  query allDeals {
    allDeals {
      dealID
      date
      agentName
      agentType
      leadSource
      dealType
      propertyAddress
      state
      city
      apartmentNumber
      managementOrCobrokeCompany
      price
      clientName
      clientEmail
      paymentsTotal
      deductionsTotal
      deductionItems {
        agentID
        deductionType
        agentName
      }
      total
      agentNotes
      status
      bonusPercentageAddedByAdmin
      netAgentCommission
      netCompanyCommission
      isCoAgent
      agentID
    }
  }
`;

@observer
class AdminAreaDealsContainer extends Component {
  state = {
    dealsSummaryDialogBoxOpen: false,
    dealsViewDialogBoxOpen: false,
    viewingDealID: '',
    viewingDealStatus: '',
    deletedDealIDS: [],
    acceptedDealIDS: [],
    isCoAgent: false,
    agentID: '',
  };

  toggleDealsSummaryDialogBox = () => {
    this.setState({
      dealsSummaryDialogBoxOpen: !this.state.dealsSummaryDialogBoxOpen,
    });
  };

  openDealsViewDialogBox = ({
    dealID, status, isCoAgent, agentID,
  }) => {
    this.setState({
      dealsViewDialogBoxOpen: true,
      viewingDealID: dealID,
      viewingDealStatus: status,
      isCoAgent,
      agentID,
    });
  };

  closeDealsViewDialogBox = () => {
    this.setState({
      dealsViewDialogBoxOpen: false,
      viewingDealID: '',
      viewingDealStatus: '',
    });
  };

  deleteDeal = dealID => {
    deleteDeal(dealID)
      .then(res => {
        if (res.error) {
          console.log(res.error);
          return;
        }

        this.setState({
          snackbarOpen: true,
          snackbarText: 'Deal deleted successfully!',
          dealsViewDialogBoxOpen: false,
          deletedDealIDS: [...this.state.deletedDealIDS, dealID],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  dealDeleted = dealID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Deal deleted successfully!',
      dealsViewDialogBoxOpen: false,
      deletedDealIDS: [...this.state.deletedDealIDS, dealID],
    });
  };

  dealAccepted = dealID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Deal accepted successfully!',
      dealsViewDialogBoxOpen: false,
      acceptedDealIDS: [...this.state.acceptedDealIDS, dealID],
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      dealsSummaryDialogBoxOpen,
      dealsViewDialogBoxOpen,
      viewingDealID,
      viewingDealStatus,
      isCoAgent,
      agentID,
    } = this.state;
    const {
      toggleDealsSummaryDialogBox,
      closeDealsViewDialogBox,
    } = this;

    return (
      <Query query={dealsQuery} ssr={false} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) {
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
          }
          const intDeals = {};

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const { allDeals } = data;

          allDeals.forEach(deal => {
            intDeals[deal.dealID] = deal;
          });

          let uniqueDeals = [];

          Object.keys(intDeals).forEach(key => {
            uniqueDeals.push(intDeals[key]);
          });

          uniqueDeals = uniqueDeals
            .filter(deal => !this.state.deletedDealIDS.includes(deal.dealID))
            .map(deal => {
              if (this.state.acceptedDealIDS.includes(deal.dealID)) {
                return { ...deal, status: 'accepted' };
              }
              return deal;
            });

          console.log(uniqueDeals);

          return (
            <div className={classes.wrapper}>
              <div>
                <div className={classes.buttonsWrapper}>
                  <Button
                    variant="raised"
                    onClick={toggleDealsSummaryDialogBox}
                    classes={{ root: classes.dealsSummaryBtn }}
                  >
                    <GraphIcon />
                    Deals Summary
                  </Button>
                </div>
              </div>

              <ViewDealDialogBox
                dealsViewDialogBoxOpen={dealsViewDialogBoxOpen}
                closeDealsViewDialogBox={closeDealsViewDialogBox}
                viewingDealID={viewingDealID}
                viewingDealStatus={viewingDealStatus}
                toggleSnackbarOpen={this.toggleSnackbarOpen}
                setDealSuccessfullySubmitted={this.setDealSuccessfullyEditted}
                userRole={this.props.userRole}
                deleteDeal={this.deleteDeal}
                dealAccepted={this.dealAccepted}
                dealDeleted={this.dealDeleted}
                userUUID={agentID}
                isCoAgent={isCoAgent}
              />

              <AdminAreaDealsTableContainer
                deals={uniqueDeals}
                openDealsViewDialogBox={this.openDealsViewDialogBox}
              />
              <AdminDealsSummaryDialogBox
                toggleDealsSummaryDialogBox={toggleDealsSummaryDialogBox}
                dealsSummaryDialogBoxOpen={dealsSummaryDialogBoxOpen}
                deals={uniqueDeals}
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
                          this.state.snackbarUndoFunction
                          && typeof snackbarUndoFunction === 'function'
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
    );
  }
}

export default withStyles(styles)(AdminAreaDealsContainer);
