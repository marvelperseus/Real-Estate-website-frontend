import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { Marker } from 'react-google-maps';

const styles = theme => ({
  root: {
    height: '56px',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    backgroundColor: '#fff',
  },

});

@observer
@withStyles(styles)
class CustomMapMarker extends Component {
  render() {
    const { classes, longitude, latitude, defaultZoom, onClick } = this.props;
    return (
      <Marker
        defaultZoom={defaultZoom || 8}
        defaultCenter={{ lat: latitude, lng: longitude }}
        onClick={onClick}
      />
    );
  }
}

export default CustomMapMarker;
