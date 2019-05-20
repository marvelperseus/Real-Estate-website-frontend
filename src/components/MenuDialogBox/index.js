import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from '@material-ui/icons/RemoveRedEye';
import { Link } from '../../routes';
import { capitalize } from '../../utils/stringUtils';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  listItemContentWrapper: {
    display: 'flex',
  },
  listItemTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  anchor: {
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center',
  },
};

@observer
class MenuDialoBox extends Component {
  renderLinks = renderItems => {
    renderItems = renderItems || [];
    const { classes } = this.props;
    const { toggleSideNavModal, toggleSideNavModalClosed } = this.props;

    return renderItems.map(item => {
      const Icon = item.icon;
      if (item.type === 'link') {
        return (
          <Link route={item.route} key={item.route || item.name}>
            <a className={classes.anchor}>
              <ListItem
                button
                onClick={() => toggleSideNavModalClosed()}
                key={item.route || item.name}
              >
                <div className={classes.listItemContentWrapper}>
                  {Icon ? (
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        <Icon />
                      </Avatar>
                    </ListItemAvatar>
                  ) : null}
                  <ListItemText
                    classes={{ root: classes.listItemTextWrapper }}
                    primary={item.name}
                  />
                </div>
              </ListItem>
            </a>
          </Link>
        );
      }
      if (item.onClick && typeof item.onClick === 'function') {
        return (
          <ListItem
            button
            onClick={() => {
              item.onClick();
              toggleSideNavModalClosed();
            }}
            key={item.route || item.name}
          >
            <div className={classes.listItemContentWrapper}>
              {Icon ? (
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <Icon />
                  </Avatar>
                </ListItemAvatar>
              ) : null}
              <ListItemText
                classes={{ root: classes.listItemTextWrapper }}
                primary={item.name}
              />
            </div>
          </ListItem>
        );
      }
    });
  };

  render() {
    const {
      classes,
      onClose,
      selectedValue,
      toggleSideNavModal,
      open,
      title,
      linkItems,
      toggleSideNavModalClosed,
    } = this.props;

    return (
      <Dialog
        onClose={toggleSideNavModalClosed}
        aria-labelledby="side-nav-dialog-box"
        open={open}
      >
        <DialogTitle
          classes={{ root: classes.title }}
          id="side-nav-dialog-box-title"
        >
          {title}
        </DialogTitle>
        <div>
          <List>{this.renderLinks(linkItems)}</List>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(MenuDialoBox);
