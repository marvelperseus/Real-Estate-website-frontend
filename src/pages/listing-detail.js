import { Fragment, Component } from 'react';
import { withRouter } from 'next/router';
import getConfig from 'next/config';
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
import {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
} from 'react-share';

const { publicRuntimeConfig } = getConfig();

const allListingsQuery = gql`
  query allListings($filters: String!, $orderby: String, $page: Int) {
    allListings(filters: $filters, orderby: $orderby, page: $page) {
      listings {
        images
        listingID
        address
        offer
        beds
        baths
        borough
        price
      }
    }
  }
`;

const listingQuery = gql`
  query listingWithAgent($uuid: String!) {
    listingWithAgent(uuid: $uuid) {
      listing {
        listingID
        images
        address
        offer
        neighborhood
        borough
        category
        ownership
        type
        petPolicy
        floors
        unitCount
        builtIn
        approx
        amenities
        agentID
        agentName
        price
        featuredImage
        description
        updatedAt
        coordinates
        sqFootage
        moveInDate
        beds
        baths
      }
      agent {
        email
        agent {
          profilePicURL
          mobileNumber
          facebook
          twitter
          instagram
        }
      }
    }
  }
`;

@observer
class ListingDetail extends Component {
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
    const listingID = id;

    return (
      <Layout UserStore={this.store.UserStore}>
        <Query
          query={listingQuery}
          ssr={false}
          variables={{ uuid: listingID }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>error</p>;
            if (data) {
              return <Page {...data.listingWithAgent} {...this.props} />;
            }
          }}
        </Query>
      </Layout>
    );
  }
}

class Page extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    note: '',
    error: null,
    status: null,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  messageAgent = e => {
    e.preventDefault();
    const { email, note, name, phone } = this.state;
    const { agent } = this.props;
    if (email !== '' && note !== '' && name !== '') {
      messageAgent({
        to: agent.email,
        from: email,
        text: note,
        subject: `Message From ${this.state.name} | ${this.state.phone}`,
      });
      this.setState({
        error: null,
        status: 'Thanks for your feedback!',
        name: '',
        email: '',
        phone: '',
        note: '',
      });
    } else {
      this.setState({ error: 'Enter an email and a note' });
    }
  };

  componentDidMount() {
    const { listing } = this.props;
    const mapboxgl = require('mapbox-gl');
    mapboxgl.accessToken =
      'pk.eyJ1IjoicmV5ZXNlbHNhbWFkIiwiYSI6ImNqcWg3NWs0MDBpaXMzeHFqZGNpd2VnODEifQ.mLXE6QDGRc2bqLb7tx5ogw';

    const neighborhoods = require('../constants/neighborhoods');
    console.log(neighborhoods);

    const neighborhood = neighborhoods.find(
      n => n.title === listing.neighborhood
    );
    const borough = neighborhood.value.find(b => b.value === listing.borough);

    const map = new mapboxgl.Map({
      container: 'location-map',
      style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
      center: borough.coordinates,
      zoom: 12,
    });

    // Create label
    var label = document.createElement('div');
    label.classList.add('marker-label');
    var text = document.createTextNode(listing.borough);
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
    const { listing, agent, mapRef } = this.props;
    const [featuredImage, ...images] = listing.images;
    const hostname = publicRuntimeConfig.HOSTNAME;
    console.log(hostname, publicRuntimeConfig, this.props.router);
    return (
      <div>
        <section className="listing-detail list-ner">
          <div id="myCarousel" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              <li
                data-target="#myCarousel"
                data-slide-to="0"
                className="active"
              />
              {images.map((i, index) => (
                <li data-target="#myCarousel" data-slide-to={index + 1} />
              ))}
            </ol>

            <div className="carousel-inner">
              <div className="item active">
                <img
                  src={featuredImage}
                  alt="Los Angeles"
                  style={{ width: '100%' }}
                />
              </div>

              {images.map(image => (
                <div className="item">
                  <img
                    src={image}
                    alt="Los Angeles"
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>

            <a
              className="left carousel-control"
              href="#myCarousel"
              data-slide="prev"
            >
              <img src="/static/img/list-arrow.png" />
            </a>
            <a
              className="right carousel-control"
              href="#myCarousel"
              data-slide="next"
            >
              <img src="/static/img/list-right.png" />
            </a>
          </div>
        </section>
        <section className="fran-section">
          <div className="container">
            <div className="col-xs-12 col-sm-9 col-md-8">
              <div className="fran-detail">
                <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
                  {listing.address}
                </h3>
                <p>
                  <i className="fa fa-map-marker" aria-hidden="true" />
                  {listing.neighborhood}, {listing.borough}
                </p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-4">
              <div className="rent-sec">
                <h3>{listing.offer}</h3>
                <h4>
                  $ {Number(listing.price).toLocaleString('en')}
                  {/*<span>/mo</span>*/}
                </h4>
              </div>
            </div>
          </div>
        </section>
        <section className="detail-feature listing-detail">
          <div className="container">
            <h3>Property Features</h3>
            <ul>
              <li>
                <figure>
                  <img src="/static/img/cata.png" />
                </figure>
                <figcaption>
                  <h4>Category</h4>
                  <h6>{listing.category}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/owner.png" />
                </figure>
                <figcaption>
                  <h4>Ownership</h4>
                  <h6>{listing.ownership}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/type.png" />
                </figure>
                <figcaption>
                  <h4>Type</h4>
                  <h6>{listing.type}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/pet.png" />
                </figure>
                <figcaption>
                  <h4>Pet Policy</h4>
                  <h6>{listing.petPolicy}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/floor.png" />
                </figure>
                <figcaption>
                  <h4>Floors</h4>
                  <h6>{listing.floors}</h6>
                </figcaption>
              </li>
              <li>
                <figure>
                  <img src="/static/img/unit.png" />
                </figure>
                <figcaption>
                  <h4>Residence Count</h4>
                  <h6>{listing.unitCount || 'n/a'}</h6>
                </figcaption>
              </li>
            </ul>
          </div>
        </section>
        <section className="descript-detail">
          <div className="container">
            <div className="col-md-9 col-sm-8 col-xs-12">
              <div className="thumb-left">
                <h3>Description</h3>
                <p>{listing.description}</p>
                {/*
                <ul className="dis-cust">
                  <li>First and security required at lease signing</li>
                  <li>No Fee!</li>
                  <li>Pets allowed on a case by case basis</li>
                </ul>
                */}
                <h3>Amenities </h3>
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <ul className="animate-cust">
                    {listing.amenities
                      .slice(0, Math.ceil(listing.amenities.length / 3))
                      .map(amenity => <li key={amenity}>{amenity}</li>)}
                  </ul>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <ul className="animate-cust">
                    {listing.amenities
                      .slice(
                        Math.ceil(listing.amenities.length / 3),
                        Math.ceil(listing.amenities.length * 2 / 3)
                      )
                      .map(amenity => <li key={amenity}>{amenity}</li>)}
                  </ul>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <ul className="animate-cust">
                    {listing.amenities
                      .slice(
                        Math.ceil(listing.amenities.length * 2 / 3),
                        listing.amenities.length
                      )
                      .map(amenity => <li key={amenity}>{amenity}</li>)}
                  </ul>
                </div>
                <h3>Location</h3>
                <iframe
                  width="100%"
                  height="5"
                  frameborder="0"
                  style={{ border: 0 }}
                  allowfullscreen=""
                />
                <div style={{ height: '400px' }}>
                  <div
                    id="location-map"
                    style={{
                      display: 'flex',
                      height: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-4 col-xs-12">
              <div className="thumb-right">
                <div className="cont-now">
                  <img src={agent.agent.profilePicURL || "/static/img/npicture.jpg"} />
                  <h4>Contact Now</h4>
                  <h5>{listing.agentName}</h5>
                  <p>
                    <a href="#">
                      <i className="fa fa-phone" aria-hidden="true" />{' '}
                      {agent.agent.mobileNumber}
                    </a>{' '}
                  </p>
                  <form>
                    <h3>Get in Touch</h3>
                    <input
                      type="text"
                      name="name"
                      onChange={this.handleChange}
                      value={this.state.name}
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      name="email"
                      onChange={this.handleChange}
                      value={this.state.email}
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      onChange={this.handleChange}
                      value={this.state.phone}
                      placeholder="Phone"
                    />
                    <textarea
                      name="note"
                      onChange={this.handleChange}
                      value={this.state.note}
                      class=""
                      placeholder="Leave a Note..."
                      required
                    />
                    {this.state.error && <div>{this.state.error}</div>}
                    {this.state.status && <div>{this.state.status}</div>}
                    <a class="talk-client" onClick={this.messageAgent}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        width="25.73px"
                        height="25.73px"
                        viewBox="0 0 25.73 25.73"
                        style={{ enableBackground: 'new 0 0 25.73 25.73' }}
                      >
                        <g>
                          <g>
                            <path d="M24.408,0.597L0.706,13.026c-0.975,0.511-0.935,1.26,0.088,1.665l3.026,1.196c1.021,0.404,2.569,0.185,3.437-0.494    L20.399,5.03c0.864-0.681,0.957-0.58,0.206,0.224l-10.39,11.123c-0.753,0.801-0.529,1.783,0.495,2.182l0.354,0.139    c1.024,0.396,2.698,1.062,3.717,1.478l3.356,1.366c1.02,0.415,1.854,0.759,1.854,0.765c0,0.006,0.006,0.025,0.011,0.026    c0.005,0.002,0.246-0.864,0.534-1.926L25.654,1.6C25.942,0.537,25.383,0.087,24.408,0.597z" />
                            <path d="M10.324,19.82l-2.322-0.95c-1.018-0.417-1.506,0.072-1.084,1.089c0.001,0,2.156,5.194,2.096,5.377    c-0.062,0.182,2.068-3.082,2.068-3.082C11.684,21.332,11.342,20.237,10.324,19.82z" />
                          </g>
                        </g>
                      </svg>{' '}
                      Submit
                    </a>
                  </form>
                </div>
                <ul class="social-drop">
                  <div style={{ margin: '0 auto' }}>
                    <div
                      style={{
                        verticalAlign: 'top',
                        display: 'inline-block',
                        marginRight: '15px',
                        textAlign: 'center',
                      }}
                    >
                      <FacebookShareButton
                        url={hostname + this.props.router.asPath}
                      >
                        <FacebookIcon size={42} round />
                      </FacebookShareButton>
                    </div>
                    <div
                      style={{
                        verticalAlign: 'top',
                        display: 'inline-block',
                        marginRight: '15px',
                        textAlign: 'center',
                      }}
                    >
                      <TwitterShareButton
                        url={hostname + this.props.router.asPath}
                      >
                        <TwitterIcon size={42} round />
                      </TwitterShareButton>
                    </div>
                    <div
                      style={{
                        verticalAlign: 'top',
                        display: 'inline-block',
                        marginRight: '15px',
                        textAlign: 'center',
                      }}
                    >
                      <LinkedinShareButton
                        url={hostname + this.props.router.asPath}
                      >
                        <LinkedinIcon size={42} round />
                      </LinkedinShareButton>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="ability">
          <div className="container">
            <h3>Availabilities</h3>
            <h4>On Market</h4>
            <Query
              query={allListingsQuery}
              ssr={false}
              fetchPolicy="cache-and-network"
              variables={{ filters: '{}', orderby: '{}', page: 0 }}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading</p>;
                if (error) return <p>error</p>;
                if (data) {
                  const { listings } = data.allListings;
                  return listings.slice(2).map(listing => (
                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <a href={'/listing-detail?id=' + listing.listingID}>
                        <div class="ability-inner">
                          <figure>
                            <img
                              src={listing.images[0] || '/static/img/bed1.png'}
                            />
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
                            <h6>
                              ${Number(listing.price).toLocaleString('en')}
                            </h6>
                          </div>
                        </div>
                      </a>
                    </div>
                  ));
                }
              }}
            </Query>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

ListingDetail = withData(ListingDetail);
ListingDetail = withRouter(ListingDetail);

export default ListingDetail;
