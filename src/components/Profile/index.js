import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Grid from 'material-ui/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormattedText from 'buildo-react-components/lib/FormattedText';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import { BounceLoader } from 'react-spinners';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPencil,
} from 'react-icons/lib/fa';
import {
  agent as agentRole,
  admin,
  superAdmin,
} from '../../constants/userTypes';
import { capitalize } from '../../utils/stringUtils';
import AgentDealsSection from '../../containers/DealsWithGQLQuery';

const Loader = BounceLoader;

const styles = theme => ({
  'app-body-class' :{
    'overflow-x': 'hidden'
},
  profileInfoWrapper: {
    position: 'relative',
    display: 'flex',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '20px 20px',
    borderRadius: '10px',
    color: 'rgba(0,0,0,.8)',
    boxShadow: theme.shadows[1],
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  leftColumnWrapper: {
    marginRight: '40px',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
  },
  rightColumnWrapper: {
    width: '100%',
    [theme.breakpoints.only('sm')]: {
      width: '65%',
    },
  },
  name: {
    marginBottom: '5px',
    '@media (max-height: 500px)': {
      fontSize: '1.4rem',
    },
  },
  title: {
    color: 'rgba(0,0,0,.7)',
    display: 'block',
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.9rem',
    },
  },
  profilePicWrapper: {
    position: 'relative',
    paddingTop: '100%',
    marginBottom: '25px',
    width: '325px',
    height: '325px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
    },
  },
  profilePicLoader: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#f1eded',
    zIndex: 1,
  },
  profilePic: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    background: 'linear-gradient(45deg, #45484d 0%,#000000 100%)',
  },
  profilePicSubstitute: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: 20,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #45484d 0%,#000000 100%)',
    color: '#fff',
    width: '325px',
    height: '325px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
    },
  },
  profilePicSubstituteText: {
    positon: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  detailsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1.1rem',
    '@media (max-width: 800px)': {
      fontSize: '0.9rem',
    },
  },
  details: {
    display: 'flex',
    width: '100%',
    textAlign: 'center',
    marginBottom: '5px',
    '@media (max-width: 800px)': {
      fontSize: '0.9rem',
    },
  },
  detailsTitle: {
    display: 'inline-block',
    fontWeight: '500',
    marginBottom: '8px',
    marginRight: 10,
  },
  detailsInfo: {
    marginLeft: 'auto',
    fontWeight: '300',
  },
  descriptionWrapper: {
    '& > span': {
      lineHeight: '1.4rem',
    },
    '@media (max-width: 800px)': {
      fontSize: '0.8rem',
    },
  },
  descriptionTitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: '10px',
    '@media (max-width: 500px)': {
      fontSize: '0.9rem',
    },
  },
  socialMediaWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 40,
    },
  },
  socialMediaTitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    alignText: 'center',
  },
  socialMediaItemsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px',
    width: '100%',
  },
  socialMediaItemWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    width: '55px',
    height: '55px',
    border: '1px solid rgba(0,0,0,.3)',
    borderColor: 'rgba(0,0,0,.3)',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '22px',
    color: 'rgba(0,0,0,.7)',
    transition: 'border-color .2s ease-in-out, color .2s ease-in-out',
    '&:hover': {
      borderColor: 'rgba(0,0,0,.9)',
      color: 'rgba(0,0,0,.8)',
    },
    '@media (max-width: 800px)': {
      width: '45px',
      height: '45px',
    },
  },
  editBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '34px',
    width: '34px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#008205',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
  },
  editProfilePicBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '34px',
    width: '34px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#646d64',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
  },
  editBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    right: '-13px',
  },
  editProfilePicBtnsWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '-13px',
    right: '-13px',
    [theme.breakpoints.down('xs')]: {
      right: 'auto',
      left: '-13px',
    },
  },
  cancelBtn: {
    backgroundColor: theme.palette.secondary.main,
    marginRight: '8px',
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
  },
  descriptionDetailsInput: {
    padding: '10px',
    width: '100%',
    fontSize: '1rem',
    color: 'rgba(0,0,0,.8)',
    borderRadius: '3px',
    lineHeight: '1.4rem',
    borderColor: 'rgba(0,0,0,.1)',
    boxShadow: `inset ${theme.shadows[1]}`,
  },
  detailsInfoInput: {
    padding: '0',
    marginLeft: 'auto',
    padding: '5px',
    fontWeight: '300',
    color: 'rgba(0,0,0,.8)',
    fontSize: '.8rem',
    borderRadius: '3px',
    borderColor: 'rgba(0,0,0,.1)',
    boxShadow: `inset ${theme.shadows[1]}`,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  snackBar: {
    transform: 'translate(0px, -25px)',
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
  lightHeading: {
    color: '#fff',
  },
  statNumberBoxWrapper: {
    backgroundColor: '#fff',
    height: '175px',
  },
  statBoxQuestionIcon: {
    fontSize: '40px',
    color: '#F57C00',
  },
  statBoxMoneyIcon: {
    fontSize: '40px',
    color: '#388E3C',
  },
  statBoxStarIcon: {
    fontSize: '40px',
    color: '#1976D2',
  },
});

@withStyles(styles)
@observer
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      Transition: null,
      editAgentAnchorEl: null,
      imageError: false,
    };
  }

  errorTimeout;

  componentDidMount = () => {
    if (this._img && this._img.complete) {
      this.props.toggleIsLoadingProfilePicture(false);
    }
  };

  componentDidUpdate = prevProps => {
    if (
      prevProps.agent.agent.profilePicURL
      !== this.props.agent.agent.profilePicURL
    ) {
      this.setState({
        imageError: false,
      });
    }
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  returnTitle = (role, title) => {
    console.log(`role: ${role}`);
    switch (role) {
      case agentRole:
        return title && title.trim()
          ? capitalize(title)
          : 'Licensed Real Estate Salesperson';
        break;
      case admin:
        return 'Admin';
        break;
      case superAdmin:
        return 'Super-Admin';
        break;
      default:
        return '';
    }
  };

  handleEditAgentMenuClick = event => {
    this.setState({ editAgentAnchorEl: event.currentTarget });
  };

  handleEditAgentMenuClose = () => {
    this.setState({ editAgentAnchorEl: null });
  };

  renderProfilePic = () => {
    const {
      isLoadingProfilePicture,
      classes,
      agent,
      currentUserUUID,
      currentUserRole,
      toggleIsLoadingProfilePicture,
      openProfilePicEditor,
    } = this.props;
    const canEdit = currentUserRole === admin || currentUserRole === superAdmin;

    return (
      <div className={classes.profilePicWrapper}>
        {isLoadingProfilePicture
          && agent.agent.profilePicURL
          && !this.state.imageError && (
          <div className={classes.profilePicLoader}>
            <div className={classes.profilePicSubstituteText}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Loader color="#f44336" loading />
              </div>
            </div>
          </div>
        )}
        {agent.agent.profilePicURL ? (
          !this.state.imageError ? (
            <img
              id="agentProfilePic"
              className={classes.profilePic}
              ref={img => (this._img = img)}
              src={agent.agent.profilePicURL}
              alt="Agent"
              onLoad={() => {
                this.setState({ imageError: false });
                toggleIsLoadingProfilePicture(false);
              }}
              onError={() => this.setState({ imageError: true })}
            />
          ) : (
            <div className={classes.profilePicSubstitute}>
              <div className={classes.profilePicSubstituteText}>
                Error loading profile picture...
              </div>
            </div>
          )
        ) : (
          <div className={classes.profilePicSubstitute}>
            <div className={classes.profilePicSubstituteText}>
              No profile photo available
            </div>
          </div>
        )}

        {canEdit && (
          <span className={classes.editProfilePicBtnsWrapper}>
            <button
              className={classes.editProfilePicBtn}
              onClick={openProfilePicEditor}
            >
              <FaPencil />
            </button>
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      agent,
      classes,
      isEditing,
      undoSave,
      uuid,
      currentUserRole,
      currentUserUUID,
      openEditAgentDialogBox,
      openEditAgentPasswordDialogBox,
      openBlockAgentDialogBox
    } = this.props;
    console.log("check the agent details ?>>>>>>>>>>>> ", agent)
    const {
      firstName,
      lastName,
      email,
      role,
      agent: {
        profileDescription,
        mobileNumber,
        officeNumber,
        branch,
        title,
        facebook,
        twitter,
        instagram,
        speciality,
        education,
      },
    } = agent;

    const { editAgentAnchorEl } = this.state;

    const name = capitalize(`${firstName} ${lastName}`);

    const canEdit = currentUserUUID === uuid
      || currentUserRole === admin
      || currentUserRole === superAdmin;
    const isAdmin = currentUserRole === admin || currentUserRole === superAdmin;

    return (
      <div>
        <div className={classes.profileInfoWrapper }>
          {canEdit && (
            <span className={classes.editBtnsWrapper}>
              <button
                className={classes.editBtn}
                onClick={this.handleEditAgentMenuClick}
              >
                <FaPencil />
              </button>
            </span>
          )}
          <Menu
            id="simple-menu"
            anchorEl={editAgentAnchorEl}
            open={Boolean(editAgentAnchorEl)}
            onClose={this.handleEditAgentMenuClose}
          >
            <div className={classes.popupMenuTitle}>Edit</div>
            <MenuItem
              classes={{ root: classes.menuItemAccept }}
              onClick={() => {
                this.handleEditAgentMenuClose();
                openEditAgentDialogBox();
              }}
            >
              Information
            </MenuItem>
            <MenuItem
              classes={{ root: classes.menuItemAccept }}
              onClick={() => {
                this.handleEditAgentMenuClose();
                openBlockAgentDialogBox();
              }}
            >
              {agent.agent.status == "Active"? "Block" : "Unblock"}
            </MenuItem>
            <MenuItem
              classes={{ root: classes.menuItemAccept }}
              onClick={() => {
                this.handleEditAgentMenuClose();
                openEditAgentPasswordDialogBox();
              }}
            >
              Password
            </MenuItem>
            <MenuItem
              classes={{ root: classes.menuItem }}
              onClick={() => {
                this.handleEditAgentMenuClose();
              }}
            >
              Cancel
            </MenuItem>
          </Menu>
          <div className={classes.leftColumnWrapper}>
            {this.renderProfilePic()}

            <div className={classes.detailsWrapper}>
              <div className={classNames(classes.email, classes.details)}>
                <div className={classes.detailsTitle}>Email</div>
                <div className={classes.detailsInfo}>{email}</div>
              </div>
              {officeNumber && (
                <div className={classNames(classes.mobile, classes.details)}>
                  <div className={classes.detailsTitle}>Office</div>
                  <div className={classes.detailsInfo}>{officeNumber}</div>
                </div>
              )}
              <div className={classNames(classes.mobile, classes.details)}>
                <div className={classes.detailsTitle}>Mobile</div>
                <div className={classes.detailsInfo}>{mobileNumber}</div>
              </div>
              <div className={classNames(classes.region, classes.details)}>
                <div className={classes.detailsTitle}>Branch</div>
                <div className={classes.detailsInfo}>{branch}</div>
              </div>

              {facebook || instagram || twitter ? (
                <div className={classes.socialMediaWrapper}>
                  <div className={classes.socialMediaTitle}>Social Media:</div>
                  <div className={classes.socialMediaItemsWrapper}>
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        className={classes.socialMediaItemWrapper}
                      >
                        <FaFacebook />
                      </a>
                    )}
                    {twitter && (
                      <a
                        href={twitter}
                        target="_blank"
                        className={classes.socialMediaItemWrapper}
                      >
                        <FaTwitter />
                      </a>
                    )}
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        className={classes.socialMediaItemWrapper}
                      >
                        <FaInstagram />
                      </a>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className={classes.rightColumnWrapper}>
            <div>
              <h1 className={classes.name}>{name}</h1>
              <div className={classes.title}>
                {this.returnTitle(role, title)}
              </div>
              <div className={classes.descriptionWrapper}>
                <div className={classes.descriptionTitle}>
                  About
                  {' '}
                  {name.split(' ')[0]}
                </div>
                <FormattedText className={classes.descriptionDetails}>
                  {profileDescription || 'No description available yet...'}
                </FormattedText>
              </div>
            </div>
          </div>

          <Snackbar
            classes={{ root: classes.snackBar }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={isEditing ? false : this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Profile saved</span>}
            action={[
              <Button
                key="undo"
                color="secondary"
                size="small"
                onClick={() => {
                  this.handleClose();
                  undoSave();
                }}
              >
                UNDO
              </Button>,
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </div>

        {isAdmin && (
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <div
                className={classes.expansionPanelWrapper}
                style={{ marginBottom: '20px' }}
              >
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      Agent Deals &#38; Statistics
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        <AgentDealsSection
                          userRole={currentUserRole}
                          isAdmin={isAdmin}
                          userUUID={uuid}
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default Profile;
