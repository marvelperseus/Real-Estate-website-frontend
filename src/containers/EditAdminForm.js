import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BounceLoader } from 'react-spinners';
import updateAdmin from '../effects/users/updateAdmin';
import CreateAdminForm from '../components/forms/CreateAdminForm';
import { capitalize } from '../utils/stringUtils';

const Loader = BounceLoader;

export const adminQuery = gql`
  query admin($uuid: String!) {
    admin(uuid: $uuid) {
      firstName
      lastName
      email
      role
      admin {
        branch
        state
        mobileNumber
        officeNumber
      }
    }
  }
`;

@observer
class EditAdminContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitedSuccessfully: false,
    };
  }

  onSubmit = (values, e, formApi) => {
    const returnValues = {
      ...values,
      firstName: capitalize(values.firstName),
      lastName: capitalize(values.lastName),
      uuid: this.props.viewingAdminUUID,
    };

    delete returnValues.profilePicture;

    this.props.setFormSubmitted();

    updateAdmin(returnValues).then(result => {
      const { userErrors, otherError, admin } = result;

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
        return;
      } else if (otherError) {
        this.props.openRequestErrorSnackbar(otherError);
        this.props.setFormSubmitted(false);
        return;
      } else if (!admin) {
        this.props.openRequestErrorSnackbar(
          'An server error occorred while updating the agent.'
        );
        this.props.setFormSubmitted(false);
        return;
      }

      this.props.setFormSubmitted(false);
      this.props.confirmAdminEdited(admin);
    });
  };

  onSubmitFailure(errs, onSubmitError) {
    console.log(errs);
    console.log(onSubmitError);
  }

  render() {
    const { classes, viewingAdminUUID, ...rest } = this.props;
    return (
      <Query
        query={adminQuery}
        variables={{ uuid: viewingAdminUUID }}
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

          const submittedAdmin = data.admin;

          return (
            <div style={{ width: '100%' }}>
              <CreateAdminForm
                isViewType
                onSubmit={this.onSubmit}
                onSubmitFailure={this.onSubmitFailure}
                formSubmitedSuccessfully={this.state.formSubmitedSuccessfully}
                submittedAdmin={submittedAdmin}
                getFormApi={this.props.getFormApi}
                submittingFormToServer={this.props.submittingRequestToServer}
                {...rest}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default EditAdminContainer;
