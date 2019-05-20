import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { Link } from '../../routes';
import {
  SideNavLinkItemWrapper,
  SideNavLinkItemAnchor,
  IconWrapper,
  SideNavLinkItemDiv,
} from './styledComponents';

const styles = theme => ({
  icon: {
    color: 'inherit !important',
  },
});

@observer
class SideNavLinkItem extends Component {
  render() {
    const {
      onClick,
      iconFontSize,
      icon: Icon,
      isActionItem,
      isAdminLinks,
      classes,
      iconLeft,
      iconLeftSmall,
      ...rest
    } = this.props;
    let active;

    if (this.props.currentPath.split('/')[2] === this.props.route) {
      active = true;
    } else {
      active = false;
    }

    const linkItem = (
      <SideNavLinkItemWrapper
        active={active}
        onClick={onClick}
        isAdminLinks={isAdminLinks}
        {...rest}
      >
        <Link route={this.props.route} prefetch>
          <SideNavLinkItemAnchor isAdminLinks={isAdminLinks}>
            <IconWrapper
              isAdminLinks={isAdminLinks}
              iconLeft={iconLeft}
              iconLeftSmall={iconLeftSmall}
            >
              {Icon ? (
                <Icon
                  size={iconFontSize || 22}
                  classes={{ root: classes.icon }}
                  color="primary"
                />
              ) : null}
            </IconWrapper>
            {this.props.name}
          </SideNavLinkItemAnchor>
        </Link>
      </SideNavLinkItemWrapper>
    );

    const actionItem = (
      <SideNavLinkItemWrapper
        active={active}
        onClick={onClick}
        isAdminLinks={isAdminLinks}
        {...rest}
      >
        <SideNavLinkItemDiv isAdminLinks={isAdminLinks}>
          <IconWrapper isAdminLinks={isAdminLinks}>
            {Icon ? (
              <Icon
                size={iconFontSize || 22}
                color="primary"
                classes={{ root: classes.icon }}
              />
            ) : null}
          </IconWrapper>
          {this.props.name}
        </SideNavLinkItemDiv>
      </SideNavLinkItemWrapper>
    );

    if (isActionItem) {
      return actionItem;
    }
    return linkItem;
  }
}

export default withStyles(styles)(SideNavLinkItem);
