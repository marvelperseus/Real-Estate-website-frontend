import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import FormattedText from 'buildo-react-components/lib/FormattedText';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Input from 'buildo-react-components/lib/Input';
import TextareaAutosize from 'react-textarea-autosize';
import Tooltip from 'material-ui/Tooltip';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/lib/fa';
import ListingsSection from './ListingsSection';
import { capitalize } from '../../utils/stringUtils';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 20px 20px 20px',
    color: 'rgba(0,0,0,.8)',
  },
  mainSection: {
    position: 'relative',
    display: 'flex',
    maxWidth: 1400,
    padding: '40px 20px 20px 20px',
    color: 'rgba(0,0,0,.8)',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '40px 5px 20px 5px',
    },
  },
  leftColumnWrapper: {
    marginRight: '40px',
    width: '375px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: '30px',
    },
  },
  rightColumnWrapper: {
    width: '100%',
  },
  name: {
    marginTop: '0',
    marginBottom: '5px',
  },
  title: {
    color: 'rgba(0,0,0,.7)',
    display: 'block',
    marginBottom: '30px',
  },
  profilePicWrapper: {
    position: 'relative',
    marginBottom: '25px',
    minWidth: '220px',
    width: '100%',
    paddingTop: '100%',
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,.4)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  profilePic: {
    position: 'absolute',
    top: 5,
    left: 5,
    bottom: 5,
    right: 5,
    display: 'block',
    objectFit: 'cover',
    width: 'calc(100% - 10px)',
    height: 'calc(100% - 10px)',
  },
  detailsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1.1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  details: {
    display: 'flex',
    width: '100%',
    textAlign: 'center',
    marginBottom: '5px',
  },
  detailsTitle: {
    display: 'inline-block',
    fontWeight: '600',
    marginBottom: '8px',
  },
  detailsInfo: {
    marginLeft: 'auto',
    fontWeight: '300',
  },
  descriptionWrapper: {
    '& > span': {
      lineHeight: '1.4rem',
    },
  },
  descriptionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '10px',
  },
  socialMediaWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
    marginLeft: 'auto',
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
  },
  descriptionDetails: {
    fontSize: '1.1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.95rem',
    },
  },
  detailsInfoInput: {
    padding: '0',
    marginLeft: 'auto',
    '& input': {
      padding: '5px',
      fontWeight: '300',
      color: 'rgba(0,0,0,.8)',
      fontSize: '.8rem',
      borderRadius: '3px',
      borderColor: 'rgba(0,0,0,.1)',
      boxShadow: `inset ${theme.shadows[1]}`,
    },
  },
  facebook: {
    color: '#3B5998',
  },
  twitter: {
    color: '#1da1f2',
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
    };
  }

  render() {
    const {
      agent,
      classes,
      enterEditingMode,
      cancelEditingMode,
      isEditing,
      setDescription,
      setMobileNumber,
      saveUser,
      undoSave,
    } = this.props;
    const {
      profilePhotoURL,
      name,
      email,
      title,
      description,
      mobileNumber,
      officeNumber,
      region,
      instagramURL,
      twitterURL,
      facebookURL,
    } = agent;

    return (
      <div className={classes.root}>
        <div className={classes.mainSection}>
          <div className={classes.leftColumnWrapper}>
            <div className={classes.profilePicWrapper}>
              <img
                className={classes.profilePic}
                src={profilePhotoURL}
                alt="Agent"
              />
            </div>

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
                <div className={classes.detailsTitle}>Region</div>
                <div className={classes.detailsInfo}>{region}</div>
              </div>

              <div className={classes.socialMediaWrapper}>
                {facebookURL || twitterURL || instagramURL ? (
                  <div className={classes.socialMediaTitle}>Social Media:</div>
                ) : null}
                <div className={classes.socialMediaItemsWrapper}>
                  {facebookURL ? (
                    <a
                      href={facebookURL}
                      target="_blank"
                      className={classes.socialMediaItemWrapper}
                    >
                      <FaFacebook className={classes.facebook} />
                    </a>
                  ) : null}
                  {twitterURL ? (
                    <a
                      href={twitterURL}
                      target="_blank"
                      className={classes.socialMediaItemWrapper}
                    >
                      <FaTwitter className={classes.twitter} />
                    </a>
                  ) : null}
                  {instagramURL ? (
                    <a
                      href={instagramURL}
                      target="_blank"
                      className={classes.socialMediaItemWrapper}
                    >
                      <FaInstagram />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.rightColumnWrapper}>
            <div>
              <h1 className={classes.name}>{name}</h1>
              <small className={classes.title}>{title}</small>
              <div className={classes.descriptionWrapper}>
                <div className={classes.descriptionTitle}>
                  About {capitalize(name.split(' ')[0])}
                </div>
                <FormattedText className={classes.descriptionDetails}>
                  {description}
                </FormattedText>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ListingsSection />
        </div>
      </div>
    );
  }
}

export default Profile;
