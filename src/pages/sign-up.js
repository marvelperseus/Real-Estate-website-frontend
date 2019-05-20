import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { fadesUp } from '../components/TransitionHOC';
import { initStore } from '../models';
import Layout from '../frontEndComponents/FrontEndLayout';
import { Router } from '../routes';
import SignUpLoginForm from '../containers/SignUpLoginForm';
import withData from '../lib/withData';

// use higher-order-component for mount animation
const Form = fadesUp(SignUpLoginForm);

@observer
class SignUp extends React.Component {
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

    if (this.store.UserStore.isLoggedIn && isBrowser) {
      Router.pushRoute('home');
    }

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  render() {
    return (
      <Layout UserStore={this.store.UserStore}>
        <TransitionGroup>
          <Form
            signUpCustomer={this.store.UserStore.signUpCustomer}
            formType="sign-up"
          />
        </TransitionGroup>
      </Layout>
    );
  }
}

export default withData(SignUp);
