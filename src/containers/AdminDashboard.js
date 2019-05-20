import React, { Component } from 'react';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AdminDashboard from '../components/AdminDashboard';
import {toLocaleCurrency} from "../utils/currency";

const Loader = DotLoader;

const dealsQuery = gql`
  query allDeals {
    allDeals {
      date
      status
      netCompanyCommission
      total
    }
  }
`;

const styles = () => ({
  root: {
    maxWidth: '100%',
    marginBottom: 10,
  },
  snackBar: {
    marginTop: 30,
  },
});

@observer
@withStyles(styles)
class DashboardContainer extends Component {
  state = {
    snackbarText: '',
    snackbarOpen: false,
    year: moment().year()
  };

  returnDealData = (deals = []) => {
    let netCommissions = 0;
	  let grossCommissions = 0;
    let currentMonthNetCommissions = 0;
    let currentMonthNumOfDeals = 0;
    let numOfPendingDeals = 0;

    for (let deal of deals) {
    	if (moment(deal.date).year() === this.state.year || this.state.year === 'Total') {
		    netCommissions += deal.netCompanyCommission;
		    grossCommissions += deal.total;
    		if (deal.status === "pending") {
    			numOfPendingDeals++;
		    }
    		if (this.state.year === moment().year() && moment(deal.date).month() === moment().month()) {
    			currentMonthNetCommissions += deal.netCompanyCommission;
    			currentMonthNumOfDeals += 1;
		    }
	    }
    }

    return {
      netCommissions: toLocaleCurrency(netCommissions),
      currentMonthNetCommissions: this.state.year === moment().year() || this.state.year === 'Total'
	      ? toLocaleCurrency(currentMonthNetCommissions)
	      : 'N/A',
      currentMonthNumOfDeals: this.state.year === moment().year() || this.state.year === 'Total'
	      ? currentMonthNetCommissions
	      : 'N/A',
      numOfPendingDeals,
      grossCommissions: toLocaleCurrency(grossCommissions),
    };
  };

  submittedNewsAlertSuccessfully = () => {
    this.setState({
      snackbarText: 'News/Alert item successfully submitted!',
      snackbarOpen: true,
    });
  };

  deletedNewsAlertSuccessfully = () => {
    this.setState({
      snackbarText: 'News/Alert item successfully deleted!',
      snackbarOpen: true,
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  getYears = () => {
  	const years = ['Total'];
  	for (let year = 2018; year <= moment().year(); year++) {
  		years.push(year);
	  }
  	return years;
  }

  render() {
    const { userUUID, classes } = this.props;
    return (
      <Query
        query={dealsQuery}
        variables={{ uuid: userUUID }}
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

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const {
            netCommissions,
	          grossCommissions,
            currentMonthNetCommissions,
            currentMonthNumOfDeals,
            numOfPendingDeals
          } = this.returnDealData(data.allDeals);

          return (
            <div>
              <AdminDashboard
                userUUID={this.props.userUUID}
                userRole={this.props.userRole}
                grossCommissions={grossCommissions}
                netCommissions={netCommissions}
                currentMonthNetCommissions={currentMonthNetCommissions}
                submittedNewsAlertSuccessfully={this.submittedNewsAlertSuccessfully}
                deletedNewsAlertSuccessfully={this.deletedNewsAlertSuccessfully}
                currentMonthNumOfDeals={currentMonthNumOfDeals}
                numOfPendingDeals={numOfPendingDeals}
                years={this.getYears()}
                currentYear={this.state.year}
                changeYear={year => this.setState({year})}
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

export default DashboardContainer;
