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
import EditProfilePicForm from '../../containers/EditProfilePicForm';
import { AppContext } from '../../AppGlobalStateProvider';

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
class EditProfilePicDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formApi: null,
      submittingForm: false,
      snackbarOpen: false,
      snackbarText: '',
      isErrorSnackbar: false,
    };
  }

  setFormSubmitted = (bool = true) => {
    this.setState({
      formSubmitted: bool,
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

  openRequestErrorSnackbar = (text = networkErrorMessage) => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
      isErrorSnackbar: true,
    });
  };

  render() {
    const {
      fullScreen,
      classes,
      closeProfilePicEditor,
      open,
      submitProfilePicEditForm,
      finishedSubmittingForm,
      submittingEditProfilePicForm,
      toggleSubmittingEditProfilePicForm,
      editProfilePicFormSubmitted,
      setFormSubmitted,
      setFinishedSubmittingForm,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={closeProfilePicEditor}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          Edit Profile Picture
        </DialogTitle>
        <Divider />
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="formDialog"
        >
          <AppContext.Consumer>
            {context => (
              <EditProfilePicForm
                userUUID={this.props.userUUID}
                setIsSubmittingForm={this.setIsSubmittingForm}
                finishedSubmittingForm={finishedSubmittingForm}
                getFormApi={formApi => this.setState({ formApi })}
                createAgent={context.UserStore.createAgent}
                setAgentProfilePic={context.UserStore.setAgentProfilePic}
                submitProfilePicEditForm={submitProfilePicEditForm}
                setFormSubmitted={setFormSubmitted}
                setFinishedSubmittingForm={setFinishedSubmittingForm}
                editProfilePicFormSubmitted={editProfilePicFormSubmitted}
                openRequestErrorSnackbar={this.openRequestErrorSnackbar}
                createProfilePicDataURL={this.props.createProfilePicDataURL}
                toggleSubmittingEditProfilePicForm={
                  toggleSubmittingEditProfilePicForm
                }
                uuid={this.props.uuid}
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
        {!submittingEditProfilePicForm ? (
          <DialogActions classes={{ root: classes.dialogActions }}>
            <Button onClick={closeProfilePicEditor} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.state.formApi.submitForm()}
              color="primary"
            >
              Submit{' '}
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(EditProfilePicDialogBox));
