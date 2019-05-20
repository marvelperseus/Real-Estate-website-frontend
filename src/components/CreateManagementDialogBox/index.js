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
import CreateAgentForm from '../../containers/CreateAgentForm';
import { AppContext } from '../../AppGlobalStateProvider';
const networkErrorMessage =
  "We're sorry. There was an error processing your request. Please try again shortly or contact an administrator for assistance.";

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
class CreateManagementDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formApi: null,
      formSubmitted: false,
      snackbarOpen: false,
      snackbarText: '',
      isErrorSnackbar: false,
    };
  }

  setFormSubmitted = (bool = true) => {
    this.setState({ formSubmitted: bool });
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

  openRequestErrorSnackbar = (text = networkErrorMessage) => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
      isErrorSnackbar: true,
    });
  };

  render() {
    const { fullScreen, classes, toggleCreateAgentModal, open } = this.props;

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
          Add New Agent
        </DialogTitle>
        <Divider />
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="formDialog"
        >
          <AppContext.Consumer>
            {context => (
              <CreateAgentForm
                userUUID={this.props.userUUID}
                setFormSubmitted={this.setFormSubmitted}
                getFormApi={formApi => this.setState({ formApi })}
                createAgent={context.UserStore.createAgent}
                setAgentProfilePic={context.UserStore.setAgentProfilePic}
                confirmAgentCreated={this.props.confirmAgentCreated}
                currentUserRole={this.props.currentUserRole}
                isManagement={true}
                openRequestErrorSnackbar={this.openRequestErrorSnackbar}
              />
            )}
          </AppContext.Consumer>

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
            autoHideDuration={this.state.isErrorSnackbar ? 8000 : 4000}
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
            <Button onClick={toggleCreateAgentModal} color="primary">
              Cancel
            </Button>
            <Button
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
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(CreateManagementDialogBox)
);
