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
class AdminCRUDManagementDialog extends Component {
  managementItems = {
    agents: [
      {
        name: 'Create',
        icon: AddIcon,
        onClick: this.props.toggleCreateAgentModal,
      },
      { name: 'View All', route: 'view', type: 'link', icon: ViewIcon },
    ],
    customers: [
      { name: 'View All', route: 'view', type: 'link', icon: ViewIcon },
    ],
    admin: [
      {
        name: 'Create',
        route: 'create',
        icon: AddIcon,
        onClick: this.props.toggleCreateAgentModal,
      },
      { name: 'View All', route: 'view', type: 'link', icon: ViewIcon },
    ],
    deals: [{ name: 'View All', route: 'view', type: 'link', icon: ViewIcon }],
    invoices: [
      { name: 'View All', route: 'view', type: 'link', icon: ViewIcon },
    ],
  };

  renderManagementLinks = items => {
    const { classes } = this.props;
    const {
      toggleManagementModal,
      managementModalCurrentRoute,
      managementModalCurrentType,
    } = this.props;
    const renderItems = items[managementModalCurrentType] || [];

    return renderItems.map(item => {
      const Icon = item.icon;
      if (item.type === 'link') {
        return (
          <Link
            route={`/app/admin-area/${managementModalCurrentRoute}/${
              item.route
            }`}
            key={item.route || item.name}
          >
            <a className={classes.anchor}>
              <ListItem
                button
                onClick={() => toggleManagementModal()}
                key={item.route || item.name}
              >
                <div className={classes.listItemContentWrapper}>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <Icon />
                    </Avatar>
                  </ListItemAvatar>
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
              toggleManagementModal();
            }}
            key={item.route || item.name}
          >
            <div className={classes.listItemContentWrapper}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <Icon />
                </Avatar>
              </ListItemAvatar>
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
      toggleManagementModal,
      managementModalType,
      open,
    } = this.props;

    this.managementModalType = managementModalType
      ? capitalize(managementModalType)
      : this.managementModalType;

    return (
      <Dialog
        onClose={toggleManagementModal}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle
          classes={{ root: classes.title }}
          id="simple-dialog-title"
        >{`Manage ${
          this.managementModalType ? this.managementModalType : ''
        }`}</DialogTitle>
        <div>
          <List>{this.renderManagementLinks(this.managementItems)}</List>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AdminCRUDManagementDialog);
