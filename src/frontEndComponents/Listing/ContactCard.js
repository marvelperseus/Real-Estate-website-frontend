import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import { FaFacebook, FaTwitter, FaInstagram, FaCopy } from 'react-icons/lib/fa';
import Tooltip from 'material-ui/Tooltip';
import { Link } from '../../routes';

const styles = theme => ({
  root: {
    height: 562,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '25px 25px',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
    color: 'rgba(0,0,0,.8)',
    border: '1px solid rgba(0,0,0,.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '35px',
    fontWeight: '600',
  },
  profilePicWrapper: {
    height: '100px',
    width: '100px',
    borderRadius: '50%',
    marginBottom: '25px',
  },
  profilePic: {
    height: '100px',
    width: '100px',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  detailsWrapper: {
    marginBottom: '25px',
    textAlign: 'center',
  },
  detail: {
    marginBottom: '5px',
  },
  btnsWrapper: {
    width: '100%',
    marginBottom: '35px',
  },
  defaultBtn: {
    display: 'block',
    width: '100%',
    padding: '10px 10px',
    marginBottom: 20,
    border: '1px solid rgba(0,0,0,.2)',
    borderRadius: '30px',
    color: 'rgba(0,0,0,.7)',
    cursor: 'pointer',
    transition: 'color .2s ease-in-out, border-color .2s ease-in-out',
    textDecoration: 'none',
    '&:hover': {
      color: 'rgba(0,0,0,.8)',
      borderColor: theme.palette.primary.main,
    },
    outline: 'none',
    fontSize: '.7rem',
    textAlign: 'center',
  },
  defaultBtnLast: {
    marginBottom: 0,
  },
  disabledBtn: {
    color: 'rgba(0,0,0,.3) !important',
    borderColor: 'rgba(0,0,0,.1) !important',
    cursor: 'not-allowed',
    outline: 'none',
  },
  shareTitle: {
    marginBottom: 20,
    fontWeight: '600',
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
    outline: 'none',
    '&:hover': {
      borderColor: 'rgba(0,0,0,.9)',
      color: 'rgba(0,0,0,.8)',
    },
    [theme.breakpoints.down('xs')]: {
      width: '45px',
      height: '45px',
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
class ContactCard extends React.Component {
  state = {
    tooltipOpen: false,
  };

  onFacebookShareClick = e => {
    if (e.preventDefault) e.preventDefault();

    const URL = encodeURI(`${window.location.href}`);

    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    const width = windowInnerWidth < 550 ? windowInnerWidth * 0.9 : 550;
    const height = windowInnerHeight < 450 ? windowInnerHeight * 0.7 : 450;

    const halfHeight = height / 2;
    const halfWidth = width / 2;

    const left = windowInnerWidth / 2 - halfWidth;
    const top = windowInnerHeight / 2 - halfHeight;

    const href = `https://www.facebook.com/sharer/sharer.php?u=${URL}`;
    window.open(
      href,
      'Facebook',
      `height=${height},width=${width},resizable=1,top=${top},left=${left},scrollbars=yes`
    );
  };

  onTwitterShareClick = e => {
    if (e.preventDefault) e.preventDefault();

    const text = 'I found a great new real estate listing!';
    const finalText = encodeURI(text);
    const hashTags = encodeURI(
      `real estate,listing,${this.props.neighborhood},home`
    );
    const URL = encodeURI(`${window.location.href}`);

    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    const width = windowInnerWidth < 550 ? windowInnerWidth * 0.9 : 550;
    const height = windowInnerHeight < 450 ? windowInnerHeight * 0.7 : 450;

    const halfHeight = height / 2;
    const halfWidth = width / 2;

    const left = windowInnerWidth / 2 - halfWidth;
    const top = windowInnerHeight / 2 - halfHeight;

    const href = `https://twitter.com/intent/tweet/?text=${finalText}&url=${URL}&hashtags=${hashTags}`;
    window.open(
      href,
      'Facebook',
      `height=${height},width=${width},resizable=1,top=${top},left=${left},scrollbars=yes`
    );
  };

  onCopyToClipboard = e => {
    if (e.preventDefault) e.preventDefault();
    const URL = `${window.location.href}`;

    const el = document.createElement('textarea');
    el.value = URL;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.handleTooltipOpen();
  };

  handleTooltipClose = () => {
    if (this.state.tooltipOpen) this.setState({ tooltipOpen: false });
  };

  handleTooltipOpen = () => {
    this.setState({ tooltipOpen: true });
    setTimeout(() => {
      if (this.state.tooltipOpen) this.setState({ tooltipOpen: false });
    }, 3000);
  };

  render() {
    const {
      classes,
      listingAgent,
      listingID,
      cantApplyOnline,
      toggleContactAgentModalOpen,
    } = this.props;
    const { profilePhotoURL, name, officeNumber, agentID } = listingAgent;

    return (
      <div className={classes.root}>
        <div className={classes.title}>Contact</div>
        <div className={classes.profilePicWrapper}>
          <Link route="agent" params={{ id: agentID }}>
            <a>
              <img
                className={classes.profilePic}
                src={profilePhotoURL}
                alt={name}
              />
            </a>
          </Link>
        </div>
        <div className={classes.detailsWrapper}>
          <div className={classnames(classes.name, classes.detail)}>{name}</div>
          <div className={classnames(classes.officeNumber, classes.detail)}>
            {officeNumber}
          </div>
          <div className={classnames(classes.listingID, classes.detail)}>
            Listing ID: {listingID}
          </div>
        </div>
        <div className={classes.btnsWrapper}>
          <button
            className={classes.defaultBtn}
            onClick={toggleContactAgentModalOpen}
          >
            Contact Agent
          </button>
          <Link route="apply" params={{ listingID }}>
            <a
              className={classnames(
                classes.defaultBtn,
                classes.defaultBtnLast,
                cantApplyOnline && classes.disabledBtn
              )}
            >
              Apply
            </a>
          </Link>
        </div>
        <div className={classes.shareTitle}>Share</div>
        <div className={classes.socialMediaWrapper}>
          <div
            className={classnames(
              classes.socialMediaItemsWrapper,
              classes.facebook
            )}
          >
            <button
              onClick={this.onFacebookShareClick}
              className={classes.socialMediaItemWrapper}
            >
              <FaFacebook className={classes.facebook} />
            </button>
            <button
              onClick={this.onTwitterShareClick}
              className={classnames(
                classes.socialMediaItemWrapper,
                classes.twittter
              )}
            >
              <FaTwitter className={classes.twitter} />
            </button>
            <Tooltip
              title={this.state.tooltipOpen ? 'Copied!' : 'Copy'}
              id="tooltip-copy"
              open={this.state.tooltipOpen}
              enterDelay={100}
              leaveDelay={100}
              placement="top"
            >
              <button
                onClick={this.onCopyToClipboard}
                className={classes.socialMediaItemWrapper}
              >
                <FaCopy />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactCard;
