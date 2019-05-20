import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
} from 'react-google-maps';
import CustomMapMarker from '../CustomMapMarker';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
});

@observer
@withStyles(styles)
@withScriptjs
@withGoogleMap
class MapSection extends Component {
  renderMapMarkers = listing => {
    const { longitude, latitude, listingID } = listing;
    return (
      <CustomMapMarker
        longitude={longitude}
        latitude={latitude}
        listingID={listingID}
      />
    );
  };

  render() {
    const { classes, listing } = this.props;
    return (
      <div className={classes.root}>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
          <Marker position={{ lat: -34.397, lng: 150.644 }} />
          {/* listing && this.renderMapMarker(listing) */}
        </GoogleMap>
      </div>
    );
  }
}

export default MapSection;
