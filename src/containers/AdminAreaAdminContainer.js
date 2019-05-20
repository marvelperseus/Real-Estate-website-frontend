import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { observer } from 'mobx-react';
import moment from 'moment';
import isBrowser from 'is-browser';
import Grid from 'material-ui/Grid';
import { DatePicker } from 'material-ui-pickers';
import TextField from 'material-ui/TextField';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CreateAdminDialogBox from '../components/CreateAdminDialogBox';
import MaterialCustomSelectInput from '../components/MaterialCustomSelectInput';
import AdminAreaAdminTableContainer from './AdminAreaAdminTableContainer';
import EditAdminDialogBox from '../components/EditAdminDialogBox';
import deleteAdmin from '../effects/users/deleteAdmin';
import EditAdminPasswordDialogBox from '../components/EditAdminPasswordDialogBox';

const Loader = DotLoader;

const styles = theme => ({
  addAdminBtn: {
    marginLeft: '25px',
    backgroundColor: '#2995F3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2380D1',
    },
  },
  buttonsWrapper: {
    display: 'flex',
    marginBottom: '25px',
    justifyContent: 'center',
  },
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
  snackBar: {
    marginTop: 30,
  },
});

const adminQuery = gql`
  query allAdmin {
    allAdmin {
      uuid
      firstName
      lastName
      email
      lastLoginTimestamp
      createdAt
      role
      admin {
        mobileNumber
        officeNumber
        state
        branch
        isAdminOwner
      }
    }
  }
`;

@observer
class AdminAreaAdminContainer extends Component {
  state = {
    createAdminModalOpen: false,
    snackbarOpen: false,
    snackbarText: '',
    snackbarUndoFunction: null,
    addedAdmin: [],
    deletedAdminIDS: [],
    editAdminAnchorEl: null,
    editAdminPasswordDialogBoxOpen: false,
  };

  toggleCreateAdminModal = state => {
    const { createAdminModalOpen } = this.state;
    this.setState({
      createAdminModalOpen:
        typeof state === 'boolean' ? state : !createAdminModalOpen,
    });
  };

  confirmAdminCreated = newAdmin => {
    const { addedAdmin } = this.state;
    this.setState({
      createAdminModalOpen: false,
      snackbarOpen: true,
      snackbarText: 'Admin created successfully',
      addedAdmin: [...addedAdmin, newAdmin],
      viewingAdminUUID: null,
      deletedAdminIDS: [],
    });
  };

  confirmAdminEdited = admin => {
    const { addedAdmin } = this.state;
    console.log(admin);
    this.setState({
      createAdminModalOpen: false,
      snackbarOpen: true,
      snackbarText: 'Admin updated successfully',
      addedAdmin: [...addedAdmin, admin],
      viewingAdminUUID: null,
      editAdminModalOpen: false,
      viewingAdminRole: null,
      viewingAdminIsOwnerAdmin: null,
    });
  };

  adminSuccessfullyDeleted = adminID => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Admin deleted successfully!',
      editAdminModalOpen: false,
      deletedAdminIDS: [...this.state.deletedAdminIDS, adminID],
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  openAdminInfoViewDialogBox = () => {
    const { viewingAdminUUID, viewingAdminRole } = this.state;
    this.setState({
      editAdminModalOpen: true,
      viewingAdminUUID,
      viewingAdminRole,
    });
  };

  closeAdminInfoViewDialogBox = (bool = true) => {
    this.setState({ editAdminModalOpen: false });
  };

  handleEditAdminMenuClick = (
    event,
    viewingAdminUUID,
    viewingAdminRole,
    viewingAdminIsOwnerAdmin
  ) => {
    this.setState({
      editAdminAnchorEl: event.currentTarget,
      viewingAdminUUID,
      viewingAdminRole,
      viewingAdminIsOwnerAdmin,
    });
  };

  handleEditAdminMenuClose = () => {
    this.setState({ editAdminAnchorEl: null });
  };

  editPasswordFormSubmittedSuccessfully = () => {
    this.setState({
      editAdminPasswordDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Password successfully changed!',
    });
  };

  openEditAdminPasswordDialogBox = () => {
    this.setState({
      editAdminPasswordDialogBoxOpen: true,
    });
  };

  closeEditAdminPasswordDialogBox = () => {
    this.setState({
      editAdminPasswordDialogBoxOpen: false,
    });
  };

  render() {
    const { classes, userUUID, userRole, currentUserIsAdminOwner } = this.props;
    const {
      createAdminModalOpen,
      editAdminModalOpen,
      editAdminAnchorEl,
      viewingAdminIsOwnerAdmin,
    } = this.state;

    return (
      <Query query={adminQuery} ssr={false} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          console.log(data);
          if (loading)
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'calc(100vh - 110px)',
                  boxShadow:
                    '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Loader color="#f44336" loading />
              </div>
            );

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const intAdmin = {};

          const allAdmin = [...data.allAdmin, ...this.state.addedAdmin];

          allAdmin.forEach(admin => {
            intAdmin[admin.uuid] = admin;
          });

          let uniqueAdmin = [];

          Object.keys(intAdmin).forEach(key => {
            uniqueAdmin.push(intAdmin[key]);
          });

          uniqueAdmin = uniqueAdmin.filter(
            admin => !this.state.deletedAdminIDS.includes(admin.uuid)
          );

          return (
            <div className={classes.wrapper}>
              <div>
                <div className={classes.buttonsWrapper}>
                  <Button
                    variant="raised"
                    onClick={this.toggleCreateAdminModal}
                    classes={{ root: classes.addAdminBtn }}
                  >
                    <AddIcon />
                    Create Admin
                  </Button>
                </div>
              </div>

              <AdminAreaAdminTableContainer
                allAdmin={uniqueAdmin}
                handleEditAdminMenuClick={this.handleEditAdminMenuClick}
                closeAdminInfoViewDialogBox={this.closeAdminInfoViewDialogBox}
                userRole={this.props.userRole}
                userUUID={this.props.userUUID}
                currentUserIsAdminOwner={currentUserIsAdminOwner}
              />

              <EditAdminDialogBox
                open={editAdminModalOpen}
                toggleCreateAdminModal={this.toggleCreateAdminModal}
                confirmAdminCreated={this.confirmAdminCreated}
                viewingAdminID={this.state.viewingAdminID}
                userRole={this.props.userRole}
                closeAdminInfoViewDialogBox={this.closeAdminInfoViewDialogBox}
                viewingAdminUUID={this.state.viewingAdminUUID}
                confirmAdminEdited={this.confirmAdminEdited}
                deleteAdmin={this.deleteAdmin}
                currentUserUUID={this.props.userUUID}
                currentUserIsAdminOwner={currentUserIsAdminOwner}
                adminSuccessfullyDeleted={this.adminSuccessfullyDeleted}
              />

              <CreateAdminDialogBox
                open={createAdminModalOpen}
                toggleCreateAdminModal={this.toggleCreateAdminModal}
                confirmAdminCreated={this.confirmAdminCreated}
              />

              <EditAdminPasswordDialogBox
                closeEditAdminPasswordDialogBox={
                  this.closeEditAdminPasswordDialogBox
                }
                open={this.state.editAdminPasswordDialogBoxOpen}
                viewingAdminUUID={this.state.viewingAdminUUID}
                editPasswordFormSubmittedSuccessfully={
                  this.editPasswordFormSubmittedSuccessfully
                }
              />

              <Menu
                id="simple-menu"
                disableEnforceFocus
                anchorEl={() => {
                  if (isBrowser) {
                    return document.getElementById('viewTableIcon');
                  }
                }}
                open={Boolean(editAdminAnchorEl)}
                onClose={this.handleEditAdminMenuClose}
              >
                <div className={classes.popupMenuTitle}>Edit</div>
                <MenuItem
                  classes={{ root: classes.menuItemAccept }}
                  onClick={() => {
                    this.handleEditAdminMenuClose();
                    this.openAdminInfoViewDialogBox();
                  }}
                >
                  Information
                </MenuItem>
                {
                  <MenuItem
                    classes={{ root: classes.menuItemAccept }}
                    onClick={() => {
                      this.handleEditAdminMenuClose();
                      this.openEditAdminPasswordDialogBox();
                    }}
                  >
                    Password
                  </MenuItem>
                }
                <MenuItem
                  classes={{ root: classes.menuItem }}
                  onClick={() => {
                    this.handleEditAdminMenuClose();
                  }}
                >
                  Cancel
                </MenuItem>
              </Menu>

              <Snackbar
                classes={{ root: classes.snackBar }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={this.state.snackbarOpen}
                autoHideDuration={5000}
                onClose={this.handleCloseSnackbar}
                contentProps={{
                  'aria-describedby': 'snackbar-id',
                }}
                message={
                  <span id="snackbar-id">{this.state.snackbarText}</span>
                }
                action={[
                  this.snackbarUndoFunction ? (
                    <Button
                      key="undo"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        this.handleCloseSnackbar();
                        if (
                          this.state.snackbarUndoFunction &&
                          typeof snackbarUndoFunction === 'function'
                        ) {
                          this.snackbarUndoFunction();
                        }
                      }}
                    >
                      UNDO
                    </Button>
                  ) : (
                    undefined
                  ),
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={this.handleCloseSnackbar}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(AdminAreaAdminContainer);
