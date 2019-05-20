import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Switch from 'material-ui/Switch';
import SettingsIcon from '@material-ui/icons/Settings';
import { Router } from '../../routes';

const drawerWidth = 340;

const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
    backgroundColor: '#fafafa',
    overflowY: 'initial',
  },
  tempDrawer: {
    boxSizing: 'border-box',
    maxWidth: '80%',
    minWidth: drawerWidth - 100,
    width: drawerWidth,
    right: 0,
    left: 'auto',
    fontFamily: theme.typography.fontFamily,
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
  },
  closeIcon: {
    position: 'absolute',
    right: '5px',
    top: '15px',
    border: 'none',
    backgroundColor: '#fafafa',
    transition: 'color .2s ease-in-out',
    '&:hover': {
      cursor: 'pointer',
      color: '#000',
    },
  },
  iconRoot: {
    fontSize: '18px',
  },
  listItem: {
    display: 'flex',
  },
  listItemLabel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listItemLabelItem: {
    marginLeft: 'auto',
  },
  listWrapper: {
    paddingTop: '20px',
    paddingBottom: '20px',
    fontSize: '15px',
  },
  header: {
    marginBottom: '0.7em',
    fontWeight: '500',
  },
  settingsBtn: {
    position: 'absolute',
    bottom: '10px',
    left: '-40px',
    height: '40px',
    width: '40px',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px 0 0 5px',
    boxShadow: theme.shadows[6],
    outline: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  scrollableWrapper: {
    padding: '15px',
    overflow: 'auto',
    height: '100%',
  },
});

@observer
class SettingsDrawer extends Component {
  render() {
    const {
      classes,
      drawerOpen,
      toggleDrawer,
      isAdmin,
      navDrawerOpen,
      toggleNavDrawer,
    } = this.props;
    return (
      <div className={classes.root}>
        <Drawer
          className={classes.tempDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          open={drawerOpen}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
            hideBackdrop: true,
          }}
          onClose={toggleDrawer}
        >
          <div className={classes.scrollableWrapper}>
            <button
              className={classes.closeIcon}
              onClick={this.props.toggleDrawer}
            >
              <CloseIcon classes={{ root: classes.iconRoot }} />
            </button>
            <Typography variant="subheading" classes={{ root: classes.header }}>
              Settings
            </Typography>
            <Typography variant="caption" classes={{ root: classes.header }}>
              Change your back-end settings here
            </Typography>
            <Divider />
            <div className={classes.listWrapper} />
          </div>
          <button
            className={classes.settingsBtn}
            onClick={this.props.toggleDrawer}
          >
            <SettingsIcon />
          </button>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(SettingsDrawer);
