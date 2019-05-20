import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Layout from '../../components/Layout';
import { initStore } from '../../models';
import withData from '../../lib/withData';
import { Router } from '../../routes';
import AgentsTableContainer from '../../containers/AgentsTable';

@observer
class AgentsDashboard extends React.Component {
  static getInitialProps({ req }) {
    const isServer = !!req;
    return { cookieJWTData: req && req.cookies ? req.cookies.jwtData : null, isServer };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    if (isBrowser && !this.store.UserStore.isLoggedIn) {
      Router.pushRoute('home');
    }

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  render() {
    return (
      <Layout UserStore={this.store.UserStore} UIStore={this.store.UIStore}>
        <div>
          <AgentsTableContainer />
        </div>
      </Layout>
    );
  }
}

export default withData(AgentsDashboard);
