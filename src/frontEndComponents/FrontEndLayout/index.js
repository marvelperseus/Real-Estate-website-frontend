import React, { Component } from 'react';
import { observer } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router, { withRouter } from 'next/router';
import isBrowser from 'is-browser';
import { ThemeProvider } from 'styled-components';
import 'antd/dist/antd.css';
import withRoot from '../../lib/withRoot';
import HeaderNav from '../../frontEndContainers/Header';
import AppContentWrapper from '../../sharedStyledComponents/AppContentWrapper';
import themeStyles from '../../themeStyles';
import globalStyles from '../../globalStyles';
import { Container, HeaderAndAppContentWrapper } from './styledComponents';
import { admin, superAdmin } from '../../constants/userTypes';
import LoginFormModal from '../LoginFormModal';
import userForgotPassword from '../../effects/users/userForgotPassword';
import Header from '../../components/Header';

NProgress.configure({ showSpinner: false });
NProgress.configure({ trickleSpeed: 100 });

if (isBrowser) {
  Router.onRouteChangeStart = () => {
    NProgress.start();
  };

  Router.onRouteChangeComplete = () => NProgress.done();
  Router.onRouteChangeError = () => NProgress.done();
}

@observer
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
    };
  }

  openLoginModal = () => {
    console.log('run');
    this.setState({
      loginModalOpen: true,
    });
  };

  closeLoginModal = () => {
    this.setState({
      loginModalOpen: false,
    });
  };

  render() {
    const { pathname } = this.props.router;
    const {
      isLoggedIn,
      logoutUser,
      userRole,
      loginUser,
    } = this.props.UserStore;
    const isAdmin = userRole === admin || userRole === superAdmin;

    return (
      <div>
        <Head>
          <title>
            {this.props.title ? this.props.title : 'Real Estate App'}
          </title>
          {/* Import CSS for nprogress */}
          <link rel="icon" type="image/png" href="/static/favicon.png"/>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/vendor/nprogress.css"
          />
          <link
            href="static/css/listings/css/font-awesome-4.7.0/css/font-awesome.css"
            rel="stylesheet"
          />
          <link
            href="static/css/listings/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <link
            href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            href="static/css/listings/css/style.css?v=1.7"
            rel="stylesheet"
          />
          <link
            href="static/css/listings/css/responsive.css?v=1.7"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Alegreya|Alegreya+Sans"
            type="text/css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Playfair+Display|Raleway"
            type="text/css"
            rel="stylesheet"
          />
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" />

          <script src="static/css/listings/js/bootstrap.min.js" />
          <script src="static/css/listings/js/mobile-nav.js" />
          <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        </Head>
        {/* <DevTools position={{ top: 0, left: 30 }} /> */}
        <ThemeProvider theme={themeStyles}>
          <Container>
            <HeaderAndAppContentWrapper>
              <Header UserStore={this.props.UserStore} />
              <AppContentWrapper>{this.props.children}</AppContentWrapper>
              <LoginFormModal
                loginUser={loginUser}
                loginModalOpen={this.state.loginModalOpen}
                closeLoginModal={this.closeLoginModal}
                getFormApi={formApi => (this._formApi = formApi)}
                userForgotPassword={userForgotPassword}
              />
            </HeaderAndAppContentWrapper>
          </Container>
        </ThemeProvider>
      </div>
    );
  }
}

export default withRouter(withRoot(Layout));
