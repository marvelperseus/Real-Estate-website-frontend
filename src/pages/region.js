import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';

// import HowItWorksSection from '../frontEndComponents/HowItWorksSection';
// import FeaturedPropertySection from '../frontEndComponents/FeaturedPropertySection';

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
          <link href="/static/css/style.css" rel="stylesheet" />
        </Head>
        <Layout UserStore={this.store.UserStore}>
          <Page />
          <Footer />
        </Layout>
      </Fragment>
    );
  }
}

const Page = () => (
  <Fragment>
    <section class="listing-banner">
      <div class="container">
        <div class="banner-text">
          <h3>
            Select Your City.
          </h3>
          <select>
            <option>New York City</option>
          </select>
        </div>
        <div class="listing-downn text-center">
          <a href="#indicate">
            <i class="fa fa-angle-down" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
    <section class="listing-middle" id="indicate">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-6 col-sm-6">
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/brook.jpg" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Brooklyn
                  </h4>
                </figcaption>
              </a>
            </div>
          </div>
          <div class="col-xs-12 col-md-6 col-sm-6 second-se">
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/manh.png" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Manhattan
                  </h4>
                </figcaption>
              </a>
            </div>
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/quen.png" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Queens
                  </h4>
                </figcaption>
              </a>
            </div>
          </div>
          <div class="col-xs-12 col-md-4 col-sm-4">
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/box.png" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Bronx
                  </h4>
                </figcaption>
              </a>
            </div>
          </div>
          <div class="col-xs-12 col-md-4 col-sm-4">
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/long.png" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Long Island
                  </h4>
                </figcaption>
              </a>
            </div>
          </div>
          <div class="col-xs-12 col-md-4 col-sm-4">
            <div class="brooklyn">
                <a href="/listings">
                <figure>
                  <img src="/static/img/sten.png" />
                </figure>
                <figcaption>
                  <h4>
                    <img src="/static/img/wave.png" />
                    <br />Staten Island
                  </h4>
                </figcaption>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Fragment>
);

export default withData(Home);
