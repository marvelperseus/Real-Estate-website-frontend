import React, { Component } from 'react';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import moment from 'moment';
import AgentDashboard from '../components/AgentDashboard';
import { toLocaleCurrency } from '../utils/currency';

const Loader = DotLoader;

const dealsQuery = gql`
  query dealsByAgentID($uuid: String!) {
    dealsByAgentID(uuid: $uuid) {
      date
      status
      netAgentCommission
      total
    }
  }
`;

@observer
class DashboardContainer extends Component {
  returnDealData = (deals = []) => {
    const currentMonth = moment().month();
    let netCommissionsToDate = 0;
    let currentMonthNetCommissions = 0;
    let currentMonthNumOfDealsCommissions = 0;
    let numOfPendingDeals = 0;

    deals.forEach(deal => {
      if (deal.status === 'pending') {
        numOfPendingDeals += 1;
        return;
      }

      netCommissionsToDate += deal.netAgentCommission || 0;

      if (moment(deal.date).month() === currentMonth) {
        currentMonthNumOfDealsCommissions += 1;
        currentMonthNetCommissions += deal.netAgentCommission || 0;
      }
    });

    return {
      netCommissionsToDate: toLocaleCurrency(netCommissionsToDate),
      currentMonthNetCommissions: toLocaleCurrency(currentMonthNetCommissions),
      currentMonthNumOfDealsCommissions,
      numOfPendingDeals,
    };
  };

  render() {
    const { userUUID } = this.props;
    return (
      <Query query={dealsQuery} variables={{ uuid: userUUID }} ssr={false}>
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
            netCommissionsToDate,
            currentMonthNetCommissions,
            currentMonthNumOfDealsCommissions,
            numOfPendingDeals,
          } = this.returnDealData(data.dealsByAgentID);

          return (
            <AgentDashboard
              userUUID={this.props.userUUID}
              deals={data.deals}
              netCommissionsToDate={netCommissionsToDate}
              currentMonthNetCommissions={currentMonthNetCommissions}
              currentMonthNumOfDealsCommissions={
                currentMonthNumOfDealsCommissions
              }
              numOfPendingDeals={numOfPendingDeals}
            />
          );
        }}
      </Query>
    );
  }
}

export default DashboardContainer;
