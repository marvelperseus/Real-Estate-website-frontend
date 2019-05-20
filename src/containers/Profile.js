import React, { Component } from 'react';
import { observer } from 'mobx-react';
import faker from 'faker';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from 'material-ui/Button';
import Profile from '../components/Profile';
import ProfilePicDialogBox from '../components/EditProfilePicDialogBox';
import EditAgentDialogBox from '../components/EditAgentDialogBox';
import EditAgentPasswordDialogBox from '../components/EditAgentPasswordDialogBox';
import BlockAgentDialogBox from '../components/BlockAgentDialogBox';

const styles = theme => ({
  submitInvoiceBtn: {},
  wrapper: {
    position: 'relative',
  },
  buttonsWrapper: {
    display: 'flex',
    marginBottom: '25px',
    justifyContent: 'center',
  },
  snackBar: {
    marginTop: 30,
  },
});

@observer
@withStyles(styles)
class ProfileContainer extends Component {
  constructor(props) {
    super(props);

    const { agent } = this.props;

    this.state = {
      user: agent,
      isEditing: false,
      profilePicEditorDialogBoxOpen: false,
      submittingEditProfilePicForm: false,
      editProfilePicFormSubmitted: false,
      editAgentModalOpen: false,
      editAgentDialogBoxOpen: false,
      blockAgentDialogBoxOpen: false,
      editAgentPasswordDialogBoxOpen: false,
      snackbarOpen: false,
      snackbarText: '',
      isLoadingProfilePicture: true,
    };
  }

  openProfilePicEditor = () => {
    this.setState({
      profilePicEditorDialogBoxOpen: true,
    });
  };

  closeProfilePicEditor = () => {
    this.setState({
      profilePicEditorDialogBoxOpen: false,
      editProfilePicFormSubmitted: false,
    });
  };

  confirmProfilePicSubmitted = () => {
    this.setState({
      profilePicEditorDialogBoxOpen: false,
    });
  };

  toggleIsLoadingProfilePicture = (bool = false) => {
    console.log(`loaded: ${bool}`);
    this.setState({
      isLoadingProfilePicture: bool,
    });
  };

  setFinishedSubmittingForm = url => {
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        agent: {
          ...user.agent,
          profilePicURL: `${url}?cacheBust=${faker.random.uuid()}`,
        },
      },
      profilePicEditorDialogBoxOpen: false,
      isLoadingProfilePicture: true,
      submittingEditProfilePicForm: false,
      editProfilePicFormSubmitted: false,
      snackbarOpen: true,
      snackbarText: 'Profile picture successfully changed!',
    });
  };

  editPasswordFormSubmittedSuccessfully = () => {
    this.setState({
      editAgentPasswordDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Password successfully changed!',
    });
  };

  editAgentFormSubmittedSuccessfully = agent => {
    this.setState({
      user: agent,
      editAgentDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Agent Information successfully updated!',
    });
  };
  
  blockAgentFormSubmittedSuccessfully = agent => {
    this.setState({
      user: agent,
      editAgentPasswordDialogBoxOpen: false,
      snackbarOpen: true,
      snackbarText: 'Agent blocked successfully!',
    });
  };

  toggleSubmittingEditProfilePicForm = bool => {
    this.setState({
      submittingEditProfilePicForm:
        typeof bool === 'boolean'
          ? bool
          : !this.state.submittingEditProfilePicForm,
    });
  };

  setFormSubmitted = () => {
    this.setState({
      editProfilePicFormSubmitted: true,
    });
  };

  toggleEditAgentModal = state => {
    const { editAgentModalOpen } = this.state;
    this.setState({
      editAgentModalOpen:
        typeof state === 'boolean' ? state : !editAgentModalOpen,
    });
  };

  openEditAgentDialogBox = () => {
    this.setState({
      editAgentDialogBoxOpen: true,
    });
  };

  openBlockAgentDialogBox = () => {
    this.setState({
      blockAgentDialogBoxOpen: true,
    });
  };

  closeEditAgentDialogBox = () => {
    this.setState({
      editAgentDialogBoxOpen: false,
    });
  };
  
  closeBlockAgentDialogBox = () => {
    this.setState({
      blockAgentDialogBoxOpen: false,
    });
  };

  openEditAgentPasswordDialogBox = () => {
    this.setState({
      editAgentPasswordDialogBoxOpen: true,
    });
  };

  closeEditAgentPasswordDialogBox = () => {
    this.setState({
      editAgentPasswordDialogBoxOpen: false,
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  agentSuccessfullyDeleted = () => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Agent has been successfully deleted!',
    });
    this.props.setAgentDeleted();
  };
  
  agentSuccessfullyBlocked = () => {
    this.setState({
      snackbarOpen: true,
      snackbarText: 'Agent has been successfully blocked!',
    });
    this.props.setAgentDeleted();
  };

  createProfilePicDataURL = blob => URL.createObjectURL(blob);

  render() {
    const {
      isEditing,
      profileEdited,
      profilePicEditorDialogBoxOpen,
      submittingEditProfilePicForm,
      editProfilePicFormSubmitted,
      isLoadingProfilePicture,
    } = this.state;
    const {
      toggleEditingMode,
      toggleProfileEdited,
      setMobileNumber,
      setDescription,
      enterEditingMode,
      cancelEditingMode,
      saveUser,
      openProfilePicEditor,
      closeProfilePicEditor,
      undoSave,
      toggleEditAgentModal,
    } = this;

    const { classes } = this.props;
    return (
      <div>
        <Profile
          agent={this.state.user}
          isEditing={isEditing}
          enterEditingMode={enterEditingMode}
          cancelEditingMode={cancelEditingMode}
          profileEdited={profileEdited}
          toggleProfileEdited={toggleProfileEdited}
          setMobileNumber={setMobileNumber}
          setDescription={setDescription}
          saveUser={saveUser}
          undoSave={undoSave}
          openProfilePicEditor={openProfilePicEditor}
          currentUserRole={this.props.currentUserRole}
          currentUserUUID={this.props.currentUserUUID}
          openBlockAgentDialogBox={this.openBlockAgentDialogBox}
          openEditAgentDialogBox={this.openEditAgentDialogBox}
          openEditAgentPasswordDialogBox={this.openEditAgentPasswordDialogBox}
          uuid={this.props.uuid}
          isLoadingProfilePicture={isLoadingProfilePicture}
          toggleIsLoadingProfilePicture={this.toggleIsLoadingProfilePicture}
        />

        <EditAgentDialogBox
          open={this.state.editAgentDialogBoxOpen}
          closeEditAgentDialogBox={this.closeEditAgentDialogBox}
          confirmAgentCreated={this.confirmAgentCreated}
          viewingAgentUUID={this.props.uuid}
          currentUserRole={this.props.currentUserRole}
          agentSuccessfullyDeleted={this.agentSuccessfullyDeleted}
          editAgentFormSubmittedSuccessfully={
            this.editAgentFormSubmittedSuccessfully
          }
        />

        <BlockAgentDialogBox
           agent={this.state.user}
           closeBlockAgentDialogBox={this.closeBlockAgentDialogBox}
           open={this.state.blockAgentDialogBoxOpen}
           viewingAgentUUID={this.props.uuid}
           blockAgentFormSubmittedSuccessfully={
             this.blockAgentFormSubmittedSuccessfully
           }
        />

        <EditAgentPasswordDialogBox
          closeEditAgentPasswordDialogBox={this.closeEditAgentPasswordDialogBox}
          open={this.state.editAgentPasswordDialogBoxOpen}
          viewingAgentUUID={this.props.uuid}
          editPasswordFormSubmittedSuccessfully={
            this.editPasswordFormSubmittedSuccessfully
          }
        />

        <ProfilePicDialogBox
          submitProfilePicEditForm={this.submitProfilePicEditForm}
          closeProfilePicEditor={closeProfilePicEditor}
          open={profilePicEditorDialogBoxOpen}
          confirmProfilePicSubmitted={this.confirmProfilePicSubmitted}
          setFinishedSubmittingForm={this.setFinishedSubmittingForm}
          submittingEditProfilePicForm={submittingEditProfilePicForm}
          editProfilePicFormSubmitted={editProfilePicFormSubmitted}
          setFormSubmitted={this.setFormSubmitted}
          createProfilePicDataURL={this.createProfilePicDataURL}
          toggleSubmittingEditProfilePicForm={
            this.toggleSubmittingEditProfilePicForm
          }
          uuid={this.props.uuid}
        />

        <Snackbar
          classes={{ root: classes.snackBar }}
          anchorOrigin={{
            vertical: 'top',
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
      </div>
    );
  }
}

export default ProfileContainer;
