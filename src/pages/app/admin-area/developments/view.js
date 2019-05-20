import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import 'react-dates/initialize';
import Layout from '../../../../components/Layout';
import { initStore } from '../../../../models';
import withData from '../../../../lib/withData';
import { Router } from '../../../../routes';
import AdminAreaListingsContainer from '../../../../containers/AdminAreaDevelopmentsContainer';

@observer
class Listings extends React.Component {
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

    if (isBrowser && !this.store.UserStore.isLoggedIn) {
      Router.pushRoute('home');
    }

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;

    this.state = {
      userUUID: this.store.UserStore.uuid,
    };
  }

  render() {
    const userUUID = this.store.UserStore.uuid || this.state.userUUID;

    return (
      <Layout UserStore={this.store.UserStore} UIStore={this.store.UIStore}>
        <AdminAreaListingsContainer
          userUUID={userUUID}
          userRole={this.store.UserStore.userRole}
        />
      </Layout>
    );
  }
}

export default withData(Listings);
