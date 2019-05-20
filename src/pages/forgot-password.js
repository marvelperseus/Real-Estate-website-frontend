import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import ForgotPasswordComp from '../frontEndComponents/ForgotPassword';
import resetPassword from '../effects/users/resetPassword';

@observer
class ForgotPassword extends React.Component {
  static getInitialProps({ req, query }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
      forgotPasswordToken: query.forgotPasswordToken,
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  render() {
    const { forgotPasswordToken } = this.props;

    return (
      <Layout UserStore={this.store.UserStore}>
        <ForgotPasswordComp
          forgotPasswordToken={forgotPasswordToken}
          resetPassword={resetPassword}
        />
      </Layout>
    );
  }
}

export default withData(ForgotPassword);
