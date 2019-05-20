import React, { Component } from 'react';
import { observer } from 'mobx-react';
import EditAdminPasswordForm from '../components/forms/EditAgentPasswordForm';
import editAdminPassword from '../effects/users/editAdminPassword';

@observer
class EditAdminPasswordFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitedSuccessfully: false,
    };
  }

  onSubmit = (values, e, formApi) => {
    this.props.setFormSubmitted();
    this.props.toggleSubmittingRequestToServer(true);

    const returnValues = {
      uuid: this.props.viewingAdminUUID,
      newPassword: values.password,
    };

    editAdminPassword(returnValues)
      .then(res => {
        this.props.setFormSubmitted(false);
        this.props.toggleSubmittingRequestToServer(false);
        if (res.error) {
          this.props.openRequestErrorSnackbar(res.error);
          return;
        }

        this.props.formSubmittedSuccessfully();
      })
      .catch(err => {
        this.props.toggleSubmittingRequestToServer(false);
        this.props.setFormSubmitted(false);
        this.props.openRequestErrorSnackbar();
      });
  };

  onSubmitFailure = (errs, onSubmitError) => {
    console.log(errs);
    console.log(onSubmitError);
    this.props.setFormSubmitted(false);
  };

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <EditAdminPasswordForm
          onSubmit={this.onSubmit}
          onSubmitFailure={this.onSubmitFailure}
          formSubmitedSuccessfully={this.state.formSubmitedSuccessfully}
          getFormApi={this.props.getFormApi}
          submittingFormToServer={this.props.submittingRequestToServer}
          {...rest}
        />
      </div>
    );
  }
}

export default EditAdminPasswordFormContainer;
