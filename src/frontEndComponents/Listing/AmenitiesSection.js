import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 25px 25px 25px',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
    color: 'rgba(0,0,0,.8)',
    border: '1px solid rgba(0,0,0,.1)',
    backgroundColor: '#fff',
  },
  descriptionTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '20px 10px',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: '600',
    borderBottom: '1px solid rgba(0,0,0,.1)',
  },
  description: {
    lineHeight: '1.6rem',
  },
  myIcon: {
    height: 90,
    marginRight: 30,
    '&last-of-type': {
      marginRight: 0,
    },
  },
});

@withStyles(styles)
@observer
class AmenitiesSection extends React.Component {
  renderAmenities = (amenities = []) => {
    const { classes } = this.props;

    return amenities.map(amenity => {
      const { name, icon } = amenity;
      return (
        <div className={classes.amenityItem}>
          <div className={classes.amenityIcon}>{icon}</div>
          <div className={classes.amenityName}>{name}</div>
        </div>
      );
    });
  };

  render() {
    const { classes, amenities } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.descriptionTitle}>Amenities</div>
        <div className={classes.description}>
          {this.renderAmenities(amenities)}
          <img src="/static/icons/balcony.svg" className={classes.myIcon} />
          <img src="/static/icons/gym.svg" className={classes.myIcon} />
          <img
            src="/static/icons/securitysystem.svg"
            className={classes.myIcon}
          />
          <img
            src="/static/icons/virtualdoorman.svg"
            className={classes.myIcon}
          />
        </div>
      </div>
    );
  }
}

export default AmenitiesSection;
