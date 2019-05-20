import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';

const styles = theme => ({
  popupMenuTitle: {
    display: 'flex',
    justifyContent: 'center',
    outline: 'none',
    padding: '12px 16px',
    width: 'auto',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '24px',
    overflow: 'hidden',
    fontSize: '1rem',
    boxSizing: 'content-box',
    fontWeight: '400',
    lineHeight: '1.5em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap',
    paddingLeft: '16px',
    textOverflow: 'ellipsis',
    paddingRight: '16px',
    borderBottom: '1px solid rgba(0,0,0,.1)',
    pointerEvents: 'none',
  },
  menuItem: {
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  menuItemAccept: {
    display: 'flex !important',
    justifyContent: 'center !important',
    transition:
      'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
    '&:hover': {
      backgroundColor: `${theme.custom.submitBlue.light} !important`,
      color: '#fff !important',
    },
  },
});

class MenuThing extends React.Component {
  render() {
    const {
      classes,
      anchorEl,
      onClose,
      handleInfoClick,
      handlePasswordClick,
    } = this.props;
    return (
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <div className={classes.popupMenuTitle}>Edit</div>
        <MenuItem
          classes={{ root: classes.menuItemAccept }}
          onClick={handleInfoClick}
        >
          Information
        </MenuItem>
        <MenuItem
          classes={{ root: classes.menuItemAccept }}
          onClick={handlePasswordClick}
        >
          Password
        </MenuItem>
        <MenuItem classes={{ root: classes.menuItem }} onClick={onClose}>
          Cancel
        </MenuItem>
      </Menu>
    );
  }
}

export default withStyles(styles)(MenuThing);
