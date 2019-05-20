import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { BounceLoader } from 'react-spinners';
import ListingsMap from '../frontEndComponents/SingleListingMap';

const Loader = BounceLoader;

const GOOGLE_MAPS_API_KEY = 'AIzaSyALC0RdIvbBvmFCj8P5IBClasErYh0QqdQ';

@observer
class SingleListingMapContainer extends Component {
  render() {
    const { height, listing } = this.props;
    return (
      <ListingsMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Loader color="#f44336" loading />
          </div>
        }
        listing={listing}
        height={height}
        containerElement={<div style={{ height: `${height}px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default SingleListingMapContainer;
