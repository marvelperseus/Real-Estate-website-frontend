import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import { Link } from '../routes';
import Footer from '../components/Footer';

const newdevelopmentsQuery = gql`
  query newdevelopments {
    newdevelopments {
      newdevelopmentID
      name
      headline
      subheadline
      description
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
  }
`;

@observer
class NewDevelopments extends React.Component {
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
      <Layout UserStore={this.store.UserStore}>
        <Query
          query={newdevelopmentsQuery}
          ssr={false}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>error</p>;
            if (data) {
              return <Page {...data} />;
            }
          }}
        </Query>
      </Layout>
    );
  }
}

const Page = ({ newdevelopments }) => (
  <Fragment>
    <section class="listing-banner development">
      <div class="container">
        <div class="banner-text">
          <h3>New Developments</h3>
        </div>
        <div class="text-block position-relative">
          <h3  style={{color:'#fff'}}>Coming Soon ...</h3>
        </div>
        {/* <div class="listing-downn text-center">
          <a href="#indicate">
            <i class="fa fa-angle-down" aria-hidden="true" />
          </a>
        </div> */}
      </div>
    </section>
{/* 
    <section class="deve-middle" id="indicate">
      <div class="cust-container">
        {newdevelopments.map(
          (development, index) =>
            index % 2 === 0 ? (
              <div class="inner-detail">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <figure>
                    <img src={development.image} />
                  </figure>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <div class="right-side">
                    <figcaption>
                      <h3>
                        <span>{development.name}</span>
                        <br />
                        {development.headline}
                      </h3>
                      <h4>{development.subheadline}</h4>
                      <p>{development.description}</p>
                      <Link
                        href={
                          '/development-detail?id=' +
                          development.newdevelopmentID
                        }
                      >
                        Now Leasing
                      </Link>
                    </figcaption>
                  </div>
                </div>
              </div>
            ) : (
              <div class="inner-detail">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <div class="right-side">
                    <figcaption>
                      <h3>
                        <span>{development.name}</span>
                        <br />
                        {development.headline}
                      </h3>
                      <h4>{development.subheadline}</h4>
                      <p>{development.description}</p>
                      <Link
                        href={
                          '/development-detail?id=' +
                          development.newdevelopmentID
                        }
                      >
                        Now Leasing
                      </Link>
                    </figcaption>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <figure>
                    <img src={development.image} />
                  </figure>
                </div>
              </div>
            )
        )}
      </div>
    </section> */}
    <Footer />
  </Fragment>
);

export default withData(NewDevelopments);
