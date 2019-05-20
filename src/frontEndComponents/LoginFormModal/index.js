import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Input, Modal, Button } from 'antd';
import Grid from 'material-ui/Grid';
import classnames from 'classnames';
import debounce from 'debounce';
import { darken, lighten } from 'polished';
import { withStyles } from 'material-ui/styles';
import ReCAPTCHA from 'react-google-recaptcha';
import { Router } from '../../routes';
import { agent, admin, superAdmin } from '../../constants/userTypes';
import ServerErrorMessage from '../../sharedStyledComponents/ServerErrorMessage';
import recaptchaSiteKey from '../../constants/recaptchaSiteKey';
import '../../static/css/login-sign-up-modals.css';
import { isProd } from '../../constants/config';

const FormItem = Form.Item;

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: '100%',
    marginBottom: '50px',
    //fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    fontSize: '2.8rem',
    color: '#fff',
    backgroundColor: 'black',
  },
  formWrapper: {
    padding: '20px 20px',
  },
  applicationTypeBtnsWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  activePrimaryToggleBtn: {
    backgroundColor: '#1890ff !important',
    borderColor: '#1890ff !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
      color: '#fff',
    },
  },
  verticalModalWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .ant-modal': {
      top: 0,
    },
  },
  forgotPassword: {
    marginLeft: 'auto',
    color: lighten(0.1, '#16b'),
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color .2s ease-in-out',
    outline: 'none',
    '&:hover': {
      color: darken(0.05, '#16b'),
      transition: 'color .3s ease-in-out',
    },
  },
  forgotPasswordWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 5,
  },
  submitBtnWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 42,
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: '0',
    paddingRight: '0',
    fontSize: '1rem',
    backgroundColor: '#272A2E !important',
    borderColor: '#272A2E !important',
    borderRadius: '3px',
    color: '#fff !important',
    transition: 'background-color .2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: `${lighten(0.1, '#272A2E')} !important`,
      borderColor: `${lighten(0.1, '#272A2E')} !important`,
    },
  },
  btnLoading: {
    opacity: '.7',
    pointerEvents: 'none',
  },
  formSubmittingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  recaptchaWrapper: {
    '& div div': {
      display: 'flex',
      justifyContent: 'center',
    },
  },
});

@withStyles(styles)
@observer
class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = debounce(this.handleSubmit, 300);
  }

  formSubmitted = false;

  state = {
    errorsFromServer: '',
    submittingFormToServer: false,
    formSuccessfullySubmitted: false,
    loadingNextPage: false,
    isForgotPasswordType: false,
    passwordSuccessfullyReset: false,
    formValues: null,
    captchaCompleted: !isProd,
  };

  componentDidMount = () => {
    this.props.getFormApi(this.props.form);
  };

  resetState = () => {
    this.setState({
      errorsFromServer: '',
      submittingFormToServer: false,
      formSuccessfullySubmitted: false,
      loadingNextPage: false,
      isForgotPasswordType: false,
      passwordSuccessfullyReset: false,
      formValues: null,
      captchaCompleted: false,
    });
  };

  renderServerErrorMessage = () => (
    <ServerErrorMessage>{`${this.state.errorsFromServer}`}</ServerErrorMessage>
  );

  toggleSubmittingFormToServer = (
    bool = !this.state.submittingFormToServer,
    options
  ) => {
    this.setState({
      submittingFormToServer: bool,
      loadingNextPage:
        options && options.loadingNextPage ? true : this.state.loadingNextPage,
    });
  };

  toggleIsForgotPasswordType = () => {
    if (
      this.state.errorsFromServer ===
      "Please complete the captcha to ensure that you're not a robot."
    ) {
      this.setState({
        errorsFromServer: '',
        isForgotPasswordType: !this.state.isForgotPasswordType,
        captchaCompleted: false,
      });
    } else {
      this.setState({
        isForgotPasswordType: !this.state.isForgotPasswordType,
        captchaCompleted: false,
      });
    }
  };

  closeLoginModal = () => {
    this.props.closeLoginModal();
    this.setState({
      isForgotPasswordType: false,
      formValues: null,
    });
    if (this._Recaptcha) {
      this._Recaptcha.reset();
    }
  };

  handleValidate = e => {
    if (e && e.preventDefault) e.preventDefault();
    this.formSubmitted = true;

    if (!this.state.captchaCompleted) {
      this.setState({
        errorsFromServer:
          "Please complete the captcha to ensure that you're not a robot.",
      });
      return;
    }
    if (
      this.state.errorsFromServer ===
      "Please complete the captcha to ensure that you're not a robot."
    ) {
      this.setState({
        errorsFromServer: '',
      });
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isForgotPasswordType) {
          this.handleSubmitForgotPassword(values);
        } else {
          this.handleSubmitLogin(values);
        }
      }
    });
  };

  handleSubmitLogin = values => {
    this.toggleSubmittingFormToServer(true);
    this.props
      .loginUser(values)
      .then(res => {
        let hasErrors;
        if (res.error) {
          this.setState({
            errorsFromServer:
              typeof res.error === 'string' ? res.error : res.error.message,
          });
          hasErrors = true;
        }

        if (this.state.errorsFromServer && !hasErrors) {
          this.setState({
            errorsFromServer: '',
          });
        }

        if (hasErrors) {
          this.toggleSubmittingFormToServer(false);
          return;
        }

        const canAccessBackend = [agent, admin, superAdmin].includes(
          res.user.role
        );

        if (canAccessBackend) {
          this.toggleSubmittingFormToServer(false, { loadingNextPage: true });
        } else {
          this.toggleSubmittingFormToServer(false);
        }

        console.log(Router.pathname);

        if (res.user) {
          this.setState({
            formSuccessfullySubmitted: true,
          });

          console.log(res.user.role);
          if (res.user.role === agent) {
            Router.pushRoute('dashboard');
          } else if (res.user.role === admin || res.user.role === superAdmin) {
            Router.pushRoute('admin-dashboard');
          } else if (Router.pathname === '/forgot-password') {
            Router.pushRoute('/');
          } else {
            this.closeLoginModal();
          }
        } else {
          this.setState({
            errorsFromServer:
              "We're sorry, there was an error processing your request.",
          });
        }
      })
      .catch(err => {
        this.toggleSubmittingFormToServer(false);
        console.log(err);
      });
  };

  handleSubmitForgotPassword = values => {
    this.toggleSubmittingFormToServer(true);
    this.props
      .userForgotPassword(values.email)
      .then(res => {
        console.log(res);
        this.toggleSubmittingFormToServer(false);
        let hasErrors;
        if (res.error) {
          this.setState({
            errorsFromServer:
              typeof res.error === 'string' ? res.error : res.error.message,
          });
          hasErrors = true;
          return;
        }

        if (this.state.errorsFromServer) {
          this.setState({
            errorsFromServer: '',
          });
        }

        if (!hasErrors) {
          this.setState({
            formSuccessfullySubmitted: true,
            passwordSuccessfullyReset: true,
          });
        }
      })
      .catch(err => {
        this.toggleSubmittingFormToServer(false);
        console.log(err);
      });
  };

  render() {
    const { classes, loginModalOpen } = this.props;
    const {
      formSuccessfullySubmitted,
      isForgotPasswordType,
      submittingFormToServer,
      loadingNextPage,
      passwordSuccessfullyReset,
    } = this.state;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;

    const emailError =
      (isFieldTouched('email') || this.formSubmitted) && getFieldError('email');

    const passwordError =
      (isFieldTouched('password') || this.formSubmitted) &&
      getFieldError('password');

    return (
      <Modal
        title={this.state.isForgotPasswordType ? 'Forgot Password' : 'Log In'}
        visible={loginModalOpen}
        onCancel={this.closeLoginModal}
        wrapClassName={classnames(classes.verticalModalWrapper, 'login-modal')}
        footer={null}
        destroyOnClose
        closable={!submittingFormToServer && !loadingNextPage}
        maskClosable={!submittingFormToServer && !loadingNextPage}
        afterClose={() => this.resetState()}
      >
        {this.state.errorsFromServer ? this.renderServerErrorMessage() : null}

        <div
          style={{
            display:
              submittingFormToServer ||
              loadingNextPage ||
              passwordSuccessfullyReset
                ? 'none'
                : undefined,
          }}
        >
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            {!isForgotPasswordType && (
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <FormItem
                    validateStatus={emailError ? 'error' : ''}
                    help={emailError || ''}
                  >
                    {getFieldDecorator('email', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your email address!',
                        },
                      ],
                    })(
                      <Input
                        type="email"
                        id="email1"
                        required
                        size="large"
                        disabled={formSuccessfullySubmitted}
                        prefix={
                          <Icon
                            type="mail"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder="Email"
                      />
                    )}
                  </FormItem>
                </Grid>

                <Grid item xs={12}>
                  <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                      ],
                    })(
                      <Input
                        type="password"
                        size="large"
                        required
                        disabled={formSuccessfullySubmitted}
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder="Password"
                      />
                    )}
                  </FormItem>
                </Grid>
              </Grid>
            )}

            {isForgotPasswordType && (
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <FormItem
                    validateStatus={emailError ? 'error' : ''}
                    help={emailError || ''}
                  >
                    {getFieldDecorator('email', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your email address!',
                        },
                      ],
                    })(
                      <Input
                        type="email"
                        required
                        size="large"
                        disabled={formSuccessfullySubmitted}
                        prefix={
                          <Icon
                            type="mail"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder="Email"
                      />
                    )}
                  </FormItem>
                </Grid>
              </Grid>
            )}
          </Form>

          {!this.state.isForgotPasswordType &&
            isProd && (
              <div className={classes.recaptchaWrapper}>
                <ReCAPTCHA
                  ref={ref => (this._Recaptcha = ref)}
                  sitekey={recaptchaSiteKey}
                  onChange={val => {
                    if (!val) {
                      this.setState({
                        captchaCompleted: false,
                      });
                    } else if (
                      this.state.errorsFromServer ===
                      "Please complete the captcha to ensure that you're not a robot."
                    ) {
                      this.setState({
                        errorsFromServer: '',
                        captchaCompleted: true,
                      });
                    } else {
                      this.setState({
                        captchaCompleted: true,
                      });
                    }
                  }}
                />
              </div>
            )}

          {this.state.isForgotPasswordType &&
            isProd && (
              <div className={classes.recaptchaWrapper}>
                <ReCAPTCHA
                  ref={ref => (this._Recaptcha = ref)}
                  sitekey={recaptchaSiteKey}
                  onChange={val => {
                    if (!val) {
                      this.setState({
                        captchaCompleted: false,
                      });
                    } else if (
                      this.state.errorsFromServer ===
                      "Please complete the captcha to ensure that you're not a robot."
                    ) {
                      this.setState({
                        errorsFromServer: '',
                        captchaCompleted: true,
                      });
                    } else {
                      this.setState({
                        captchaCompleted: true,
                      });
                    }
                  }}
                />
              </div>
            )}

          <Button
            onClick={this.handleValidate}
            disabled={formSuccessfullySubmitted || submittingFormToServer}
            className={classnames(
              classes.submitBtnWrapper,
              submittingFormToServer && classes.btnLoading
            )}
            type="primary"
          >
            <span>
              {this.state.submittingFormToServer && (
                <Icon
                  type="loading"
                  style={{ marginRight: '10px', color: '#fff' }}
                />
              )}
              {isForgotPasswordType ? 'Reset Password' : 'Submit'}
            </span>
          </Button>

          {!formSuccessfullySubmitted &&
            !isForgotPasswordType && (
              <div className={classes.forgotPasswordWrapper}>
                <button
                  onClick={this.toggleIsForgotPasswordType}
                  className={classes.forgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
            )}

          {!formSuccessfullySubmitted &&
            isForgotPasswordType && (
              <div className={classes.forgotPasswordWrapper}>
                <button
                  onClick={this.toggleIsForgotPasswordType}
                  className={classes.forgotPassword}
                >
                  Log In?
                </button>
              </div>
            )}
        </div>

        {passwordSuccessfullyReset ? (
          <div className={classes.formSubmittingWrapper}>
            <div className={classes.progressBarExplanation}>
              Password reset email sent!
            </div>
          </div>
        ) : null}

        {submittingFormToServer || loadingNextPage ? (
          <div className={classes.formSubmittingWrapper}>
            <Icon
              type="loading"
              style={{ color: '#000', fontSize: '4rem', paddingBottom: '10px' }}
            />
            <div className={classes.progressBarExplanation}>
              {loadingNextPage ? 'Loading Page...' : 'Finishing submission...'}
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default Form.create()(LoginModal);
