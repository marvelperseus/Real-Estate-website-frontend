import React, { Fragment, Component } from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Chance from 'chance';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import AllAgentsView from '../frontEndComponents/AllAgentsView';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Footer from '../components/Footer';

const chance = new Chance();

const agentsQuery = gql`
  query agents {
    agents {
      uuid
      email
      lastName
      firstName
      agent {
        mobileNumber
        profilePicURL
      }
    }
  }
`;

@observer
class Listing extends React.Component {
  static getInitialProps({ req }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  render() {
    return (
      <Fragment>
        <Head>
          <link href="/static/css/style.css" rel="stylesheet" />
        </Head>
        <Query query={agentsQuery} ssr={false} fetchPolicy="cache-and-network">
          {({ loading, error, data }) => {
            if (loading) return 'loading';
            if (error) return 'error';
            return (
              <Layout UserStore={this.store.UserStore}>
                <AgentsComponent agents={data.agents} />
              </Layout>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

class AgentsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '' };
  }

  handleChange = value => e => {
    this.setState({ [value]: e.target.value });
  };

  filterAgents = () => {
    var regex = RegExp(this.state.filter, 'i');
    return this.props.agents.filter(agent =>
      regex.test(agent.firstName + ' ' + agent.lastName)
    );
  };

  render() {
    const agents = this.filterAgents();
    const { filter } = this.state;
    return (
      <Fragment>
        <section class="our-agent">
          <div class="container">
            <div class="banner-text">
              <h3>Find your local real estate adviser</h3>
              <p>
                Reyes & Elsamad agents will advise and deliver you real estates
                highest standards of professionalism. Locate your next partner
                below.
              </p>
              <form onSubmit={e => e.preventDefault()}>
                <input
                  value={filter}
                  onChange={this.handleChange('filter')}
                  type="text"
                  placeholder="Enter the name of an agent"
                />
                <button>
                  <i class="fa fa-search" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </section>
        <section class="agent-team">
          <div class="container">
            <ul>
              {agents.map(agent => (
                <li>
                  <figure>
                    {agent.agent.profilePicURL ? (
                      <a href={'/agent?id=' + agent.uuid}>
                        <img src={agent.agent.profilePicURL} />
                      </a>
                    ) : (
                      <a href={'/agent?id=' + agent.uuid}
                        style={{ display: 'flex', width: 272, height: 272, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', color: 'white' }}
                      >
                        <span>No Profile Picture</span>
                      </a>
                    )}
                  </figure>
                  <figcaption>
                    <h3>
                      {agent.firstName} {agent.lastName}
                    </h3>
                    <a href="javaScript:void(0)">
                      <i class="fa fa-envelope" aria-hidden="true" />
                      {agent.email}
                    </a>
                    <a href="javaScript:void(0)">
                      <i class="fa fa-phone" aria-hidden="true" />{' '}
                      {agent.agent.mobileNumber}
                    </a>
                  </figcaption>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

export default withData(Listing);
