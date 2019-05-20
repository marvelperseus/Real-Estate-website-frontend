import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { BounceLoader } from 'react-spinners';

let map;

const Loader = BounceLoader;

@observer
class ListingsMapContainer extends Component {
  componentWillReceiveProps(props) {
    console.log('checking Props', props);
    if (
      map &&
      (this.props != props || !this.props.address || props.nMove == false) &&
      props.address
    ) {
      map.flyTo({
        center: props.address.properties.coordinates,
        zoom: 9,
      });
    }
  }

  componentDidMount() {
    const { selectListings, listings } = this.props;
    console.log('Did Mount', listings);

    const mapboxgl = require('mapbox-gl');
    mapboxgl.accessToken =
      'pk.eyJ1IjoicmV5ZXNlbHNhbWFkIiwiYSI6ImNqcWg3NWs0MDBpaXMzeHFqZGNpd2VnODEifQ.mLXE6QDGRc2bqLb7tx5ogw';

    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [   -73.900555, 40.694158],//[-74.0315, 40.6989] ,   
      zoom: 11,
    });

    listings.forEach(function(listing) {
      var el = new mapboxgl.Marker().getElement();
      el.className = 'marker';

      el.addEventListener('click', function() {
        let selectedFeature = listing.properties.address;
        selectListings(selectedFeature);
        map.flyTo({
          center: listing.geometry.coordinates,
          zoom: 11,
        });
      });
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(listing.geometry.coordinates)
        .addTo(map);
    });
  }

  componentWillUnmount() {
    console.log('Removing Map');
    map && map.remove();
  }

  flyToStore = currentFeature => {
    map.flyTo({
      center: currentFeature.properties.coordinates,
      zoom: 9,
    });
  };
  render() {
    return (
      <div className="MapSection" style={{ width: '100%', float: 'right', height: '100%' }}>
        <div ref={el => (this.mapContainer = el)} id="map" />
      </div>
    );
  }
}

export default ListingsMapContainer;
