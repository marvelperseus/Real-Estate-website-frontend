import React, { Children } from 'react';
import { observer } from 'mobx-react';
import debounce from 'debounce';
import { Router } from '../routes';
import ServerErrorMessage from '../sharedStyledComponents/ServerErrorMessage';
import { agent, admin, superAdmin } from '../constants/userTypes';
import LoginForm from '../components/forms/LoginForm';
import SignUpForm from '../components/forms/SignUpForm';

@observer
class SignUpLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorsFromServer: '',
    };
  }

  onSubmitFailure(errs, onSubmitError) {
    console.log(onSubmitError);
  }

  onSubmit = (values, event) => {
    const formSubmitFuncName =
      this.props.formType === 'sign-up' ? 'signUpCustomer' : 'loginUser';

    this.props[formSubmitFuncName](values)
      .then(res => {
        console.log(res);
        if (res.error) {
          this.setState({
            errorsFromServer: res.error,
          });
          return;
        }

        if (this.state.errorsFromServer) {
          this.setState({
            errorsFromServer: '',
          });
        }

        if (res.user) {
          console.log(res.user.role);
          if (res.user.role === agent) {
            Router.pushRoute('dashboard');
          } else if (res.user.role === admin || res.user.role === superAdmin) {
            Router.pushRoute('admin-dashboard');
          } else {
            Router.pushRoute('home');
          }
        } else {
          this.setState({
            errorsFromServer:
              "We're sorry, there was an error processing your request.",
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderServerErrorMessage = () => (
    <ServerErrorMessage>{`Error: ${
      this.state.errorsFromServer
    }`}</ServerErrorMessage>
  );

  render() {
    return (
      <div style={{ padding: '0 20px' }}>
        {this.state.errorsFromServer ? this.renderServerErrorMessage() : null}
        {this.props.formType === 'login' ? (
          <LoginForm
            {...this.props}
            onSubmit={this.onSubmit}
            onSubmitFailure={this.onSubmitFailure}
          />
        ) : (
          <SignUpForm
            {...this.props}
            onSubmit={this.onSubmit}
            onSubmitFailure={this.onSubmitFailure}
          />
        )}
      </div>
    );
  }
}

export default SignUpLoginForm;
