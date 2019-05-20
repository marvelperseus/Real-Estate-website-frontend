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
import classnames from 'classnames';
import EditAgentPasswordForm from '../../containers/EditAgentPasswordForm';
import blockAgent from '../../effects/users/blockAgent';

const networkErrorMessage =
  "We're sorry. There was an error processing your request.";

const styles = theme => ({
  paper: {
    width: '600px',
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
    position: 'relative',
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
class BlockAgentDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formApi: null,
      submittingForm: false,
      formSubmitted: false,
      snackbarOpen: false,
      snackbarText: 'Agent suspended successfully!',
      submittingRequestToServer: false,
      isErrorSnackbar: false,
      agent: props.agent,
      closeDialog: true
    };
  }

  setFormSubmitted = (bool = true) => {
    this.setState({
      formSubmitted: bool,
      submittingForm: !bool,
    });
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

  blockAgent = (status) => {
    console.log("blocker called   ", status);
    // this.props.setFormSubmitted();
    // this.props.toggleSubmittingRequestToServer(true);

    const returnValues = {
      uuid: this.props.viewingAgentUUID,
      status,
    };
    this.setState({
      closeDialog: false,
      snackbarOpen: true,
      snackbarText: `Agent ${status} successfully`,
      isErrorSnackbar: true,
    });
    blockAgent(returnValues)
      .then(res => {
        // this.props.setFormSubmitted(false);
        // this.props.toggleSubmittingRequestToServer(false);
        // if (res.error) {
        //   this.props.openRequestErrorSnackbar(res.error);
        //   return;
        // }
console.log("check the final response ", res);
        // this.props.formSubmittedSuccessfully();
      })
      .catch(err => {
        this.props.toggleSubmittingRequestToServer(false);
        this.props.setFormSubmitted(false);
        this.props.openRequestErrorSnackbar();
      });
  }
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
      closeBlockAgentDialogBox,
      closeEditAgentPasswordDialogBox,
      blockAgentFormSubmittedSuccessfully,
      open,
      agent,
      submitProfilePicEditForm,
      finishedSubmittingForm,
      submittingEditAgentPasswordForm,
      editProfilePicFormSubmitted,
      setFormSubmitted,
      setFinishedSubmittingForm,
    } = this.props;
console.log("block this agent >>>>>>>>>>>>", agent);
    return (
      <Dialog
        open={open && this.state.closeDialog}
        onClose={closeBlockAgentDialogBox}
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
        Do you want to {agent.agent.status == "Active"? "block " : "unblock "}  {agent.firstName + ' ' + agent.lastName } ?
          {/* <EditAgentPasswordForm
            viewingAgentUUID={this.props.viewingAgentUUID}
            getFormApi={formApi => this.setState({ formApi })}
            setFormSubmitted={this.setFormSubmitted}
            openRequestErrorSnackbar={this.openRequestErrorSnackbar}
            submittingRequestToServer={this.state.submittingRequestToServer}
            toggleSubmittingRequestToServer={
              this.toggleSubmittingRequestToServer
            }
            formSubmittedSuccessfully={
              this.props.blockAgentFormSubmittedSuccessfully
            }
          /> */}

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
        {!submittingEditAgentPasswordForm ? (
          <DialogActions classes={{ root: classes.dialogActions }}>
            <Button onClick={closeBlockAgentDialogBox} color="primary">
              Cancel
            </Button>
            {!editProfilePicFormSubmitted ? (
              <Button
                onClick={() => {
                  console.log("check the agenets status ", agent.agent);
                  const status = agent.agent.status == "Active" ? "Suspended": "Active";
                  console.log("check the status status ", status);
                  const response = this.blockAgent(status);
                  console.log("check response ", response);
                  // this.state.formApi.submitForm();
                }}
                color="primary"
              >
               {agent.agent.status == "Active"? "Block " : "Unblock "} 
              </Button>
            ) : null}
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(BlockAgentDialogBox)
);
