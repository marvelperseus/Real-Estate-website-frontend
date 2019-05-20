import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { darken } from 'polished';
import {
  HeaderLink as LogoAnchor,
  HeaderWrapper,
  LeftHeaderLinkWrapper,
  MiddleHeaderLinkWrapper,
  Logo,
} from '../../sharedStyledComponents/headerStyles';
import { Link } from '../../routes';
import HeaderNavLink from '../HeaderNavLink';
import {
  HeaderLink as NavAnchor,
  NavItem,
} from '../HeaderNavLink/styledComponents';

const styles = theme => ({
  signUpLink: {
    display: 'flex',
    height: '100%',
    padding: '5px',
    color: '#fff',
    backgroundColor: '#D0021B',
    borderRadius: '2px',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: darken(0.05, '#D0021B'),
    },
  },
  anchor: {
    textDecoration: 'none',
  },
  loginWrapper: {
    display: 'flex',
    marginRight: '5px',
    fontSize: '14px',
  },
  logo: {
    height: 30,
  },
});

@observer
@withStyles(styles)
class HeaderNav extends React.Component {
  renderLinks = () => {
    const { classes, isAdmin, openLoginModal } = this.props;
    if (this.props.isLoggedIn) {
      return (
        <LeftHeaderLinkWrapper>
          <NavAnchor onClick={this.props.onLogout}>Log Out</NavAnchor>
        </LeftHeaderLinkWrapper>
      );
    }

    return (
      <LeftHeaderLinkWrapper>
        <span className={classes.loginWrapper}>
          <NavItem onClick={openLoginModal}>Log In</NavItem>
        </span>
        {/*<Link route="sign-up" href="/sign-up" prefetch>
          <a className={classes.anchor}>
            <span className={classes.signUpLink}>Sign Up</span>
          </a>
          </Link>*/}
      </LeftHeaderLinkWrapper>
    );
  };

  renderMiddleLinks = () => (
    <MiddleHeaderLinkWrapper>
      <HeaderNavLink route="listings" href="/listings" prefetch>
        <NavAnchor>Listings</NavAnchor>
      </HeaderNavLink>
      <HeaderNavLink route="new-developments" href="/new-developments" prefetch>
        <NavAnchor>New Developments</NavAnchor>
      </HeaderNavLink>
      <HeaderNavLink route="about" href="/about" prefetch>
        <NavAnchor>About</NavAnchor>
      </HeaderNavLink>
    </MiddleHeaderLinkWrapper>
  );

  render() {
    const { headerBoxShadowOff, classes } = this.props;
    return (
      <HeaderWrapper id="header-wrapper" headerBoxShadowOff>
        {
          <Logo>
            <Link route="home" prefetch>
              <LogoAnchor>
                <img
                  className={classes.logo}
                  src="/static/images/logo.png"
                  alt="logo"
                />
              </LogoAnchor>
            </Link>
          </Logo>
        }
        {this.renderMiddleLinks()}
        {this.renderLinks()}
      </HeaderWrapper>
    );
  }
}

export default HeaderNav;
