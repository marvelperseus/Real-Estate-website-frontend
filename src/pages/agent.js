import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import isBrowser from 'is-browser';
import Layout from '../frontEndComponents/FrontEndLayout';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { initStore } from '../models';
import withData from '../lib/withData';
import AgentProfileContainer from '../frontEndContainers/AgentProfile';
import { Router } from '../routes';
import Footer from '../components/Footer';
import messageAgent from '../effects/users/messageAgent';

@observer
class Listing extends React.Component {
  static getInitialProps({ req, query }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
      agentID: query.id,
    };
  }

  constructor(props) {
    super(props);

    if (!props.agentID && isBrowser) Router.pushRoute('agents-front-end');

    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
    this.state = {
      name: '',
      email: '',
      phone: '',
      purpose: '',
      error: '',
    };

    this.modal = React.createRef();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = email => event => {
    event.preventDefault();

    const { name, phone, purpose } = this.state;
    if (
      this.state.email === '' ||
      name === '' ||
      phone === '' ||
      purpose === ''
    ) {
      return this.setState({ error: 'All Fields Are Required' });
    }
    this.setState({ error: '' });
    messageAgent({
      to: email,
      from: this.state.email,
      text: `Email: ${this.state.email}\nFrom: ${this.state.name}\nPhone: ${
        this.state.phone
      }`,
      subject: `${this.state.purpose} Request`,
    });
  };

  render() {
    const { agentID } = this.props;

    return (
      <Layout UserStore={this.store.UserStore}>
        <Head>
          <link href="static/css/style.css?v=1.7" rel="stylesheet" />
        </Head>
        <Query
          query={agentQuery}
          ssr={false}
          variables={{ uuid: agentID }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>error</p>;
            if (data) {
              return (
                <AgentProfileComponent
                  data={this.state}
                  agent={data.agent}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                />
              );
            }
          }}
        </Query>
      </Layout>
    );
  }
}

const agentQuery = gql`
  query agent($uuid: String!) {
    agent(uuid: $uuid) {
      uuid
      email
      lastName
      firstName
      agent {
        mobileNumber
        profilePicURL
        profileDescription
        facebook
        twitter
        instagram
        title
        branch
        speciality
        education
      }
    }
  }
`;

const listingsQuery = gql`
  query allListingsByAgentID($uuid: String!) {
    allListingsByAgentID(uuid: $uuid) {
      listingID
      address
      images
      offer
      borough
      neighborhood
      beds
      baths
      price
    }
  }
`;

class AgentProfileComponent extends React.Component {

  isFormValid = () => {
    const { email, name, phone, purpose } = this.props.data;
    return !(email === '' || name === '' || phone === '' || purpose === '');
  };

  render() {
    const { agent, handleChange, data, handleSubmit } = this.props;
    return (
      <Fragment>
        <section class="agent-inner1">
          <div class="container">
            <div class="col-xs-12 col-sm-4 col-md-3">
              <div class="agent-sidebar">
                <figure>
                  {agent.agent.profilePicURL ? (
                    <img src={agent.agent.profilePicURL} />
                  ) : (
                    <div
                      href={'/agent?id=' + agent.uuid}
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: 252,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        color: 'white',
                      }}
                    >
                      <span>No Profile Picture</span>
                    </div>
                  )}
                </figure>
                <figcaption>
                  <h4>Social Media</h4>
                  <ul>
                    {agent.agent.facebook && (
                      <li>
                        <a href={agent.agent.facebook}>
                          <i class="fa fa-facebook" aria-hidden="true" />
                        </a>
                      </li>
                    )}
                    {agent.agent.instagram && (
                      <li>
                        <a href={agent.agent.instagram}>
                          <i class="fa fa-instagram" aria-hidden="true" />{' '}
                        </a>
                      </li>
                    )}
                    {agent.agent.twitter && (
                      <li>
                        <a href={agent.agent.twitter}>
                          {' '}
                          <i class="fa fa-twitter" aria-hidden="true" />{' '}
                        </a>
                      </li>
                    )}
                  </ul>
                  <h4>Area of Focus</h4>
                  <p>{agent.agent.speciality}</p>
                  <h4>Education</h4>
                  <p>
                    {agent.agent.education}
                  </p>
                </figcaption>
              </div>
            </div>
            <div class="col-xs-12 col-sm-8 col-md-9">
              <div class="agent-content">
                <h3>
                  {agent.firstName} {agent.lastName}
                </h3>
                <h4>
                  {agent.agent.title} | {agent.agent.branch}
                </h4>
                <div class="detial-sec">
                  <a href="javaScript:void(0)">
                    <i class="fa fa-envelope" aria-hidden="true" />
                    {agent.email}
                  </a>
                  <a href="javaScript:void(0)">
                    <i class="fa fa-phone" aria-hidden="true" />{' '}
                    {agent.agent.mobileNumber}
                  </a>
                  <button
                    type="button"
                    class="btn btn-primary btn-lg"
                    data-toggle="modal"
                    data-target="#myModal"
                  >
                    Contact {agent.firstName}
                  </button>

                  <div
                    ref={el => (this.modal = el)}
                    class="modal fade"
                    id="myModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="myModalLabel"
                  >
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-body">
                          <h3>Contact Name</h3>
                          <form onSubmit={handleSubmit(agent.email)}>
                            <input
                              type="text"
                              value={data.name}
                              onChange={handleChange('name')}
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={data.email}
                              onChange={handleChange('email')}
                              placeholder="Email"
                            />
                            <input
                              type="text"
                              value={data.phone}
                              onChange={handleChange('phone')}
                              placeholder="Phone"
                            />
                            <select
                              value={data.purpose}
                              onChange={handleChange('purpose')}
                            >
                              <option value="">l’m looking to</option>
                              <option value="Buy">Buy</option>
                              <option value="Sell">Sell</option>
                              <option value="Rent">Rent</option>
                            </select>

                            <div class="button-sec">
                              {this.isFormValid() ? (
                                <button
                                  data-toggle="modal"
                                  data-target="#myModal"
                                  onClick={handleSubmit(agent.email)}
                                >
                                  {' '}
                                  Submit
                                </button>
                              ) : (
                                <button
                                  onClick={handleSubmit(agent.email)}
                                >
                                  {' '}
                                  Submit
                                </button>
                              )}
                            </div>
                            <span style={{ color: 'red' }}>{data.error}</span>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6>About {agent.firstName}</h6>
                <p>{agent.agent.profileDescription}</p>
              </div>
            </div>
          </div>
        </section>
        <Query
          query={listingsQuery}
          ssr={false}
          variables={{ uuid: agent.uuid }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>error</p>;
            if (data) {
              const listings = data.allListingsByAgentID.slice(0, 3);
              return (
                <section class="ability">
                  <div class="container">
                    <h3>
                      {agent.firstName} {agent.lastName}’s Listings
                    </h3>
                    <h4>.</h4>
                    {listings.map(listing => (
                      <div class="col-xs-12 col-sm-4 col-md-4">
                        <a href={'/listing-detail?id=' + listing.listingID}>
                          <div class="ability-inner">
                            <figure>
                              <img src={listing.images[0]} />
                            </figure>
                            <figcaption>
                              <div class="heart-sec">
                                <a href="#">
                                  <i class="fa fa-heart-o" aria-hidden="true" />
                                  <br />0
                                </a>
                              </div>
                              <h2>{listing.address}</h2>
                              <div class="rental">
                                <ul>
                                  <li>
                                    <a href="#">
                                      {listing.offer === 'RENT'
                                        ? 'Rentals'
                                        : 'Sell'}
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">|</a>
                                  </li>
                                  <li>
                                    <a href="#">{listing.borough}</a>
                                  </li>
                                </ul>
                                <p>
                                  <img src="/static/img/bed.png" />
                                  <span>{listing.beds} Bed</span>
                                </p>
                                <p>
                                  <img src="/static/img/beath.png" />
                                  <span>{listing.baths} bath</span>
                                </p>
                              </div>
                            </figcaption>
                            <div class="price">
                              <h6>${listing.price}</h6>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
          }}
        </Query>
        <Footer />
      </Fragment>
    );
  }
}

export default withData(Listing);
