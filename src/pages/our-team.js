import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import Footer from '../components/Footer';

@observer
class About extends React.Component {
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
          <section class="listing-banner abou-us out-team">
            <div class="container">
              <div class="banner-text">
                <h3>Our Management Team</h3>
              </div>
              <div class="listing-downn text-center">
                <a href="#indicate">
                  <i class="fa fa-angle-down" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <section class="allon-sec">
            <div class="container">
              <div class="allon-inner">
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <figure>
                    <img src="/static/img/our-team1.png" />
                  </figure>
                </div>
                <div class="col-xs-12 col-sm-8 col-md-8">
                  <figcaption>
                    <h3>JULIO REYES</h3>
                    <ul class="">
                      <li>
                        <a href="https://www.instagram.com/Julioreyesre/">
                          <i class="fa fa-instagram" aria-hidden="true" />
                        </a>
                      </li>
                    </ul>
                    <h4>Co-Founder | Principal Broker</h4>
                    <p>
                      Julio was inspired to enter the world of real estate a few years ago as the market started changing. Coming from 9 years in the aviation industry, he felt it was time to part ways. Now he focuses on his new passion which is to ultimately provide the best service a real estate brokerage can. Previous corporate experience and managing large teams of 300 +, Julio has applied his knowledge and success to this new venture. Pioneering this startup, he feels that this product will shake the real estate market with new tech, exceptional service and a friendly smile.

                    </p>
                  </figcaption>
                </div>
              </div>
              <div class="allon-inner">
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <figure>
                    <img src="/static/img/npicture.jpg" />
                  </figure>
                </div>
                <div class="col-xs-12 col-sm-8 col-md-8">
                  <figcaption>
                    <h3>SAMER ELSAMAD</h3>
                    <h4>Co-Founder</h4>
                    <p>
                    Samer grew up with a real estate focused family in Lebanon. Never the less, this is not what he focused on as a young entrepreneur. He wanted to do something different in his early career and that’s exactly what he did as he owned various merchandise retail stores through New York City. During this period, he also worked as a financial advisor for a couple of large investment firms. Samer fell into real estate as he grew more in love the changing markets in NYC. And guess what; he hasn’t looked back since.

                    </p>
                  </figcaption>
                </div>
              </div>
            </div>
          </section>
          <section class="out-thumb">
            <div class="container">
              <a href="/agents">Search our family of agents</a>
            </div>
          </section>
          <Footer />
        </Layout>
      </Fragment>
    );
  }
}

export default withData(About);
