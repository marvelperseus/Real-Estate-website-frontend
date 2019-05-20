import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
// import Carousel from 'nuka-carousel';

const styles = theme => ({
  root: {
    position: 'relative',
    padding: '60px 10%',
    height: '500px',
    width: '100%',
    backgroundImage: 'url(/static/images/featured-property.jpg)',
    backgroundPosition: 'center top',
    backgroundSize: 'cover',
    color: '#fff',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
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
  sectionTitle: {
    textAlign: 'center',
    ontWeight: '600',
    marginBottom: '40px',
    fontSize: '2.2rem',
    textTransform: 'uppercase',
  },
});

@observer
@withStyles(styles)
class HowItWorksSection extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} id="featured-property">
        <div className={classes.contentWrapper}>

        </div>
      </div>
    );
  }
}

export default HowItWorksSection;
