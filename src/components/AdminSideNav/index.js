import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import classNames from 'classnames';
import NotificationIcon from '@material-ui/icons/Notifications';
import { withStyles } from 'material-ui/styles';
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
    backgroundColor: theme.palette.secondary.dark,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
    left: '7px',
    bottom: '5px',
    '@media screen and (max-width: 600px)': {
      left: '4px',
    },
  },
  arrowBackBtn: {
    marginLeft: 'auto',
    marginRight: '10px',
    height: '30px',
    width: '30px',
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
  notificationIconBtn: {
    height: '40px',
    width: '40px',
    color: '#fff',
    '@media screen and (max-width: 600px)': {
      height: '30px',
      width: '30px',
    },
  },
  listRoot: {
    height: '100%',
    overflow: 'hidden',
    // borderBottom: '1px solid rgba(255,255,255,.5)',
  },
});

@observer
class AdminSideNav extends Component {
  renderSideLinkComponents = currentPath => {
    return navLinks.map(item => {
      const type = item.type || 'link';
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
          isAdminLinks
          onClick={() => {
            if (this.props.drawerOpen) this.props.toggleDrawer(false);
            if (item.id === 'logout') this.props.logoutUser();
          }}
        />
      );
    });
  };

  render() {
    const { classes, currentPath, drawerOpen, toggleDrawer } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
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

export default withStyles(styles)(AdminSideNav);
