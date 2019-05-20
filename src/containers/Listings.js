import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import GraphIcon from '@material-ui/icons/Equalizer';
import { observer } from 'mobx-react';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import SubmitListingDialogBox from '../components/SubmitListingDialogBox';
import ListingsTableContainer from './ListingsTable';
import ViewListingDialogBox from '../components/ViewListingDialogBox';

const Loader = DotLoader;

const listingsQuery = gql`
  query allListingsByAgentID($uuid: String!) {
    allListingsByAgentID(uuid: $uuid) {
      listingID
      agentID
      agentName
      category 
      ownership
      type
      address
      description
      price
    }
  }
`;

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
  snackBar: {
    marginTop: 30,
  },
});

@observer
class Listings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitListingDialogOpen: false,
      dealsSummaryDialogBoxOpen: false,
      snackbarOpen: false,
      snackbarText: '',
      snackbarUndoFunction: null,
      addedListings: [],
      listingsViewDialogBoxOpen: false,
      viewingListingID: '',
      viewingListingStatus: '',
      deletedListingIDS: [],
      userUUID: this.props.userUUID,
      isCoAgent: false,
    };
  }

  toggleAddListingDialogBox = () => {
    this.setState({
      submitListingDialogOpen: !this.state.submitListingDialogOpen,
    });
  };

  toggleDealsSummaryDialogBox = () => {
    this.setState({
      dealsSummaryDialogBoxOpen: !this.state.dealsSummaryDialogBoxOpen,
    });
  };

  setListingSuccessfullySubmitted = newListing => {
    this.setState({
      submitListingDialogOpen: false,
      snackbarOpen: true,
      snackbarText: 'Listing submitted successfully',
      addedListings: [...this.state.addedListings, newListing],
    });
  };

  setListingSuccessfullyEditted = newListing => {
    const addedListings = this.state.addedListings.filter(
      listing => listing.listingID !== newListing.listingID
    );
    this.setState({
      listingsViewDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Listing updated successfully',
      addedListings: [...addedListings, newListing],
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  openListingsViewDialogBox = ({ listingID, status, isCoAgent }) => {
    this.setState({
      listingsViewDialogBoxOpen: true,
      viewingListingID: listingID,
      viewingListingStatus: status,
      isCoAgent,
    });
  };

  closeListingsViewDialogBox = () => {
    this.setState({
      listingsViewDialogBoxOpen: false,
      viewingListingID: '',
      viewingListingStatus: '',
    });
  };

  listingDeleted = listingID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Listing deleted successfully!',
      listingsViewDialogBoxOpen: false,
      deletedListingIDS: [...this.state.deletedListingIDS, listingID],
    });
  };

  render() {
    const { classes, userUUID } = this.props;
    const {
      submitListingDialogOpen,
      listingsViewDialogBoxOpen,
      viewingListingID,
      viewingListingStatus,
      isCoAgent,
    } = this.state;
    const {
      toggleAddListingDialogBox,
      openListingsViewDialogBox,
      closeListingsViewDialogBox,
    } = this;
    return (
      <Query
        query={listingsQuery}
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
          const intListings = {};

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const allListings = [
            ...data.allListingsByAgentID,
            ...this.state.addedListings,
          ];

          allListings.forEach(listing => {
            if (listing) {
              intListings[listing.listingID] = listing;
            }
          });

          let uniqueListings = [];

          Object.keys(intListings).forEach(key => {
            uniqueListings.push(intListings[key]);
          });

          uniqueListings = uniqueListings.filter(
            listing => !this.state.deletedListingIDS.includes(listing.listingID)
          );

          // console.log('uniqueListings',uniqueListings);

          return (
            <div className={classes.wrapper}>
              <div>
                <div className={classes.buttonsWrapper}>
                  <Button
                    variant="raised"
                    color="secondary"
                    aria-label="add"
                    onClick={toggleAddListingDialogBox}
                    classes={{ root: classes.addDealBtn }}
                  >
                    <AddIcon />
                    Add a Listing
                  </Button>
                  {/* <Button
                    variant="raised"
                    onClick={toggleDealsSummaryDialogBox}
                    classes={{ root: classes.dealsSummaryBtn }}
                  >
                    <GraphIcon />
                    Deals Summary
                  </Button> */}
                </div>
                <SubmitListingDialogBox
                  submitDealDialogOpen={submitListingDialogOpen}
                  toggleDialogBoxOpen={toggleAddListingDialogBox}
                  userUUID={userUUID}
                  toggleSnackbarOpen={this.toggleSnackbarOpen}
                  setListingSuccessfullySubmitted={
                    this.setListingSuccessfullySubmitted
                  }
                />

                <ViewListingDialogBox
                  listingsViewDialogBoxOpen={listingsViewDialogBoxOpen}
                  closeListingsViewDialogBox={closeListingsViewDialogBox}
                  userUUID={userUUID}
                  viewingListingID={viewingListingID}
                  viewingListingStatus={viewingListingStatus}
                  toggleSnackbarOpen={this.toggleSnackbarOpen}
                  setListingSuccessfullySubmitted={
                    this.setListingSuccessfullyEditted
                  }
                  userRole={this.props.userRole}
                  listingDeleted={this.listingDeleted}
                  isCoAgent={isCoAgent}
                />
              </div>
              <ListingsTableContainer
                listings={uniqueListings}
                openDealsViewDialogBox={openListingsViewDialogBox}
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
    );
  }
}

export default withStyles(styles)(Listings);
