import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Hidden from 'material-ui/Hidden';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NotificationIcon from '@material-ui/icons/Notifications';
import { withStyles } from 'material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from '@material-ui/icons/RemoveRedEye';
import classnames from 'classnames';
import SideNavLinkItem from '../SideNavLinkItem';
import navLinks from './navItems';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  drawerPaper: {
    position: 'relative',
    paddingBottom: '50px',
    overflow: 'auto',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    backgroundColor: 'rgba(36, 68, 109, .75)',
    color: '#fff',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 5,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 6.8,
    },
    '&:hover': {
      width: drawerWidth,
    },
  },
  tempDrawer: {
    minWidth: '240px',
    width: '240px',
  },
  toolbar: theme.mixins.toolbar,
  topToolbar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '5px',
  },
  list: {
    paddingTop: 0,
  },
  notificationIcon: {
    position: 'absolute',
    left: '5px',
    bottom: '5px',
  },
  arrowBackBtn: {
    marginLeft: 'auto',
    marginRight: '10px',
    height: '30px',
    width: '30px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.1)',
    },
  },
  listRoot: {
    height: '100%',
    overflow: 'hidden',
    //borderBottom: '1px solid rgba(255,255,255,.2)',
  },
  icon: {
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.1)',
    },
  },
  topDivider: {
    backgroundColor: 'rgba(255,255,255,.2)',
  },
});

@observer
class SideNav extends Component {
  sideNavListingsDialogItems = [
    {
      name: 'Create a Listing',
      route: 'create-listing',
      type: 'link',
      icon: AddIcon,
      onClick: this.props.toggleMenuDialogBoxClosed,
    },
    {
      name: 'View Listings',
      route: 'listings',
      type: 'link',
      icon: ViewIcon,
      onClick: this.props.toggleMenuDialogBoxClosed,
    },
  ];

  renderSideLinkComponents = currentPath =>
    navLinks.map(item => {
      return (
        <SideNavLinkItem
          key={item.route || item.name}
          name={item.name}
          route={item.route}
          icon={item.icon}
          iconLeft={item.iconLeft}
          iconLeftSmall={item.iconLeftSmall}
          iconFontSize={item.iconFontSize}
          currentPath={currentPath}
          isActionItem={!item.route}
          onClick={() => {
            if (this.props.drawerOpen) this.props.toggleDrawer(false);
            if (item.id === 'logout') this.props.logoutUser();
            if (item.id === 'listings') {
              this.props.toggleMenuDialogBoxOpen(
                'Listings',
                this.sideNavListingsDialogItems
              );
            }
          }}
        />
      );
    });

  render() {
    const { classes, currentPath, drawerOpen, toggleDrawer } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classnames(
              classes.drawerPaper,
              !drawerOpen && classes.drawerPaperClose
            ),
          }}
        >
          <div className={classes.toolbar} />
          <List classes={{ root: classes.listRoot }}>
            {this.renderSideLinkComponents(currentPath)}
          </List>
          {/*<div className={classes.notificationIcon}>
            <Tooltip
              id="tooltip-icon"
              title="Notifications"
              enterDelay={200}
              leaveDelay={200}
              PopperProps={{ style: { minWidth: '30px' } }}
              placement="top-end"
            >
              <IconButton
                color="primary"
                classes={{ root: classes.notificationIconBtn }}
              >
                <NotificationIcon />
              </IconButton>
            </Tooltip>
          </div>*/}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(SideNav);
