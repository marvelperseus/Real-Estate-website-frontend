import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { Icon } from 'antd';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import classnames from 'classnames';
import EditAgentForm from '../../containers/EditAgentForm';
import updateAgent from '../../effects/users/updateAgent';
import deleteAgent from '../../effects/users/deleteAgent';
import { agent, admin, superAdmin } from '../../constants/userTypes';

const networkErrorMessage =
  "We're sorry. There was an error processing your request.";

const styles = theme => ({
  paper: {
    width: '800px',
    maxWidth: '800px',
  },
  dialogActions: {
    margin: '8px 0',
  },
  formTitle: {
    padding: 'theme.spacing.unit theme.spacing.unit * 3',
    textAlign: 'center',
  },
  formSubheader: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  dialogContent: {
    paddingTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveDraftBtn: {
    marginRight: 'auto',
    color: theme.custom.submitBlue.main,
    '&:hover': {
      backgroundColor: theme.custom.submitBlue.transparentLightBackground,
    },
  },
  popupMenuTitle: {
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
  menuItemDelete: {
    display: 'flex !important',
    justifyContent: 'center !important',
    transition:
      'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.light} !important`,
      color: '#fff !important',
    },
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
  editAgentBtn: {
    color: theme.custom.submitBlue.main,
    '&:hover': {
      backgroundColor: theme.custom.submitBlue.transparentLightBackground,
    },
  },
  snackBar: {
    position: 'absolute',
    bottom: 20,
  },
  errorSnackbar: {
    '& > div': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
});

@observer
class EditAgentDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formApi: null,
      formSubmitted: false,
      isEditingAgent: false,
      cancelAnchorEl: null,
      acceptAnchorEl: null,
      snackbarOpen: false,
      snackbarText: '',
      isEditingAgent: false,
      cancelAnchorEl: null,
      acceptAnchorEl: null,
      isErrorSnackbar: false,
      snackbarText: '',
    };
  }

  setFormSubmitted = (bool = true) => {
    this.setState({ formSubmitted: bool, isEditingAgent: false });
  };

  toggleSnackbarOpen = text => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
      isErrorSnackbar: false,
      snackbarText: '',
    });
  };

  toggleEditingAgent = bool => {
    this.setState({
      isEditingAgent:
        typeof bool === 'boolean' ? bool : !this.state.isEditingAgent,
    });
  };

  handleCancelMenuClick = event => {
    this.setState({ cancelAnchorEl: event.currentTarget });
  };

  handleCancelMenuClose = () => {
    this.setState({ cancelAnchorEl: null });
  };

  handleAcceptMenuClick = event => {
    this.setState({ acceptAnchorEl: event.currentTarget });
  };

  handleAcceptMenuClose = () => {
    this.setState({ acceptAnchorEl: null });
  };

  deleteAgent = uuid => {
    this.toggleSubmittingRequestToServer(true);
    deleteAgent(uuid)
      .then(res => {
        this.toggleSubmittingRequestToServer(false);

        if (res.error) {
          this.openRequestErrorSnackbar(res.error);
        } else {
          this.props.agentSuccessfullyDeleted();
        }
      })
      .catch(err => {
        this.openRequestErrorSnackbar(networkErrorMessage);
        this.toggleSubmittingRequestToServer(false);
        console.log(err);
      });
  };

  openRequestErrorSnackbar = (text = networkErrorMessage) => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
      isErrorSnackbar: true,
    });
  };

  toggleSubmittingRequestToServer = (
    bool = !this.state.submittingRequestToServer
  ) => {
    this.setState({
      submittingRequestToServer: bool,
      formSubmitted: bool,
    });
  };

  render() {
    const {
      fullScreen,
      classes,
      closeEditAgentDialogBox,
      open,
      viewingAgentUUID,
      currentUserUUID,
      currentUserRole,
    } = this.props;
    const { isEditingAgent, cancelAnchorEl, acceptAnchorEl } = this.state;

    return (
      <Dialog
        open={open}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          Edit Agent
        </DialogTitle>
        <Divider />
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="formDialog"
        >
          <EditAgentForm
            viewingAgentUUID={this.props.viewingAgentUUID}
            setFormSubmitted={this.setFormSubmitted}
            getFormApi={formApi => this.setState({ formApi })}
            editAgent={updateAgent}
            confirmAgentCreated={this.props.confirmAgentCreated}
            isEditingAgent={isEditingAgent}
            currentUserRole={this.props.currentUserRole}
            openRequestErrorSnackbar={this.openRequestErrorSnackbar}
            submittingRequestToServer={this.state.submittingRequestToServer}
            toggleSubmittingRequestToServer={
              this.toggleSubmittingRequestToServer
            }
            editAgentFormSubmittedSuccessfully={
              this.props.editAgentFormSubmittedSuccessfully
            }
          />
          <Snackbar
            classes={{
              root: classnames(
                classes.snackBar,
                this.state.isErrorSnackbar && classes.errorSnackbar
              ),
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={4000}
            onClose={this.handleCloseSnackbar}
            message={<span id="snackbar-id">{this.state.snackbarText}</span>}
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
        </DialogContent>
        {!this.state.formSubmitted ? (
          <DialogActions classes={{ root: classes.dialogActions }}>
            <Button
              disabled={this.state.formSubmitted}
              onClick={() => {
                this.toggleEditingAgent(false);
                closeEditAgentDialogBox();
              }}
              color="primary"
            >
              Cancel
            </Button>
            {!isEditingAgent &&
            (this.props.currentUserRole === superAdmin ||
              this.props.currentUserRole === admin) ? (
              <Button
                disabled={this.state.formSubmitted}
                onClick={this.handleCancelMenuClick}
                color="secondary"
              >
                Delete
              </Button>
            ) : null}
            <Menu
              id="simple-menu"
              anchorEl={cancelAnchorEl}
              open={Boolean(cancelAnchorEl)}
              onClose={this.handleCancelMenuClose}
            >
              <div className={classes.popupMenuTitle}>Are you sure?</div>

              <MenuItem
                classes={{ root: classes.menuItemDelete }}
                onClick={() => {
                  this.handleCancelMenuClose();
                  this.deleteAgent(viewingAgentUUID);
                }}
              >
                Yes
              </MenuItem>
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={this.handleCancelMenuClose}
              >
                No
              </MenuItem>
            </Menu>
            {!isEditingAgent &&
            (this.props.currentUserRole === agent ||
              this.props.currentUserRole === admin ||
              this.props.currentUserRole === superAdmin) ? (
              <Button
                className={classes.editAgentBtn}
                disabled={this.state.formSubmitted}
                onClick={this.handleAcceptMenuClick}
                color="primary"
              >
                Edit
              </Button>
            ) : null}
            <Menu
              id="simple-menu"
              anchorEl={acceptAnchorEl}
              open={Boolean(acceptAnchorEl)}
              onClose={this.handleAcceptMenuClose}
            >
              <div className={classes.popupMenuTitle}>Are you sure?</div>
              <MenuItem
                classes={{ root: classes.menuItemAccept }}
                onClick={() => {
                  this.handleAcceptMenuClose();
                  this.toggleEditingAgent(true);
                }}
              >
                Yes
              </MenuItem>
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={this.handleAcceptMenuClose}
              >
                No
              </MenuItem>
            </Menu>
            {isEditingAgent ? (
              <Button
                disabled={this.state.formSubmitted}
                onClick={() => {
                  const errors = this.state.formApi.getError();
                  let errorCount;
                  console.log(this.state.formApi.getError());
                  if (errors) {
                    errorCount = Object.keys(this.state.formApi.getError())
                      .length;
                  }

                  if (errorCount) {
                    this.toggleSnackbarOpen(
                      `Please correct ${errorCount} form error${
                        errorCount > 1 ? 's' : ''
                      }`
                    );
                  }

                  this.state.formApi.submitForm();
                }}
                color="primary"
              >
                Submit
              </Button>
            ) : null}
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(EditAgentDialogBox));
