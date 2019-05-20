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
import themeStyles from '../../themeStyles';
import globalStyles from '../../globalStyles';
import InnerAppLayout from '../InnerAppLayout';
import FullScreenLoader from '../FullScreenLoader';
import { initStore } from '../../models';
import { admin, superAdmin } from '../../constants/userTypes';
import { AppProvider } from '../../AppGlobalStateProvider';
import style from '../../static/css/main.css';

const store = initStore();
const { UIStore } = store;

NProgress.configure({ showSpinner: false });
NProgress.configure({ trickleSpeed: 100 });

if (isBrowser) {
  Router.onRouteChangeStart = () => {
    NProgress.start();
  };

  Router.onRouteChangeComplete = () => {
    if (UIStore.fullScreenLoaderOn) {
      UIStore.toggleFullScreenLoader(false);
    }
    NProgress.done();
  };
  Router.onRouteChangeError = () => NProgress.done();
}

@observer
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.body.classList.add('app-body-class');
  }

  componentWillUnmount() {
    document.body.className = document.body.className.replace(
      /\bapp-body-class\b/g,
      ''
    );
  }

  render() {
    const { UIStore, UserStore } = this.props;

    const { logoutUser: logout, userRole } = UserStore;
    const isAdmin = userRole === admin || userRole === superAdmin;
    const {
      fullScreenLoaderOn,
      fullScreenLoaderText,
      toggleFullScreenLoader,
    } = UIStore;
    const logoutUser = async () => {
      const { error } = await logout();
      if (error) {
        // TODO: add user notification of an logout error
        console.log(error);
        return;
      }
      Router.pushRoute('home');
    };

    return (
      <div className='userProfiler' style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <Head>
          <title>
            {this.props.title
              ? this.props.title
              : 'Reyes & Elsamad Real Estate'}
          </title>

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/vendor/nprogress.css"
          />

          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />

          <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        </Head>
        {/* <DevTools position={{ top: 0, left: 30 }} /> */}
        <AppProvider UserStore={UserStore} UIStore={UIStore}>
          <ThemeProvider theme={themeStyles}>
            <InnerAppLayout
              logoutUser={logoutUser}
              userRole={userRole}
              toggleFullScreenLoader={toggleFullScreenLoader}
              isAdmin={isAdmin}
            >
              {this.props.children}
            </InnerAppLayout>
          </ThemeProvider>
          <FullScreenLoader
            open={fullScreenLoaderOn}
            text={fullScreenLoaderText}
          />
        </AppProvider>
      </div>
    );
  }
}

export default withRouter(withRoot(Layout));
