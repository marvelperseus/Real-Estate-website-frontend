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
import DealsTableContainer from './DealsTable';
import AdminDealsTableContainer from './AdminAreaDealsTableContainer';
import DealsSummarDialogBox from '../components/DealsSummarDialogBox';
import ViewDealDialogBox from '../components/ViewDealDialogBox';

const Loader = DotLoader;

const dealsQuery = gql`
  query dealsByAgentID($uuid: String!) {
    dealsByAgentID(uuid: $uuid) {
      dealID
      date
      agentID
      dealType
      clientName
      clientEmail
      propertyAddress
      city
      state
      managementOrCobrokeCompany
      price
      status
      bonusPercentageAddedByAdmin
      netAgentCommission
      total
      isCoAgent
    }
  }
`;

const adminDealsByAgentID = gql`
  query dealsByAgentID($uuid: String!) {
    dealsByAgentID(uuid: $uuid) {
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
      total
      agentNotes
      bonusPercentageAddedByAdmin
      netAgentCommission
      netCompanyCommission
      deductionItems {
        agentID
        deductionType
        agentName
      }
      status
      isCoAgent
    }
  }
`;

const styles = () => ({
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
  snackBar: {
    marginTop: 30,
  },
});

@observer
class DealsWithGQLQuery extends Component {
  state = {
    submitDealDialogOpen: false,
    dealsSummaryDialogBoxOpen: false,
    snackbarOpen: false,
    snackbarText: '',
    snackbarUndoFunction: null,
    addedDeals: [],
    dealsViewDialogBoxOpen: false,
    viewingDealID: '',
    viewingDealStatus: '',
    deletedDealIDS: [],
    userUUID: this.props.userUUID,
    acceptedDealIDS: [],
    isCoAgent: false,
    coBrokeAgentId: null
  };

  toggleAddDealDialogBox = () => {
    this.setState({ submitDealDialogOpen: !this.state.submitDealDialogOpen });
  };

  toggleDealsSummaryDialogBox = () => {
    this.setState({
      dealsSummaryDialogBoxOpen: !this.state.dealsSummaryDialogBoxOpen,
    });
  };

  setDealSuccessfullySubmitted = newDeal => {
    this.setState({
      submitDealDialogOpen: false,
      snackbarOpen: true,
      snackbarText: 'Deal submitted successfully',
      addedDeals: [...this.state.addedDeals, newDeal],
    });
  };

  setDealSuccessfullyEditted = newDeal => {
    const addedDeals = this.state.addedDeals.filter(
      deal => deal.dealID !== newDeal.dealID
    );
    this.setState({
      dealsViewDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Deal updated successfully',
      addedDeals: [...addedDeals, newDeal],
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  openDealsViewDialogBox = ({ dealID, status, isCoAgent, coBrokeAgentId }) => {
    this.setState({
      dealsViewDialogBoxOpen: true,
      viewingDealID: dealID,
      viewingDealStatus: status,
      isCoAgent,
      coBrokeAgentId: coBrokeAgentId
    });
  };

  closeDealsViewDialogBox = () => {
    this.setState({
      dealsViewDialogBoxOpen: false,
      viewingDealID: '',
      viewingDealStatus: '',
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

  render() {
    const { classes, userUUID, isAdmin } = this.props;
    const {
      dealsSummaryDialogBoxOpen,
      dealsViewDialogBoxOpen,
      viewingDealID,
      viewingDealStatus,
      isCoAgent,
      coBrokeAgentId
    } = this.state;
    const {
      toggleDealsSummaryDialogBox,
      openDealsViewDialogBox,
      closeDealsViewDialogBox,
    } = this;

    return (
      <Query
        query={isAdmin ? adminDealsByAgentID : dealsQuery}
        variables={{ uuid: userUUID || this.state.userUUID }}
        ssr={false}
        fetchPolicy="cache-and-network"
      >
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

          const allDeals = [...data.dealsByAgentID, ...this.state.addedDeals];

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
            <div
              className={classes.wrapper}
              style={{
                paddingTop: !this.props.largeDealsSummaryBtn
                  ? '10px'
                  : 'initial',
              }}
            >
              <div>
                {this.props.largeDealsSummaryBtn && (
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
                )}
                {isAdmin ? (
                  <ViewDealDialogBox
                    dealsViewDialogBoxOpen={dealsViewDialogBoxOpen}
                    closeDealsViewDialogBox={closeDealsViewDialogBox}
                    viewingDealID={viewingDealID}
                    viewingDealStatus={viewingDealStatus}
                    toggleSnackbarOpen={this.toggleSnackbarOpen}
                    setDealSuccessfullySubmitted={
                      this.setDealSuccessfullyEditted
                    }
                    userRole={this.props.userRole}
                    deleteDeal={this.deleteDeal}
                    dealAccepted={this.dealAccepted}
                    dealDeleted={this.dealDeleted}
                    userUUID={userUUID}
                    isCoAgent={isCoAgent}
                    coBrokeAgentId={coBrokeAgentId}
                  />
                ) : (
                    <ViewDealDialogBox
                      dealsViewDialogBoxOpen={dealsViewDialogBoxOpen}
                      closeDealsViewDialogBox={closeDealsViewDialogBox}
                      userUUID={userUUID}
                      viewingDealID={viewingDealID}
                      viewingDealStatus={viewingDealStatus}
                      toggleSnackbarOpen={this.toggleSnackbarOpen}
                      setDealSuccessfullySubmitted={
                        this.setDealSuccessfullyEditted
                      }
                      userRole={this.props.userRole}
                      dealDeleted={this.dealDeleted}
                      isCoAgent={isCoAgent}
                    />
                  )}
              </div>
              {this.props.isAdmin ? (
                <AdminDealsTableContainer
                  deals={uniqueDeals}
                  openDealsViewDialogBox={openDealsViewDialogBox}
                  toggleDealsSummaryDialogBox={toggleDealsSummaryDialogBox}
                  isDealsWithGQLQuery
                />
              ) : (
                  <DealsTableContainer
                    deals={uniqueDeals}
                    openDealsViewDialogBox={openDealsViewDialogBox}
                    toggleDealsSummaryDialogBox={toggleDealsSummaryDialogBox}
                    isDealsWithGQLQuery
                  />
                )}
              <DealsSummarDialogBox
                toggleDealsSummaryDialogBox={toggleDealsSummaryDialogBox}
                dealsSummaryDialogBoxOpen={dealsSummaryDialogBoxOpen}
                deals={uniqueDeals}
                userUUID={userUUID}
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

export default withStyles(styles)(DealsWithGQLQuery);
