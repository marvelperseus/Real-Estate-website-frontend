import { Fragment, Component } from 'react';
import { withRouter } from 'next/router';
import { initStore } from '../models';
import isBrowser from 'is-browser';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { observer } from 'mobx-react';
import Layout from '../frontEndComponents/FrontEndLayout';
import withData from '../lib/withData';
import messageAgent from '../effects/users/messageAgent';
import Footer from '../components/Footer';

const newdevelopmentQuery = gql`
  query newdevelopmentViewQuery($uuid: String!) {
    newdevelopmentViewQuery(uuid: $uuid) {
      newdevelopment {
        name
        headline
        subheadline
        description
        website
        image
        category
        ownership
        type
        petPolicy
        floors
        unitCount
        builderimage
        builderlogos
        neighborhood
        borough
      }
      agents {
        email
        firstName
        agent {
          mobileNumber
          profilePicURL
        }
      }
      listings {
        listingID
        address
        offer
        borough
        beds
        baths
        price
      }
    }
  }
`;

@observer
class NewDevelopmentDetail extends Component {
  static getInitialProps({ req }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  render() {
    const { query: { id } } = this.props.router;
    const newdevelopmentID = id;

    return (
      <Layout UserStore={this.store.UserStore}>
        <Query
          query={newdevelopmentQuery}
          ssr={false}
          variables={{ uuid: newdevelopmentID }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>error</p>;
            if (data) {
              return <Page {...data.newdevelopmentViewQuery} />;
            }
          }}
        </Query>
      </Layout>
    );
  }
}

class Page extends Component {
  componentDidMount() {
    const { newdevelopment } = this.props;
    const mapboxgl = require('mapbox-gl');
    mapboxgl.accessToken =
      'pk.eyJ1IjoicmV5ZXNlbHNhbWFkIiwiYSI6ImNqcWg3NWs0MDBpaXMzeHFqZGNpd2VnODEifQ.mLXE6QDGRc2bqLb7tx5ogw';

    const neighborhoods = require('../constants/neighborhoods');
    console.log(neighborhoods);

    const neighborhood = neighborhoods.find(
      n => n.title === newdevelopment.neighborhood
    );
    const borough = neighborhood.value.find(
      b => b.value === newdevelopment.borough
    );

    const map = new mapboxgl.Map({
      container: 'location-map',
      style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
      center: borough.coordinates,
      zoom: 12,
    });

    // Create label
    var label = document.createElement('div');
    label.classList.add('marker-label');
    var text = document.createTextNode(newdevelopment.borough);
    label.appendChild(text);
    const markerEl = new mapboxgl.Marker().getElement();
    markerEl.classList.add('marker');
    markerEl.appendChild(label);
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat(borough.coordinates)
      .addTo(map);

    map.on('load', function() {
      for (let i = 0; i < borough.boundaries.length; i++) {
        map.addLayer({
          id: 'maine' + i,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: borough.boundaries[i],
              },
            },
          },
          layout: {},
          paint: {
            'line-width': 3,
            'line-color': ['get', 'color'],
          },
        });
      }
    });
  }

  render() {
    const { newdevelopment, agents, listings } = this.props;
    return (
      <Fragment>
        <section class="listing-banner development">
          <div class="container">
            <div class="banner-text">
              <h3>{newdevelopment.name}</h3>
            </div>
          </div>
        </section>
        <section class="deve-detail">
          <div class="container">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="detail-left">
                <figure>
                  <img
                    style={{ objectFit: 'cover' }}
                    src={newdevelopment.image}
                  />
                </figure>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="detail-right">
                <img src="/static/img/wave.png" />
                <h3>{newdevelopment.headline}</h3>
                <h5>{newdevelopment.subheadline}</h5>
                <p>{newdevelopment.description}</p>
              </div>
            </div>
          </div>
        </section>
        <section class="detail-feature">
          <div class="container">
            <h3>Features</h3>
            <ul>
              <li>
                <figure>
                  <img src="/static/img/cata.png" />
                </figure>
                <figcaption>
                  <h4>Category</h4>
                  <h6>{newdevelopment.category}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/owner.png" />
                </figure>
                <figcaption>
                  <h4>Ownership</h4>
                  <h6>{newdevelopment.ownership}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/type.png" />
                </figure>
                <figcaption>
                  <h4>Type</h4>
                  <h6>{newdevelopment.type}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/pet.png" />
                </figure>
                <figcaption>
                  <h4>Pet Policy</h4>
                  <h6>{newdevelopment.petPolicy}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/floor.png" />
                </figure>
                <figcaption>
                  <h4>Floors</h4>
                  <h6>{newdevelopment.floors}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/unit.png" />
                </figure>
                <figcaption>
                  <h4>Unit Count</h4>
                  <h6>{newdevelopment.unitCount}</h6>
                </figcaption>
              </li>
            </ul>
            <a class="vist-site" href={newdevelopment.website}>
              Visit Website
            </a>
          </div>
        </section>
        <section class="deve-detail second-view">
          <div class="container">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="detail-right">
                <img src="/static/img/wave.png" />
                <h3>Our Builders</h3>
                <ul>
                  {newdevelopment.builderlogos.map(logo => (
                    <li>
                      <img
                        style={{ maxWidth: '90%', maxHeight: '300px' }}
                        src={logo}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="detail-left">
                <figure>
                  <img
                    style={{ objectFit: 'cover' }}
                    src={newdevelopment.builderimage}
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>
        <section class="ability">
          <div class="container">
            <h3>Availabilities</h3>
            <h4>On Market</h4>
            <div
              style={{ display: 'flex', justifyContent: 'center' }}
              class="container"
            >
              {listings.map(listing => (
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <a href={'/listing-detail?id=' + listing.listingID}>
                    <div class="ability-inner">
                      <figure>
                        <img src="/static/img/bed1.png" />
                      </figure>
                      <figcaption>
                        <div class="heart-sec">
                          <a href="#">
                            <i class="fa fa-heart-o" aria-hidden="true" />
                            <br />0
                          </a>
                        </div>
                        <h2>{listing.address}</h2>
                        <div class="rental">
                          <ul>
                            <li>
                              <a>
                                {' '}
                                {listing.offer === 'RENT'
                                  ? 'Rentals'
                                  : 'Sell'}{' '}
                              </a>
                            </li>
                            <li>
                              <a>|</a>
                            </li>
                            <li>
                              <a>{listing.borough}</a>
                            </li>
                          </ul>
                          <p>
                            <img src="/static/img/bed.png" />
                            <span>{listing.beds} Bed</span>
                          </p>
                          <p>
                            <img src="/static/img/beath.png" />
                            <span>{listing.baths} bath</span>
                          </p>
                        </div>
                      </figcaption>
                      <div class="price">
                        <h6>${Number(listing.price).toLocaleString('en')}</h6>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section class="agent-rep">
          <div class="container">
            <h3>Your Agents Representing the address</h3>
            {agents.map(agent => (
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="agent-detail">
                  <figure>
                    {agent.agent.profilePicURL ? (
                      <img
                        style={{ width: '160px', height: '160px' }}
                        src={agent.agent.profilePicURL}
                      />
                    ) : (
                      <div
                        style={{
                          width: '160px',
                          height: '160px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'black',
                          color: 'white',
                        }}
                      >
                        No Profile Picture
                      </div>
                    )}
                  </figure>
                  <figcaption>
                    <h4>
                      <a href="#">Agent</a>
                    </h4>
                    <h3>
                      <a href="#">{agent.firstName}</a>
                    </h3>
                    <h5>{agent.email}</h5>
                    <p>
                      <span>P </span>
                      {agent.agent.mobileNumber}
                    </p>
                  </figcaption>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section class="map">
          <iframe
            width="100%"
            height="5"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen
          />
          <div style={{ height: '500px' }}>
            <div
              id="location-map"
              style={{
                display: 'flex',
                height: '100%',
              }}
            />
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

NewDevelopmentDetail = withData(NewDevelopmentDetail);
NewDevelopmentDetail = withRouter(NewDevelopmentDetail);

export default NewDevelopmentDetail;
