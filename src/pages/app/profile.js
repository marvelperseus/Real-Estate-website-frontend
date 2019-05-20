import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import Layout from '../../components/Layout';
import { initStore } from '../../models';
import withData from '../../lib/withData';
import { Router } from '../../routes';
import ProfileContainer from '../../containers/Profile';
const Loader = DotLoader;

const agentQuery = gql`
  query agent($uuid: String!) {
    agent(uuid: $uuid) {
      firstName
      lastName
      role
      email
      agent {
        profilePicURL
        mobileNumber
        officeNumber
        branch
        profileDescription
        title
        facebook
        twitter
        instagram
        speciality
        education
        status
      }
    }
  }
`;

@observer
class Profile extends React.Component {
  static getInitialProps({ req, query }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
      profileID: query.id,
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    if (isBrowser && !this.store.UserStore.isLoggedIn) {
      Router.pushRoute('home');
    }

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;

    this.state = {
      agentDeleted: false,
      userUUID: this.store.UserStore.uuid,
    };
  }

  setAgentDeleted = () => {
    this.setState({ agentDeleted: true });
  };

  render() {
    const { profileID } = this.props;
    return (
      <Layout UserStore={this.store.UserStore} UIStore={this.store.UIStore}>
        <Query
          query={agentQuery}
          variables={{ uuid: profileID || this.state.userUUID }}
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
                    height: '546px',
                    boxShadow:
                      '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Loader color="#f44336" loading />
                </div>
              );
            // TODO: change the error message to a generic
            // 'error connecting to server' message
            if (error) {
              console.log(error);
              return (
                <div style={{ textAlign: 'center' }}>
                  We're sorry. There was an error processing your request.
                </div>
              );
            }

            if (this.state.agentDeleted)
              return (
                <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  AGENT DELETED
                </div>
              );

            if (!data || !data.agent)
              return (
                <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  AGENT NOT NOTFOUND
                </div>
              );

            return (
              <ProfileContainer
                agent={data.agent}
                uuid={profileID || this.store.UserStore.uuid}
                currentUserRole={this.store.UserStore.userRole}
                currentUserUUID={this.store.UserStore.uuid}
                setAgentDeleted={this.setAgentDeleted}
              />
            );
          }}
        </Query>
      </Layout>
    );
  }
}

export default withData(Profile);
