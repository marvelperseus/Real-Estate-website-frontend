import { Component } from 'react';
import { initStore } from '../models';
import isBrowser from 'is-browser';
import TermsPage from '../components/TermsPage';

export default class Fair extends Component {
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
      <div className="fairHousing">
      <TermsPage title="FAIR HOUSING" UserStore={this.store.UserStore}>
        <h3>FAIR HOUSING </h3>
        <h5>Our associate brokers, salespersons, employees and contractors:</h5>
        <ul>
          <li>
            We proactively maintain ourselves informed about fair housing laws
            and practices.
          </li>
          <li>
            We inform our clients and customers about their rights and
            responsibilities under the fair housing laws.
          </li>
          <li>Will not tolerate non-compliance of the fair housing law.</li>
          <li>
            Encourage and support an affirmative advertising and marketing
            program in which there are no barriers in obtaining housing.
          </li>
          <li>
            Respect the diversity inside and outside our organization, thus
            providing exceptional service to all groups of life.
          </li>
          <li>
            Committed to continue in the development and implementation of fair
            housing practices in accordance with our leadership role in the real
            estate profession.
          </li>
          <li>
            Maintain a high level of service by documenting our efforts, so that
            our whole company can be updated and be periodically informed.
          </li>
        </ul>
      </TermsPage>
      </div>
    );
  }
}
