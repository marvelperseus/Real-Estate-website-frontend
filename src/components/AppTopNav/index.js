import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Router } from '../../routes';
import { capitalize, unhyphenate } from '../../utils/stringUtils';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignContent: 'center',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: drawerWidth,
    width: '100%',
    boxShadow: theme.shadows[3],
  },
  [theme.breakpoints.down(theme.breakpoints.values.md)]: {
    appBar: {
      width: '100%',
    },
  },
  toolbar: theme.mixins.toolbar,
  topToolbar: {
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.87)',
    flexDirection: 'row',
  },
  icon: {
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.1)',
    },
  },
  iconRoot: {
    width: '40px',
    height: '40px',
  },
  leftTopNavIconWrapper: {
    marginRight: '10px',
  },
  iconGroupWrapper: {
    marginLeft: 'auto',
  },
  menuHiddenWrapper: {
    display: 'inline',
  },
  [theme.breakpoints.up(theme.breakpoints.values.md)]: {
    menuHiddenWrapper: {
      display: 'none',
    },
  },
  uppercase: {
    marginRight: '5px',
    fontSize: '1.1rem',
    textTransform: 'uppercase',
  },
});

@observer
class AppTopNav extends Component {
  render() {
    const { classes, currentPath, isAdmin } = this.props;
    const pathArray = currentPath.split('/');
    const type = pathArray[pathArray.length - 1];
    const path =
      type === 'view' || type === 'new'
        ? type + ' ' + pathArray[pathArray.length - 2]
        : pathArray[pathArray.length - 1];

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.topToolbar}>
          <Typography variant="title" color="inherit" noWrap>
            <span className={classes.uppercase}>
              {capitalize(unhyphenate(path))}
            </span>
          </Typography>
          <div className={classes.leftTopNavIconWrapper}>
            <div>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                className={classes.menuIcon}
                onClick={this.props.toggleDrawer}
                classes={{ root: classes.iconRoot }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </div>
          {/*<div className={classes.iconGroupWrapper}>
            <Tooltip
              id="tooltip-icon"
              title="Home"
              enterDelay={200}
              leaveDelay={200}
              placement="bottom"
              PopperProps={{ style: { minWidth: '30px' } }}
            >
              <IconButton
                color="inherit"
                className={classes.icon}
                onClick={() => Router.pushRoute('home')}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </div>*/}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AppTopNav);
