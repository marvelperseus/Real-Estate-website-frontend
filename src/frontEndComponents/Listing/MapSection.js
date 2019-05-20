import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import SingleListingMap from '../../frontEndContainers/SingleListingMap';

const styles = theme => ({
  root: {
    padding: '25px 25px',
    width: '100%',
    color: 'rgba(0,0,0,.8)',
    border: '1px solid rgba(0,0,0,.1)',
    backgroundColor: '#fff',
  },
  descriptionTitle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 10px',
    paddingTop: '0',
    flexDirection: 'row',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: '600',
    borderBottom: '1px solid rgba(0,0,0,.1)',
  },
});

@observer
@withStyles(styles)
class MapSection extends Component {
  render() {
    const { classes, listing } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.descriptionTitle}>{listing.address}</div>
        <SingleListingMap listing={listing} height={380} />
      </div>
    );
  }
}

export default MapSection;
