import React, { Component } from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BounceLoader } from 'react-spinners';
import CreateAgentForm from '../components/forms/CreateAgentForm';
import { round } from '../utils/Math';
import updateAgent from '../effects/users/updateAgent';

const Loader = BounceLoader;

export const agentQuery = gql`
  query agent($uuid: String!) {
    agent(uuid: $uuid) {
      firstName
      lastName
      email
      role
      agent {
        profilePicURL
        branch
        state
        mobileNumber
        officeNumber
        areaOfFocus
        realEstateLicenseNumber
        agentType
        ACHAccountNumber
        ACHAccountBankRoutingNumber
        title
        facebook
        instagram
        twitter
        profileDescription
        speciality
        education
      }
    }
  }
`;

@observer
class CreateAgentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitedSuccessfully: false,
    };
  }

  onSubmit = (values, e, formApi) => {
    const returnValues = {
      ...values,
      uuid: this.props.viewingAgentUUID,
    };
    console.log(values);
console.log("check the valu updates submission >>>>>>>>>>>");
    this.props.setFormSubmitted();
    this.props.toggleSubmittingRequestToServer(true);

    updateAgent(returnValues)
      .then(result => {
        const { userErrors, otherError, agent } = result;

        let hasErrors = false;

        if (userErrors.length) {
          userErrors.forEach(error => {
            console.log(error);
            if (error.field === 'email') {
              const formElement = document.getElementById('formDialog');
              formApi.setError(error.field, error.message);
              formElement.scrollTop = formElement.scrollHeight;
            }

            hasErrors = true;
          });

          this.props.setFormSubmitted(false);
          this.props.toggleSubmittingRequestToServer(false);
          return;
        } else if (otherError) {
          this.props.openRequestErrorSnackbar(otherError);
          this.props.setFormSubmitted(false);
          this.props.toggleSubmittingRequestToServer(false);
          return;
        } else if (!agent) {
          this.props.openRequestErrorSnackbar();
          this.props.setFormSubmitted(false);
          this.props.toggleSubmittingRequestToServer(false);
          return;
        }

        this.setState({ formSubmitedSuccessfully: true });

        this.props.setFormSubmitted(false);
        this.props.toggleSubmittingRequestToServer(false);
        this.props.editAgentFormSubmittedSuccessfully(agent);
      })
      .catch(err => {
        this.props.setFormSubmitted(false);
        this.props.toggleSubmittingRequestToServer(false);
        this.props.openRequestErrorSnackbar();
      });
  };

  onSubmitFailure = (errs, onSubmitError) => {
    console.log(errs);
    console.log(onSubmitError);
  };

  render() {
    const { classes, viewingAgentUUID, ...rest } = this.props;
    return (
      <Query
        query={agentQuery}
        variables={{ uuid: viewingAgentUUID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader color="#f44336" loading />
              </div>
            );
          // TODO: change the error message to a generic
          // 'error connecting to server' message
          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const submittedInvoice = data.agent;
console.log("check the opwned agents >>>>>>>>> ", data);
          return (
            <div style={{ width: '100%' }}>
              <CreateAgentForm
                submittedAgent={data.agent}
                isViewType
                onSubmit={this.onSubmit}
                onSubmitFailure={this.onSubmitFailure}
                formSubmitedSuccessfully={this.state.formSubmitedSuccessfully}
                isEditingAgent={this.props.isEditingAgent}
                currentUserRole={this.props.currentUserRole}
                getFormApi={this.props.getFormApi}
                submittingFormToServer={this.props.submittingRequestToServer}
                isManagement={data.agent.agent.agentType > 80 ? true : false}
                {...rest}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default CreateAgentContainer;
