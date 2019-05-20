import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import Footer from '../components/Footer';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

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
    this.state = { filename: '', message: '' };

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
    this.form = React.createRef();
  }

  submitForm = event => {
    event.preventDefault();
    const data = new FormData(this.form);
    if (
      data.get('first') === '' ||
      data.get('last') === '' ||
      data.get('email') === '' ||
      data.get('phone') === '' ||
      data.get('company') === ''
    )
      return this.setState({ error: 'All Fields Are Required' });
    axios
      .post(publicRuntimeConfig.CAREER_ENDPOINT, data)
      .then(() =>
        this.setState({
          message: 'Thank you, we will get in touch soon!',
          error: '',
        })
      );
  };

  onChangeFile = event => {
    const { attachment } = this.form;
    console.log(attachment.files[0].name);
    this.setState({ filename: attachment.files[0].name });
  };

  render() {
    return (
      <Fragment>
        <Head>
          <link href="/static/css/style.css" rel="stylesheet" />
        </Head>
        <Layout UserStore={this.store.UserStore}>
          <section class="careers">
            <h3>
              Jobs At<br />
              Reyes & Elsamad{' '}
            </h3>
          </section>
          <section class="join-sec">
            <div class="container">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <div class="join-left">
                  <figure>
                    <img src="/static/img/join-team.jpg" />
                  </figure>
                </div>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6">
                <div class="join-right">
                  <h3>Join the Team</h3>
                  <h5>
                    We’re an energetic group that focuses on all pillars of real
                    estate.
                  </h5>
                  <p>
                    From residential to commercial leasing and sales, we strive
                    to mentor all our agents and employees. If our agents are
                    receiving exceptional support, then they'll provide our
                    customers the best service possible.
                  </p>
                  <p>
                    We are a startup company with lofty goals! With our talented
                    group, all of us can achieve the same vision.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section class="job-apply">
            <div class="container">
              <div class="jobinner">
                <h3>Career Search</h3>
                <form ref={el => (this.form = el)} onSubmit={this.submitForm}>
                  <div class="form-group col-sm-12 col-md-12 ">
                    <label>Positions Available:</label>
                    <select name="available">
                      <option>Real Estate Salesperson</option>
                      <option>Real Estate Associate Broker</option>
                      <option>Commercial Leasing Associate</option>
                      <option>Commercial Sales Associate </option>
                    </select>
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>First Name:</label>
                    <input name="first" type="text" />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Last Name:</label>
                    <input name="last" type="text" />
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    <label>Email:</label>
                    <input name="email" type="text" />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Phone:</label>
                    <input name="phone" type="text" />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Current Company:</label>
                    <input name="company" type="text" />
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    <label>Resume:</label>
                    <input
                      type="text"
                      value={this.state.filename}
                      onChange={() => {}}
                      disabled="true"
                    />
                    <div class="browse-btn">
                      <input
                        type="file"
                        name="attachment"
                        class="custom-file-input"
                        onChange={this.onChangeFile}
                      />
                      <span>Browse...</span>
                    </div>
                    <p>Upload PDF files only please.</p>
                  </div>
                  <div class="btn-text text-center">
                    <button type="submit">
                      {' '}
                      <i class="fa fa-paper-plane" aria-hidden="true" /> Submit
                    </button>
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    {this.state.message}
                  </div>
                  <div class="form-group col-sm-12 col-md-12 " style={{color: 'red'}}>
                    {this.state.error}
                  </div>
                </form>
              </div>
            </div>
          </section>
          <section class="our-loc">
            <div class="container">
              <h3>Our Location</h3>
              <div class="thumb-loc">
                <div class="map-sec">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.738860886614!2d-73.92538048459538!3d40.70174857933296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25c1b5be475bf%3A0x37b24300cde8db62!2s307+Knickerbocker+Ave%2C+Brooklyn%2C+NY+11237%2C+USA!5e0!3m2!1sen!2sin!4v1552030662602"
                    width="100%"
                    height="200"
                    frameborder="0"
                    style={{ border: 0 }}
                    allowfullscreen
                  />
                </div>
                <div><br/></div>
                <div class="loca-detail">
                  <h3>Reyes & Elsamad</h3>
                  <p>
                    <i class="fa fa-map-marker" aria-hidden="true" /> 307
                    Knickerbocker Ave, Brooklyn, NY 11237
                  </p>
                  <p>
                    <i class="fa fa-clock-o" aria-hidden="true" /> 10am to 6pm
                    (Monday to Friday Only)
                  </p>
                </div>
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
