import React from 'react';
import { observer } from 'mobx-react';
import debounce from 'debounce';
import { withRouter } from 'next/router';
import { Router } from '../routes';
import HeaderNav from '../frontEndComponents/HeaderNav';

@observer
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorsFromServer: '',
      appTopBurgerMenuOpen: false,
    };
    this.onLogout = debounce(this.onLogout, 500, true);
  }

  onClickBurgerMenu = () => {
    this.setState({
      ...this.state,
      appTopBurgerMenuOpen: !this.state.appTopBurgerMenuOpen,
    });
  };

  onLogout = async () => {
    const res = await this.props.logoutUser();

    if (res.error) {
      this.setState({
        ...this.state,
        errorsFromServer: res.error,
      });
      return;
    }
    if (this.state.errorsFromServer) {
      this.setState({
        ...this.state,
        errorsFromServer: '',
      });
    }

    Router.pushRoute('home');
  };

  render() {
    return (
      <HeaderNav
        isAdmin={this.props.isAdmin}
        isLoggedIn={this.props.isLoggedIn}
        onLogout={this.onLogout}
        openLoginModal={this.props.openLoginModal}
      />
    );
  }
}

// use HOC to access router object inside of component
// useful for accessing props.router.pathname
export default withRouter(Header);
