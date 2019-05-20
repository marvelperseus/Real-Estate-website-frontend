import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import Head from 'next/head';
import Footer from '../components/Footer';
import ComingSoonJumbotronHeader from '../frontEndContainers/ComingSoonJumbotronHeader';
import ReactFullpage from '@fullpage/react-fullpage';
import Header from '../components/Header';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import HowItWorksSection from '../frontEndComponents/HowItWorksSection';
// import FeaturedPropertySection from '../frontEndComponents/FeaturedPropertySection';

const featuredListingQuery = gql`
  query featuredListing {
    featuredListing {
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
  }
`;

@observer
class Home extends React.Component {
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
    return (
      <Fragment>
        <Head>
        <link rel="icon" type="image/png" href="/static/favicon.png"/>
          <link
            href="/static/css/font-awesome-4.7.0/css/font-awesome.css"
            rel="stylesheet"
          />
          <link href="/static/css/bootstrap.min.css" rel="stylesheet" />
          <link href="/static/css/style.css?v=1.1.1" rel="stylesheet" />
          <link href="/static/css/responsive.css?v=1.1.5" rel="stylesheet" />
          <link
            rel="stylesheet"
          />

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" />
          <script src="/static/js/bootstrap.min.js" />

        </Head>
        <Query
          query={featuredListingQuery}
          ssr={false}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return 'loading'
            if (error) return 'error'
            console.log('Featured Listing', data);
            const [featuredListing, ...rest] = data.featuredListing;
            return <Page featuredListing={featuredListing} listings={rest} UserStore={this.store.UserStore}/>
          }}
          </Query>
        </Fragment>
    );
  }
}

const Page = ({featuredListing, listings, UserStore}) => (
  <Fragment>
            <Header UserStore={UserStore} className="fuckman" />
            <div class="section first">
              <div class="m-inner-wrap">
                <h2>
                Your New Home is just a Search Away. 
                </h2>
                <ul>
                  <li>
                   <a>
                   <figure>
                      <img src="/static/img/search.png" />
                    </figure>
                    <figcaption>
                      <p>Search Commercial</p>
                    </figcaption>
                   </a>
                  </li>
                  <li>
                   <a>
                   <figure>
                      <img src="/static/img/search2.png" />
                    </figure>
                    <figcaption>
                      <p>Search Residential</p>
                    </figcaption>
                   </a>
                  </li>
                </ul>
                <div class="arrow-down">
                  <a href="#">
                    <img src="/static/img/arrow.png" />
                  </a>
                </div>
              </div>
            </div>
            <div class="section">
              <div class="m-inner-wrap">
                <div
                  id="myCarousel"
                  class="carousel slide"
                  data-ride="carousel"
                >
                  <div class="carousel-inner">
                    <div
                      class="item active"
                      style={{ backgroundImage: 'url(' + featuredListing.images[0] + ')' }}
                    >
                      <div class="tow-dean">
                        <div class="left-side">
                          <h4>{featuredListing.neighborhood}</h4>
                          <p>
                            Price <b>${Number(featuredListing.price).toLocaleString('en')}</b>
                          </p>
                          <p>
                            Price Per Sq Foot <b>${(Number(featuredListing.price) / Number(featuredListing.approx)).toFixed(2)}</b>
                          </p>
                        </div>
                        <div class="right-side">
                          <h3>
                            {featuredListing.address}
                          </h3>
                              <p>{featuredListing.type}</p>
                          <div class="location">
                            <p>
                              <i class="fa fa-map-marker" aria-hidden="true" />{' '}
                              {featuredListing.borough + ', ' + featuredListing.neighborhood}
                            </p>
                            <a style={{zIndex: 99, position: 'relative'}} href={"/listing-detail?id=" + featuredListing.listingID}>
                              More Detail{' '}
                              <i
                                class="fa fa-angle-double-right"
                                aria-hidden="true"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {listings.map(listing => (
                    <div
                      class="item"
                      style={{ backgroundImage: 'url(' + listing.images[0] + ')' }}
                    >
                      <div class="tow-dean">
                        <div class="left-side">
                          <h4>{listing.neighborhood}</h4>
                          <p>
                            Price <b>${Number(listing.price).toLocaleString('en')}</b>
                          </p>
                          <p>
                            Price Per Sq Foot <b>${(Number(listing.price) / Number(listing.approx)).toFixed(2)}</b>
                          </p>
                        </div>
                        <div class="right-side">
                          <h3>
                            {listing.address}
                          </h3>
                              <p>{listing.type}</p>
                          <div class="location">
                            <p>
                              <i class="fa fa-map-marker" aria-hidden="true" />{' '}
                              {listing.borough + ', ' + listing.neighborhood}
                            </p>
                            <a style={{position: 'relative', zIndex: 99}} href={"/listing-detail?id=" + listing.listingID}>
                              More Detail{' '}
                              <i
                                class="fa fa-angle-double-right"
                                aria-hidden="true"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                  <a
                    class="left carousel-control"
                    href="#myCarousel"
                    data-slide="prev"
                  >
                    <img src="/static/img/left.png" />
                  </a>
                  <a
                    style={{zIndex: 98}}
                    class="right carousel-control"
                    href="#myCarousel"
                    data-slide="next"
                  >
                    <img src="/static/img/right.png" />
                  </a>
                </div>
              </div>
            </div>
            <div class="section third">
              <div class="m-inner-wrap">
                <div class="container">
                  <h2>The process</h2>
                  <h5>
                    Our <b>focus </b>is to help you find your gem, whether it be
                    your next apartment or condo, <br />but also your next
                    commercial property as well.
                  </h5>
                  <div class="three-sec">
                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <figure>
                        <img src="/static/img/three-1.png" />
                        <div class="text-center">
                          <span>1</span>
                        </div>
                      </figure>
                      <figcaption>
                        <a >Search</a>
                        <p>
                          "Seamless searching with our platform makes it quicker
                          and easier to find your next home.  Click on the
                          property you'd like to see and our agents will contact
                          you.  Grab a cup of coffee and start looking!
                        </p>
                      </figcaption>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <figure>
                        <img src="/static/img/three-2.png" />
                        <div class="text-center">
                          <span>2</span>
                        </div>
                      </figure>
                      <figcaption>
                        <a>Schedule a Viewing</a>
                        <p>
                          "We all have hectic schedules in our lives.  We can
                          hopefully make it better. Our agents are equipped with
                          industry leading tech, to get your appointment on
                          point! So, schedule a viewing with us today.
                        </p>
                      </figcaption>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4">
                      <figure>
                        <img src="/static/img/three-3.png" />
                        <div class="text-center">
                          <span>3</span>
                        </div>
                      </figure>
                      <figcaption>
                        <a>Rented, Sold, Delivered</a>
                        <p>
                          "Once you've gone through the happy emotional roller
                          coaster of home searching; we at Reyes & Elsamad will
                          be with you till the end of the process to make sure
                          you've gone through the best real estate experience
                          possible. {' '}
                        </p>
                      </figcaption>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="section get-started">
              <div class="m-inner-wrap">
                <div class="apply ">
                  <h2>Apply Online</h2>
                  <h4>
                    Apply for your New Home securely through our <br /> online
                    application.
                  </h4>
                  <a class="button-start" href="#">
                    Get Started
                  </a>
                </div>

                <div class="top-img">
                  <img src="/static/img/top.jpg" />
                </div>
                <Footer />
              </div>
            </div>
  </Fragment>
);

export default withData(Home);
