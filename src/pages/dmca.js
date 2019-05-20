import { Component } from 'react';
import { initStore } from '../models';
import isBrowser from 'is-browser';
import TermsPage from '../components/TermsPage';

export default class Dmca extends Component {
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
      <TermsPage title="DMCA Copyright Policy" UserStore={this.store.UserStore}>
        <h3>DMCA Copyright Policy </h3>
        <p>
          Reyes & Elsamad Real Estate Group, LTD respects the intellectual property
          rights of others and has adopted the following general policy toward
          copyright infringement in accordance with the Digital Millennium Copyright
          Act. The email address of the Designated Agent to Receive Notification of
          Claimed Infringement ("Designated Agent") is listed at the end of this
          policy. In the subject line please write “Copyright Infringement”.{' '}
        </p>
        <h5>Procedure for Reporting Copyright Infringement:</h5>
        <p>
          If you believe that material or content residing on or accessible through
          Reyes & Elsamad Real Estate Groups websites or services infringes a
          copyright, please send an email of copyright infringement containing the
          following information to the Designated Agent listed below:
        </p>
        <ul>
          <li>
            Identification of the copyrighted work(s) or material(s) being
            infringed;
          </li>
          <li>
            A physical or electronic signature of a person authorized to act on
            behalf of the owner of the copyright that has been allegedly infringed
          </li>
          <li>
            A statement made under penalty of perjury that the information provided
            is accurate and the notifying party is authorized to make the complaint
            on behalf of the copyright owner.
          </li>
        </ul>
        <p>
          Please contact the Designated Agent for Reyes & Elsamad at <a href="mailto:admin@reyeselsamad.com">
            admin@reyeselsamad.com
          </a>
        </p>
      </TermsPage>
    );
  }
}
