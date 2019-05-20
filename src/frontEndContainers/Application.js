import React from 'react';
import { observer } from 'mobx-react';
import Chance from 'chance';
import Application from '../frontEndComponents/Application';

const chance = new Chance();

const createFakeAgents = num => {
  const agents = [];

  for (let i = 0; i < num; i++) {
    agents.push(chance.name());
  }

  return agents;
};

@observer
class ApplicationContainer extends React.Component {
  state = {
    listingAgents: createFakeAgents(30),
    formValues: null,
    isFullApplication: true,
    paymentFormSubmitInProgress: false,
    paymentModalVisible: false,
    cardElementComplete: false,
  };

  paymentFormApi = null;

  onSubmitApplication = formValues => {
    this.setState({
      formValues,
      paymentModalVisible: true,
    });
  };

  onSubmitPaymentForm = e => {
    if (e.preventDefault) e.preventDefault();

    this.paymentFormApi.validateFields(async (err, values) => {
      if (!this.state.cardElementComplete) return;
      if (this.state.paymentFormSubmitInProgress) return;

      if (!err) {
        this.setState({ paymentFormSubmitInProgress: true });

        console.log(values);

        const {
          applicantCountry,
          cardOwnerName,
          paymentAddress,
          paymentAddressCity,
          paymentAddressState,
        } = values;

        console.log(this.state.formValues);

        const stripeToken = await this.props.stripe.createToken({
          name: cardOwnerName,
          address_line1: paymentAddress,
          address_city: paymentAddressCity,
          address_state: paymentAddressState,
          address_country: applicantCountry,
        });

        console.log(stripeToken);
      }
    });
  };

  setFullApplication = () => {
    if (!this.state.isFullApplication) {
      this.setState({ isFullApplication: true });
    }
  };

  setCreditCheckApplication = () => {
    if (this.state.isFullApplication) {
      this.setState({ isFullApplication: false });
    }
  };

  handleClosePaymentModal = () => {
    this.setState({
      paymentModalVisible: false,
    });
  };

  cardElementOnChange = ({ complete }) => {
    this.setState({
      cardElementComplete: complete,
    });
  };

  getPaymentFormApi = paymentFormApi => {
    this.paymentFormApi = paymentFormApi;
  };

  render() {
    const { listingID, listingAgents, submit } = this.props;
    return (
      <Application
        listingAgents={this.state.listingAgents}
        onSubmit={this.onSubmitApplication}
        onSubmitPaymentForm={this.onSubmitPaymentForm}
        isFullApplication={this.state.isFullApplication}
        setFullApplication={this.setFullApplication}
        setCreditCheckApplication={this.setCreditCheckApplication}
        paymentFormSubmitInProgress={this.state.paymentFormSubmitInProgress}
        paymentModalVisible={this.state.paymentModalVisible}
        cardElementOnChange={this.cardElementOnChange}
        cardElementComplete={this.state.cardElementComplete}
        handleClosePaymentModal={this.handleClosePaymentModal}
        getPaymentFormApi={this.getPaymentFormApi}
      />
    );
  }
}

export default ApplicationContainer;
