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
  root: {},
});

@observer
@withStyles(styles)
@withScriptjs
@withGoogleMap
class ListingsMap extends Component {
  renderMapMarkers = listingItems =>
    listingItems.map((listingItem,i) => {
      const { longitude, latitude, listingID } = listingItem;

      return (
        <CustomMapMarker
          longitude={longitude}
          latitude={latitude}
          listingID={listingID}
          key={i}
        />
      );
    });

  render() {
    const { classes, listings } = this.props;
    return (
      <div className={classes.root}>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
          <Marker position={{ lat: -34.397, lng: 150.644 }} />
          {listings && this.renderMapMarkers(listings)}
        </GoogleMap>
      </div>
    );
  }
}

export default ListingsMap;
