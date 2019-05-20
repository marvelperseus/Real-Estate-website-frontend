import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Input, Modal, Button } from 'antd';
import Grid from 'material-ui/Grid';
import classnames from 'classnames';
import debounce from 'debounce';
import { darken, lighten } from 'polished';
import { withStyles } from 'material-ui/styles';
import ReCAPTCHA from 'react-google-recaptcha';
import { Portal } from 'react-portal';
import { Router, Link } from '../../routes';
import { agent, admin, superAdmin } from '../../constants/userTypes';
import ServerErrorMessage from '../../sharedStyledComponents/ServerErrorMessage';
import recaptchaSiteKey from '../../constants/recaptchaSiteKey';
import '../../static/css/login-sign-up-modals.css';

const FormItem = Form.Item;

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#f9fafa',
  },
  formWrapper: {
    padding: '40px',
    paddingTop: 20,
    backgroundColor: '#fff',
    maxWidth: 420,
    border: '1px solid #e6e6e6',
    overflow: 'auto',
  },
  titleSection: {
    padding: 10,
    paddingTop: 0,
    borderBottom: '1px solid #e8e8e8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    fontSize: '1.1rem',
    fontWeight: 800,
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
class ForgotPassword extends React.Component {
  formSubmitted = false;
  state = {
    errorsFromServer: '',
    submittingFormToServer: false,
    formSuccessfullySubmitted: false,
    loadingNextPage: false,
    isForgotPasswordType: false,
    passwordSuccessfullyReset: false,
    formValues: null,
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

  handleValidate = e => {
    if (e && e.preventDefault) e.preventDefault();
    this.formSubmitted = true;

    if (!this.state.captchaCompleted) {
      this.setState({
        errorsFromServer:
          "Please complete the captcha to ensure that you're not a robot.",
      });
      return;
    } else if (
      this.state.errorsFromServer ===
      "Please complete the captcha to ensure that you're not a robot."
    ) {
      this.setState({
        errorsFromServer: '',
      });
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmitForgotPassword(values);
      }
    });
  };

  handleSubmitForgotPassword = values => {
    this.toggleSubmittingFormToServer(true);
    this.props
      .resetPassword({
        forgotPasswordToken: this.props.forgotPasswordToken,
        password: values.password,
      })
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
    const { classes } = this.props;
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
      getFieldValue,
    } = this.props.form;

    const passwordError =
      (isFieldTouched('password') || this.formSubmitted) &&
      getFieldError('password');

    const passwordConfirmationError =
      (isFieldTouched('passwordConfirmation') || this.formSubmitted) &&
      getFieldError('passwordConfirmation');

    const validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      form.validateFields(['passwordConfirmation'], { force: true });
      if (!value || value.length < 8 || value.length > 30) {
        callback(
          'Please input your new password. Must be between 8 and 30 characters long!'
        );
      } else {
        callback();
      }
    };

    return (
      <div className={classes.root}>
        <div className={classes.formWrapper}>
          <div className={classes.titleSection}>Password Reset</div>
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
                      validateStatus={passwordError ? 'error' : ''}
                      help={passwordError || ''}
                    >
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message:
                              'Please input your new password. Must be between 8 and 30 characters long!',
                            min: 8,
                            max: 30,
                            whitespace: true,
                            validator: validateToNextPassword,
                          },
                        ],
                      })(
                        <Input
                          type="password"
                          required
                          size="large"
                          disabled={formSuccessfullySubmitted}
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          placeholder="New Password"
                        />
                      )}
                    </FormItem>
                  </Grid>

                  <Grid item xs={12}>
                    <FormItem
                      validateStatus={passwordConfirmationError ? 'error' : ''}
                      help={passwordConfirmationError || ''}
                    >
                      {getFieldDecorator('passwordConfirmation', {
                        rules: [
                          {
                            required: true,
                            message:
                              'Please confirm your password. Passwords must match!',
                            whitespace: true,
                            validator: (rule, value, callback) => {
                              if (!value || !value.trim()) {
                                callback(
                                  'Please confirm your password. Passwords must match!'
                                );
                              } else if (value !== getFieldValue('password')) {
                                callback(
                                  'Please confirm your password. Passwords must match!'
                                );
                              } else {
                                callback();
                              }
                            },
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
                          placeholder="Password Confirmation"
                        />
                      )}
                    </FormItem>
                  </Grid>
                </Grid>
              )}
            </Form>

            <div className={classes.recaptchaWrapper}>
              <ReCAPTCHA
                ref={ref => (this._Recaptcha = ref)}
                sitekey={recaptchaSiteKey}
                onChange={val => {
                  if (!val) {
                    this.setState({
                      captchaCompleted: false,
                    });
                  } else {
                    if (
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
                  }
                }}
              />
            </div>

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

            <div className={classes.forgotPasswordWrapper}>
              <Link route="/" prefetch>
                <a
                  onClick={this.toggleIsForgotPasswordType}
                  className={classes.forgotPassword}
                >
                  Cancel
                </a>
              </Link>
            </div>
          </div>

          {passwordSuccessfullyReset ? (
            <div className={classes.formSubmittingWrapper}>
              <div className={classes.progressBarExplanation}>
                Password reset!
              </div>
            </div>
          ) : null}

          {submittingFormToServer || loadingNextPage ? (
            <div className={classes.formSubmittingWrapper}>
              <Icon
                type="loading"
                style={{
                  color: '#000',
                  fontSize: '4rem',
                  paddingBottom: '10px',
                }}
              />
              <div className={classes.progressBarExplanation}>
                {loadingNextPage
                  ? 'Loading Page...'
                  : 'Finishing submission...'}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Form.create()(ForgotPassword);
