import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import { initStore } from '../models';
import withData from '../lib/withData';
import Footer from '../components/Footer';
import messageAgent from '../effects/users/messageAgent';

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
    this.state = {
      cfirst: '',
      ctopic: 'Account Support',
      cphone: '',
      csubject: '',
      cdescription: '',
      cmessage: '',
      lfirst: '',
      lemail: '',
      lphone: '',
      lsubject: '',
      ltype: 'Condo',
      ldescription: '',
      lmessage: '',
    };
    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  contactList = event => {
    event.preventDefault();
    const {
      lfirst,
      lemail,
      lphone,
      lsubject,
      ltype,
      ldescription,
    } = this.state;

    if (
      lfirst === '' ||
      lemail === '' ||
      lphone === '' ||
      lsubject === '' ||
      ldescription === ''
    ) {
      return this.setState({ lerror: 'All Fields Are Required' });
    }

    messageAgent({
      to: 'Admin@reyeselsamad.com',
      from: lemail,
      text: `Subject: ${lsubject}\nType: ${ltype}\nEmail: ${lemail}\nFrom: ${lfirst}\nPhone: ${lphone}\n\n\n${ldescription}`,
      subject: 'Listing Request',
    });

    this.setState({
      lmessage: 'Thank you, we will get in touch soon!',
      lerror: '',
    });
    setTimeout(() => {
      this.setState({ lmessage: '' });
    }, 5000);

    this.clearContactList();
  };

  contactSupport = event => {
    event.preventDefault();
    const { cfirst, ctopic, cphone, csubject, cdescription } = this.state;
    if (
      cfirst === '' ||
      cphone === '' ||
      csubject === '' ||
      cdescription === ''
    ) {
      return this.setState({ cerror: 'All Fields Are Required' });
    }
    messageAgent({
      to: 'Admin@reyeselsamad.com',
      from: 'contact@request.sup',
      text: `Topic: ${ctopic}\nSubject: ${csubject}\nFrom: ${cfirst}\nPhone: ${cphone}\n\n\n${cdescription}`,
      subject: 'Contact Request',
    });

    this.setState({
      cmessage: 'Thank you, we will get in touch soon!',
      cerror: '',
    });
    setTimeout(() => {
      this.setState({ cmessage: '' });
    }, 5000);

    this.clearContactSupport();
  };

  clearContactList = () => {
    this.setState({
      lfirst: '',
      lemail: '',
      lphone: '',
      lsubject: '',
      ltype: 'Condo',
      ldescription: '',
    });
  };

  clearContactSupport = () => {
    this.setState({
      cfirst: '',
      ctopic: 'Account Support',
      cphone: '',
      csubject: '',
      cdescription: '',
    });
  };

  componentDidMount() {
    const jQuery = window.jQuery;
    jQuery('.clickme a').click(function() {
      jQuery('.clickme a').removeClass('activelink');
      jQuery(this).addClass('activelink');
      var tagid = $(this).data('tag');
      jQuery('.list')
        .removeClass('active')
        .addClass('hide');
      jQuery('#' + tagid)
        .addClass('active')
        .removeClass('hide');
    });
  }

  render() {
    return (
      <Fragment>
        <Layout UserStore={this.store.UserStore}>
          <Head>
            <link href="/static/css/style.css" rel="stylesheet" />
          </Head>
          <section class="listing-banner contact-us">
            <div class="container">
              <div class="banner-text conatc">
                <h3>Contact Us</h3>
              </div>
              <div class="listing-downn text-center">
                <a href="#indicate">
                  <i class="fa fa-angle-down" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
          <section class="email-spourt">
            <div class="container">
              <ul>
                <li class="clickme">
                  <a
                    href="javascript:void(0)"
                    data-tag="one"
                    class="activelink"
                  >
                    <figure>
                      <img src="/static/img/email.png" />
                    </figure>
                    <figcaption>
                      <h4>Online Support</h4>
                      <p>Email us.</p>
                    </figcaption>
                  </a>
                </li>
                <li class="clickme">
                  <a href="javascript:void(0)" data-tag="two">
                    <figure>
                      <img src="/static/img/search-new.png" />
                    </figure>
                    <figcaption>
                      <h4>Ready to List?</h4>
                      <p>Easily Message Us.</p>
                    </figcaption>
                  </a>
                </li>
              </ul>
            </div>
          </section>
          <div style={{ clear: 'both' }} />
          <section class="job-apply for-contact list" id="one">
            <div class="container">
              <div class="jobinner">
                <h3>SUPPORT</h3>
                <form onSubmit={this.contactSupport}>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={this.state.cfirst}
                      onChange={this.handleChange('cfirst')}
                    />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Topic:</label>
                    <select
                      value={this.state.ctopic}
                      onChange={this.handleChange('ctopic')}
                    >
                      <option value="Account Support">Account Support</option>
                      <option value="General Support">General Support</option>
                      <option value="Log-in Support">Log-in Support</option>
                      <option value="Suggestions for System Improvement">
                        Suggestions for System Improvement
                      </option>
                      <option value="Press">Press</option>
                      <option value="Partnerships">Partnerships</option>
                    </select>
                  </div>

                  <div class="form-group col-sm-6 col-md-6">
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={this.state.cphone}
                      onChange={this.handleChange('cphone')}
                    />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Subject:</label>
                    <input
                      type="text"
                      value={this.state.csubject}
                      onChange={this.handleChange('csubject')}
                    />
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    <label>Please write a brief description</label>
                    <textarea
                      value={this.state.cdescription}
                      onChange={this.handleChange('cdescription')}
                    />
                  </div>
                  <div class="btn-text text-center">
                    <button>
                      {' '}
                      <i class="fa fa-paper-plane" aria-hidden="true" /> Submit
                    </button>
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    {this.state.cmessage}
                  </div>
                  <div
                    class="form-group col-sm-12 col-md-12 "
                    style={{ color: 'red' }}
                  >
                    {this.state.cerror}
                  </div>
                </form>
              </div>
            </div>
          </section>
          <section class="job-apply for-contact list hide" id="two">
            <div class="container">
              <div class="jobinner">
                <h3>Ready to Buy, Sell or Lease with us?</h3>
                <form onSubmit={this.contactList}>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={this.state.lfirst}
                      onChange={this.handleChange('lfirst')}
                    />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Email:</label>
                    <input
                      type="text"
                      value={this.state.lemail}
                      onChange={this.handleChange('lemail')}
                    />
                  </div>

                  <div class="form-group col-sm-6 col-md-6">
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={this.state.lphone}
                      onChange={this.handleChange('lphone')}
                    />
                  </div>
                  <div class="form-group col-sm-6 col-md-6">
                    <label>Subject:</label>
                    <input
                      type="text"
                      value={this.state.lsubject}
                      onChange={this.handleChange('lsubject')}
                    />
                  </div>
                  <div class="form-group col-sm-12 col-md-12">
                    <label>Type of Property:</label>
                    <select
                      value={this.state.ltype}
                      onChange={this.handleChange('ltype')}
                    >
                      <option value="Condo">Condo</option>
                      <option value="Cooperative">Cooperative </option>
                      <option value="Single-Family">Single-Family</option>
                      <option value="Multi-family">Multi-family</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Vacant">Vacant</option>
                      <option value="Land">Land</option>
                      <option value="Rental">Rental</option>
                    </select>
                  </div>
                  <div class="form-group col-sm-12 col-md-12">
                    <label>Please write a brief description</label>
                    <textarea
                      value={this.state.ldescription}
                      onChange={this.handleChange('ldescription')}
                    />
                  </div>
                  <div class="btn-text text-center">
                    <button>
                      {' '}
                      <i class="fa fa-paper-plane" aria-hidden="true" /> Submit
                    </button>
                  </div>
                  <div class="form-group col-sm-12 col-md-12 ">
                    {this.state.lmessage}
                  </div>
                  <div
                    class="form-group col-sm-12 col-md-12 "
                    style={{ color: 'red' }}
                  >
                    {this.state.lerror}
                  </div>
                </form>
              </div>
            </div>
          </section>
          <section class="looking-agent">
            <div class="container">
              <div class="agent-box">
                <div class="agent-inner">
                  <h3>Looking for an agent?</h3>
                  <p>
                    {' '}
                    Reyes & Elsamad agents are here to help with all your
                    buying, renting, and selling goals. Start navigating the
                    world of real estate with an expert you can trust.{' '}
                  </p>
                  <a href="/agents">Find a agent near you</a>
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
