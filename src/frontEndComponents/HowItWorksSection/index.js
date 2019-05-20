import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import classNames from 'classnames';
import {
  FaHome as HomeIcon,
  FaSearch as SearchIcon,
  FaKey as KeyIcon,
} from 'react-icons/lib/fa';
// import Carousel from 'nuka-carousel';

const styles = theme => ({
  root: {
    position: 'relative',
    padding: '60px 10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // height: '500px',
    width: '100%',
    backgroundColor: '#131413',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    color: '#fff',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
  },
  sectionTitle: {
    display: 'inline-block',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    ontWeight: '600',
    marginBottom: '40px',
    fontSize: '2.2rem',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
    textTransform: 'uppercase',
    '&:::after': {
      height: '2px',
      backgroundColor: theme.frontEnd.colors.primary.main,
      width: '40px',
      content: ' ',
    },
  },
  blurbWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  blurbText: {
    fontSize: '1.2rem',
    lineHeight: '1.8rem',
    textAlign: 'center',
    color: 'rgba(255,255,255,.7)',
  },
  blurbTitle: {
    fontWeight: '600',
    marginTop: '40px',
    marginBottom: '10px',
    fontSize: '1.8rem',
    lineHeight: '1.8rem',
    textAlign: 'center',
  },
  colorRed: {
    color: theme.frontEnd.colors.primary.main,
  },
  howItWordsBtn: {
    display: 'flex',
    height: '40px',
    width: '150px',
    marginTop: '40px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    color: '#fff',
    backgroundColor: theme.frontEnd.colors.primary.main,
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'color .2s ease-in-out, background-color .1s ease-in-out',
    '&:hover': {
      backgroundColor: theme.frontEnd.colors.primary.dark,
    }
  },
});

@observer
@withStyles(styles)
class HowItWorksSection extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} id="how-it-works">
        <div className={classes.sectionTitle}>
          How it works
        </div>
        <Grid container spacing={40}>
          <Grid item xs={12} md={4}>
            <div className={classes.blurbWrapper}>
              <SearchIcon
                color="inherit"
                size={90}
              />
              <div className={classes.blurbTitle}>
                Search
              </div>
              <div className={classes.blurbText}>
                Sed eu condimentum nisl. Quisque volutpat enim vitae mi elementum tristique quis eget metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.blurbWrapper}>
              <HomeIcon
                color="inherit"
                size={90}
              />
              <div className={classes.blurbTitle}>
                Schedule A Showing
              </div>
              <div className={classes.blurbText}>
                Sed eu condimentum nisl. Quisque volutpat enim vitae mi elementum tristique quis eget metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.blurbWrapper}>
              <KeyIcon
                color="inherit"
                size={90}
              />
              <div className={classes.blurbTitle}>
                Get Your Keys
              </div>
              <div className={classes.blurbText}>
                Sed eu condimentum nisl. Quisque volutpat enim vitae mi elementum tristique quis eget metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
              </div>
            </div>
          </Grid>
        </Grid>
        <button className={classes.howItWordsBtn}>Search</button>
      </div>
    );
  }
}

export default HowItWorksSection;
