import { Fragment, Component } from 'react';
import globalStyles from '../globalStyles';
import { withRouter } from 'next/router';
import themeStyles from '../themeStyles';
import { ThemeProvider } from 'styled-components';
import LoginFormModal from '../frontEndComponents/LoginFormModal';
import userForgotPassword from '../effects/users/userForgotPassword';
import Head from 'next/head';

const ActiveLink = withRouter(({ children, router, href }) => {
  if (router.pathname === '/region') {
    return (
      <li class={'/listings' === href ? 'active' : ''}>
        <a href={href}>{children}</a>
      </li>
    );
  }
  return (
    <li class={router.pathname === href ? 'active' : ''}>
      <a href={href}>{children}</a>
    </li>
  );
});

export default class Header extends Component {
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
    const {
      isLoggedIn,
      logoutUser,
      userRole,
      loginUser,
    } = this.props.UserStore;

    return (
      <Fragment>
        <header id="navbar" class={this.props.className || 'list-header'}>
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <button
                    type="button"
                    class="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1"
                    aria-expanded="false"
                  >
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                  </button>
                  <a class="navbar-brand" href="/">
                    <img src="/static/img/logo.png" />
                  </a>
                </div>

                <div
                  class="collapse navbar-collapse"
                  id="bs-example-navbar-collapse-1"
                >
                  <ul class="nav navbar-nav">
                    <ActiveLink href="/listings">Listings</ActiveLink>
                    <ActiveLink href="/new-developments">
                      New Developments
                    </ActiveLink>
                    <ActiveLink href="/agents">Our Agents</ActiveLink>
                    <li class="login">
                      <a href="#" onClick={this.openLoginModal}>
                        Log in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        </header>

        <LoginFormModal
          loginUser={loginUser}
          loginModalOpen={this.state.loginModalOpen}
          closeLoginModal={this.closeLoginModal}
          getFormApi={formApi => (this._formApi = formApi)}
          userForgotPassword={userForgotPassword}
        />
      </Fragment>
    );
  }
}
