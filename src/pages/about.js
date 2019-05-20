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
          <section class="listing-banner abou-us">
            <div class="container">
              <div class="banner-text">
                <h3>
                  ABOUT <br />REYES & ELSAMAD
                </h3>
              </div>
              <div class="listing-downn text-center">
                <a href="#indicate">
                  <i class="fa fa-angle-down" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
          <section class="about-inner" id="indicate">
            <div class="container">
              <div class="text-canetr">
                <h2>A peek into our culture</h2>
                <p>
                  Reyes & Elsamad Real Estate Group has embarked on a clear and
                  passionate mission. We are people oriented. We are detailed
                  oriented. We are focused on having happy customers from the
                  beginning to the very end of each transaction. Our talented
                  group will help our clients find their next hidden gem.
                </p>
              </div>
              <div class="about-detail">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <figure>
                    <img src="/static/img/phone.jpg" />
                  </figure>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <div class="right-side">
                    <figcaption>
                      <h3>Your Family of Committed Agents</h3>
                      <p>
                        With our out-of-the-box thinking, technology and
                        resources, this will complement one commitment; to
                        provide you with the best service possible.
                      </p>
                      <a href="/agents">Work With Our Family</a>
                    </figcaption>
                  </div>
                </div>
              </div>
              <div class="about-detail">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <div class="right-side">
                    <figcaption>
                      <h3>
                        Startup on<br /> a Mission
                      </h3>

                      <p>
                        Our leadership has a combined industry experience of 6
                        years plus and during that period we realized that there
                        are many tools and resources lacking for so many Agents.
                        We opened doors in the summer of 2018, working
                        effectively and making baby steps towards our goal. We
                        are young, hungry and investing our hearts into our
                        culture and technology.{' '}
                        <a href="/careers">Search for Careers</a>
                      </p>
                    </figcaption>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <figure>
                    <img src="/static/img/mission.jpg" />
                  </figure>
                </div>
              </div>
            </div>
          </section>
          <section class="management-team">
            <div class="container">
              <h3>Management Team</h3>
              <ul>
                <li>
                  <figure>
                    <a href="/our-team">
                      <img src="/static/img/our-team1.png" />
                    </a>
                  </figure>
                  <figcaption>
                    <h4>JULIO REYES</h4>
                  </figcaption>
                </li>
                <li>
                  <figure>
                    <a href="/our-team">
                      <img  src="/static/img/npicture.jpg" />
                    </a>
                  </figure>
                  <figcaption>
                    <h4>SAMER ELSAMAD</h4>
                  </figcaption>
                </li>
              </ul>
            </div>
          </section>
          <section class="video" style={{display: 'none'}}>
            <div class="container">
              <div class="vedio-sec">
                <a class="video-trigger" href="javascript:void(0)">
                  <img src="/static/img/vedio.png" />
                </a>
                <a class="play-vedio video-trigger" href="javascript:void(0)">
                  <img src="/static/img/play-vedio.png" />
                </a>
                <iframe id="videoPlayer" class="hide" src="" />
              </div>
            </div>
          </section>
          <Footer />
        </Layout>
      </Fragment>
    );
  }
}

export default withData(About);
