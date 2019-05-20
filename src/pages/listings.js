import React from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Chance from 'chance';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';

import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import ListingsFilterAndSearchSection from '../frontEndContainers/ListingsFilterAndSearchSection';
import MapAndListingsSection from '../frontEndComponents/MapAndListingsSection';
import withData from '../lib/withData';
const chance = new Chance();

const Loader = DotLoader;
const PAGE_LENGTH = 5;

const listingsQuery = gql`
  query allListings($filters: String!, $orderby: String, $page: Int) {
    allListings(filters: $filters, orderby: $orderby, page: $page) {
      listings {
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
      count
    }
  }
`;

const listings = [
  {
    featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
      min: 1,
      max: 1000,
    })}`,
    otherPhotoURLs: [
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
    ],
    address: '225 West 60th Street, Manhattan NY, 10023',
    neighborhood: 'Jackson Heights',
    price: 2000,
    beds: 3,
    baths: 2,
    isLiked: false,
    isNoFee: false,
    monthsOfFreeRent: 0,
    sqFootage: 6339,
    type: 'Residential Rental',
    id: 'jxj595h9f5i5fj',
  },
  {
    featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
      min: 1,
      max: 1000,
    })}`,
    otherPhotoURLs: [
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
    ],
    address: '452 West 60th Street, Manhattan NY, 10023',
    neighborhood: 'Jackson Heights',
    price: 1400,
    beds: 2,
    baths: 2,
    isLiked: true,
    isNoFee: true,
    monthsOfFreeRent: 1,
    sqFootage: 5225,
    type: 'Residential Rental',
    id: 'o3j9dn9un3nj3',
  },
  {
    featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
      min: 1,
      max: 1000,
    })}`,
    otherPhotoURLs: [
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
    ],
    address: '893 West 60th Street, Manhattan NY, 10023',
    neighborhood: 'SoHo',
    price: 3700,
    beds: 3,
    baths: 3,
    isLiked: false,
    isNoFee: false,
    monthsOfFreeRent: 2,
    sqFootage: 5225,
    type: 'Residential Rental',
    id: 'cinoervtoi4in',
  },
];
@observer
class Listings extends React.Component {
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
    this.state = {
      filter: '{}',
      orderby: '{}',
      isCardType: true,
      page: 0,
    };
    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  onSubmitSearch = value => {
    console.log({ filter: value });
    this.setState({ filter: value });
  };

  setCardType = value => {
    this.setState({ isCardType: value });
  };

  goToPage = value => {
    const page = value === 'next' ? this.state.page + 1 : this.state.page - 1;
    this.setState({ page });
  };

  onOrderBy = value => {
    console.log({ orderby: value });
    this.setState({ orderby: value });
  };

  render() {
    const { onSubmitSearch } = this;
    const { filter, orderby, isCardType, page } = this.state;

    return (
      <Layout UserStore={this.store.UserStore} headerBoxShadowOff>
        <ListingsFilterAndSearchSection onSubmit={onSubmitSearch} />
        <Query
          query={listingsQuery}
          ssr={false}
          variables={{ filters: filter, orderby: orderby, page: page }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 110px)',
                     position:'absolute',
                    left:'0',
                    right:'0',
                    margin:'0 auto',
                     }}
                >
                  <Loader color="#f44336" loading />
                </div>
              );
            }
            const intListings = {};
            const listings = [];

            if (error) {
              console.log(error);
              return (
                <div style={{ textAlign: 'center' }}>
                  We're sorry. There was an error processing your request.
                </div>
              );
            }
            const allListings = [
              ...data.allListings.listings,
              // ...this.state.addedListings,
            ];
            const count = data.allListings.count;
            allListings.forEach(listing => {
              if (listing) {
                let tmp_listing = {};
                tmp_listing['geometry'] = {
                  type: 'Point',
                  coordinates: listing.coordinates,
                };
                tmp_listing['properties'] = listing;
                listings.push(tmp_listing);
                intListings[listing.listingID] = listing;
              }
            });
            let uniqueListings = [];
            Object.keys(intListings).forEach(key => {
              uniqueListings.push(intListings[key]);
            });

            return (
              <div class="listing-cust">
                <MapAndListingsSection
                  onOrderBy={this.onOrderBy}
                  orderby={orderby}
                  isCardType={isCardType}
                  setCardType={this.setCardType}
                  listings={listings}
                  count={count}
                  filter={filter}
                  pagination={{
                    goToPage: this.goToPage,
                    page: this.state.page,
                    prevDisabled: this.state.page === 0,
                    nextDisabled:
                      this.state.page * PAGE_LENGTH + listings.length <
                      (this.state.page + 1) * PAGE_LENGTH,
                  }}
                />
              </div>
            );
          }}
        </Query>
      </Layout>
    );
  }
}

export default withData(Listings);
