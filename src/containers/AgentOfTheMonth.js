import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Chance from 'chance';
import faker from 'faker';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import AgentOfTheMonth from '../components/AgentOfTheMonth';
// import AgentOfTheMonthCarousel from '../components/AgentOfTheMonthCarousel';

const chance = new Chance();

const Loader = DotLoader;

const agentOfTheQuarterQuery = gql`
  query agentsOfTheQuarter {
    agentsOfTheQuarter {
      commercialDollarsAgent {
        name
        photoURL
        uuid
        statItem
      }
      residentialDollarsAgent {
        name
        photoURL
        uuid
        statItem
      }
      rentalsDollarsAgent {
        name
        photoURL
        uuid
        statItem
      }
      numbersAgent {
        name
        photoURL
        uuid
        statItem
      }
    }
  }
`;

@observer
class AgentOfTheMonthContainer extends Component {
  constructor(props) {
    super(props);

    this._commercialDollarsAgent = {
      name: chance.name(),
      photoURL: faker.image.avatar(),
      profileURL: '#',
      statItem: chance.integer({ min: 1000000, max: 8000000 }),
    };
    this._residentialDollarsAgent = {
      name: chance.name(),
      photoURL: faker.image.avatar(),
      profileURL: '#',
      statItem: chance.integer({ min: 1000000, max: 8000000 }),
    };
    this._rentalsDollarsAgent = {
      name: chance.name(),
      photoURL: faker.image.avatar(),
      profileURL: '#',
      statItem: chance.integer({ min: 1000000, max: 8000000 }),
    };
    this._numbersAgent = {
      name: chance.name(),
      photoURL: faker.image.avatar(),
      profileURL: '#',
      statItem: chance.integer({ min: 40, max: 120 }),
    };
  }

  render() {
    const { userUUID } = this.props;
    const {
      _residentialDollarsAgent,
      _commercialDollarsAgent,
      _rentalsDollarsAgent,
      _numbersAgent,
    } = this;
    return (
      <Query
        query={agentOfTheQuarterQuery}
        variables={{ uuid: userUUID || this.state.userUUID }}
        ssr={false}
      >
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

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          var {
            residentialDollarsAgent,
            commercialDollarsAgent,
            rentalsDollarsAgent,
            numbersAgent,
          } = data.agentsOfTheQuarter;
          // for dummy data
          this.residentialDollarsAgent= this._residentialDollarsAgent;
          return (
            <AgentOfTheMonth
              residentialDollarsAgent={
                residentialDollarsAgent.uuid ? residentialDollarsAgent : null 
              }
              commercialDollarsAgent={
                commercialDollarsAgent.uuid ?   commercialDollarsAgent : null 
              }
              rentalsDollarsAgent={
                rentalsDollarsAgent.uuid ?  rentalsDollarsAgent : null 
              }
              numbersAgent={numbersAgent.uuid ?   numbersAgent : null }
            />
          );
        }}
      </Query>
    );
  }
}

export default AgentOfTheMonthContainer;
