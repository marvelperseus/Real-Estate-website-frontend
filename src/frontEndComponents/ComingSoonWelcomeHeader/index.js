import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import ArrowIcon from '@material-ui/icons/ArrowDownward';
import { Link } from 'react-scroll';
// import Carousel from 'nuka-carousel';

const styles = theme => ({
  root: {
    position: 'relative',
    height: 'calc(100vh - 60px)',
    width: '100%',
    backgroundImage: 'url(/static/images/breather-red.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  jumbotronImg: {
    position: 'absolute',
    left: '0',
    bottom: '0',
    right: '0',
    top: '0',
    zIndex: '-2',
    height: 'calc(100vh - 60px)',
    width: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '0',
    bottom: '0',
    right: '0',
    top: '0',
    zIndex: '1',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  innerContentWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    color: '#fff',
  },
  headline: {
    paddingLeft: '15px',
    paddingRight: '15px',
    fontSize: '2.3rem',
    lineHeight: '2.6rem',
    fontFamily: theme.frontEnd.typography.fontFamily.serif,
    textAlign: 'center',
    letterSpacing: '3px',
    marginBottom: '70px',
    textTransform: 'uppercase',
    borderBottom: `1px solid ${theme.frontEnd.colors.primary.main}`,
  },
  subHeadline: {
    marginBottom: '30px',
    maxWidth: '700px',
    fontSize: '1.1rem',
    lineHeight: '1.8rem',
    letterSpacing: '1px',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    textAlign: 'center',
  },
  searchTypeBtnsWrapper: {
    display: 'flex',
    height: '33px',
    width: '300px',
    border: '1px solid #D93F2A',
    borderRadius: '8px',
  },
  searchTypeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '50%',
    margin: 0,
    fontSize: '0.8rem',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '0px 8px 8px 0',
    cursor: 'pointer',
    color: 'rgba(0,0,0.8)',
    transition: 'color .1s ease-in-out, background-color .1s ease-in-out',
    '&:first-of-type': {
      borderRight: '1px solid #D93F2A',
      borderRadius: '8px 0 0 8px',
    },
    '&:hover': {
      color: 'rgba(255,255,255,1)',
      backgroundColor: '#D93F2A',
    },
  },
  slide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scrollDownBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    bottom: '20px',
    marginLeft: '-20px',
    height: '40px',
    width: '40px',
    backgroundColor: 'transparent',
    borderRadius: '50%',
    fontSize: '1rem',
    color: 'rgba(255,255,255,.7)',
    border: '1px solid rgba(255,255,255,.7)',
    cursor: 'pointer',
    zIndex: 1,
    transition: 'transform .2s ease-in-out, color .2s ease-in-out',
    '&:hover': {
      color: 'rgba(255,255,255,.9)',
      transform: 'scale(1.05,1.05)',
    },
  },
  downArrowIcon: {
    fontSize: '1.8rem',
    color: 'rgba(255,255,255,.7)',
  },
  redEmphasis: {
    color: theme.frontEnd.colors.primary.main,
  },
});

@observer
@withStyles(styles)
class WelcomeHeader extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.contentWrapper}>
          <div className={classes.innerContentWrapper}>
            <div id="slideOne" className={classNames(classes.slide)}>
              <div className={classes.headline}>
                Coming <span className={classes.redEmphasis}>-</span> Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeHeader;
