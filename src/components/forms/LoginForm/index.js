import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'react-form';
import * as emailValidator from 'email-validator';
import { Router } from '../../../routes';
import CustomTextFieldWrapper from '../../CustomTextFieldWrapper';
import FormWrapper from '../../../sharedStyledComponents/FormWrapper';
import PrimaryButton from '../../../sharedStyledComponents/PrimaryButton';
import LoginSignUpFormTitle from '../../../sharedStyledComponents/LoginSignUpFormTitle';
import ServerErrorMessage from '../../../sharedStyledComponents/ServerErrorMessage';

const CustomTextField = CustomTextFieldWrapper;

@observer
class LoginForm extends React.Component {
  onSubmitFailure(errs, onSubmitError) {
    console.log(onSubmitError);
  }

  onSubmit = async (values, event) => {
    const { email, password } = values;
    let res;

    try {
      res = await this.props.loginUser({ email, password });
    } catch (err) {
      console.log(err);
    }

    if (res.error) {
      this.setState({
        ...this.state,
        errorsFromServer: res.error,
      });
      return;
    }
    if (this.state.errorsFromServer) {
      this.setState({
        ...this.state,
        errorsFromServer: '',
      });
    }

    Router.pushRoute('home');
  };

  preValidate = (values, formApi) => {
    Object.keys(values).forEach(property => {
      const val = values[property];
      if (typeof val === 'string' && property !== 'password') {
        values[property] = val.trim();
      }
    });
    return values;
  };

  errorValidator = values => ({
    email:
      !values.email || !emailValidator.validate(values.email)
        ? 'Please provide a valid email address'
        : null,
    password:
      !values.password ||
        values.password.length < 6 ||
        values.password.length > 20
        ? 'Your password must be between 6 and 20 characters long'
        : null,
  });

  renderServerErrorMessage = () => (
    <ServerErrorMessage>{`Error: ${
      this.state.errorsFromServer
      }`}</ServerErrorMessage>
  );

  render() {
    return (
      <FormWrapper>
        <LoginSignUpFormTitle>Login</LoginSignUpFormTitle>
        <Form
          preValidate={this.preValidate}
          onSubmit={this.props.onSubmit}
          onSubmitFailure={this.props.onSubmitFailure}
          validate={this.errorValidator}
        >
          {formApi => (
            <form onSubmit={formApi.submitForm} id="form1">
              <CustomTextField
                type="email"
                field="email"
                id="email"
                placeholder="Email"
              />
              <CustomTextField
                type="password"
                field="password"
                id="password"
                placeholder="Password"
              />
              <PrimaryButton type="submit" width={100}>Submit</PrimaryButton>
            </form>
          )}
        </Form>
      </FormWrapper>
    );
  }
}

export default LoginForm;
