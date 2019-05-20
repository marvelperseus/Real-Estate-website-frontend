import React from 'react';
import { observer } from 'mobx-react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import {
  Form,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Icon,
  Input,
  Upload,
  Button,
  Divider,
  Select,
  Tabs,
} from 'antd';
import InputMask from 'react-input-mask';
import SignatureCanvas from 'react-signature-canvas';
import { states, countries } from '../../utils/constants';
import '../../static/css/property-application.css';

const { TabPane } = Tabs;

const { Option } = Select;

const styles = theme => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 1000,
  },
  datePicker: {
    width: '100%',
  },
  signatureCanvas: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,.1)',
    borderRadius: '5px',
    transition: 'border-color .2s ease-in-out',
  },
  setSignatureContainer: {
    width: '100%',
    height: 200,
  },
  setSignatureImg: {
    objectFit: 'contain',
    width: '100%',
    borderRadius: '5px',
  },
  uploadBtn: {
    width: '100% !important',
  },
  signatureBtnsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const FormItem = Form.Item;

const stateOptions = states.map(state => (
  <Option key={state} value={state}>
    {state}
  </Option>
));

const countriesOptions = countries.map(country => (
  <Option key={country} value={country}>
    {country}
  </Option>
));

const hasErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

@withStyles(styles)
@observer
class ApplicationForm extends React.Component {
  state = {
    signatureURL: '',
    signatureError: false,
  };

  formSubmitted = false;

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    const { onSubmit } = this.props;
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      this.formSubmitted = true;

      if (!this.state.signatureURL) {
        this.setState({
          signatureError: true,
        });
        return;
      }

      if (!err) {
        if (this.state.signatureError) {
          this.setState({
            signatureError: false,
          });
        }

        if (onSubmit) {
          onSubmit({
            ...values,
            signatureURL: this.state.signatureURL,
          });
        }
      }
    });
  };

  agentsOptions = this.props.listingAgents.map((agent, i) => (
    <Option key={i} value={agent}>
      {agent}
    </Option>
  ));

  render() {
    const { classes } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      getFieldValue,
      isFieldTouched,
    } = this.props.form;

    const firstNameError =
      (isFieldTouched('firstName') || this.formSubmitted) &&
      getFieldError('firstName');
    const lastNameError =
      (isFieldTouched('lastName') || this.formSubmitted) &&
      getFieldError('lastName');
    const emailError =
      (isFieldTouched('email') || this.formSubmitted) && getFieldError('email');
    const phoneNumberError =
      (isFieldTouched('phoneNumber') || this.formSubmitted) &&
      getFieldError('phoneNumber');
    const dateOfBirthError =
      (isFieldTouched('dateOfBirth') || this.formSubmitted) &&
      getFieldError('dateOfBirth');
    const socialSecurityNumError =
      (isFieldTouched('socialSecurityNum') || this.formSubmitted) &&
      getFieldError('socialSecurityNum');
    const applicantStreetAddressError =
      (isFieldTouched('applicantStreetAddress') || this.formSubmitted) &&
      getFieldError('applicantStreetAddress');
    const applicantCityError =
      (isFieldTouched('applicantCity') || this.formSubmitted) &&
      getFieldError('applicantCity');
    const applicantStateError =
      (isFieldTouched('applicantState') || this.formSubmitted) &&
      getFieldError('applicantState');
    const applicantZipCodeError =
      (isFieldTouched('applicantZipCode') || this.formSubmitted) &&
      getFieldError('applicantZipCode');
    const applicantCountryError =
      (isFieldTouched('applicantCountry') || this.formSubmitted) &&
      getFieldError('applicantCountry');

    const agentError =
      (isFieldTouched('agent') || this.formSubmitted) && getFieldError('agent');

    return (
      <div className={classes.root}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Divider>Personal Information</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={firstNameError ? 'error' : ''}
                help={firstNameError || ''}
                label="First Name"
              >
                {getFieldDecorator('firstName', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please input your first name! (30 max xharachters)',
                      max: 30,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="First Name"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={lastNameError ? 'error' : ''}
                help={lastNameError || ''}
                label="Last Name"
              >
                {getFieldDecorator('lastName', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please input your last name! (30 max xharachters)',
                      max: 30,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Last Name"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={emailError ? 'error' : ''}
                help={emailError || ''}
                label="Email"
              >
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input your email!' },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    type="email"
                    placeholder="Email"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={phoneNumberError ? 'error' : ''}
                help={phoneNumberError || ''}
                label="Phone Number"
              >
                {getFieldDecorator('phoneNumber', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your 10-digit phone number!',
                      len: 14,
                    },
                  ],
                })(
                  <InputMask
                    mask="(999) 999-9999"
                    maskChar={null}
                    className="ant-input"
                    placeholder="Phone Number"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={dateOfBirthError ? 'error' : ''}
                help={dateOfBirthError || ''}
                label="Date of Birth"
              >
                {getFieldDecorator('dateOfBirth', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your date of birth!',
                    },
                  ],
                })(
                  <DatePicker
                    className={classes.datePicker}
                    disabledDate={date =>
                      date ? date.isAfter(moment().subtract(18, 'years')) : true
                    }
                    type="text"
                    placeholder="Date of Birth"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={socialSecurityNumError ? 'error' : ''}
                help={socialSecurityNumError || ''}
                label="SSN"
              >
                {getFieldDecorator('socialSecurityNum', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please input your 9-digit social security number!',
                      len: 11,
                    },
                  ],
                })(
                  <InputMask
                    mask="999-99-9999"
                    maskChar={null}
                    className="ant-input"
                    placeholder="SSN"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <FormItem
                validateStatus={agentError ? 'error' : ''}
                help={agentError || ''}
                label="My Agent"
              >
                {getFieldDecorator('agent', {
                  rules: [
                    {
                      required: true,
                      message: "Please input your agent's name!",
                    },
                  ],
                })(
                  <Select
                    autocomplete="off"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="My Agent"
                  >
                    {this.agentsOptions}
                  </Select>
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <Divider>Current Address</Divider>
            </Grid>
            <Grid item xs={12}>
              <FormItem
                validateStatus={applicantStreetAddressError ? 'error' : ''}
                help={applicantStreetAddressError || ''}
                label="Street Address"
              >
                {getFieldDecorator('applicantStreetAddress', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your street address!',
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="environment"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder="Street Address"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormItem
                validateStatus={applicantCityError ? 'error' : ''}
                help={applicantCityError || ''}
                label="City"
              >
                {getFieldDecorator('applicantCity', {
                  rules: [
                    { required: true, message: 'Please input your city!' },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="environment"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder="City"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormItem
                validateStatus={applicantStateError ? 'error' : ''}
                help={applicantStateError || ''}
                label="State"
              >
                {getFieldDecorator('applicantState', {
                  rules: [
                    { required: true, message: 'Please input your state!' },
                  ],
                })(
                  <Select
                    autocomplete="off"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="State"
                  >
                    {stateOptions}
                  </Select>
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormItem
                validateStatus={applicantZipCodeError ? 'error' : ''}
                help={applicantZipCodeError || ''}
                label="Zip Code"
              >
                {getFieldDecorator('applicantZipCode', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your zip code!',
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="environment"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder="Zip Code"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <FormItem
                validateStatus={applicantCountryError ? 'error' : ''}
                help={applicantCountryError || ''}
                label="Country"
              >
                {getFieldDecorator('applicantCountry', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your country!',
                    },
                  ],
                })(
                  <Select
                    autocomplete="off"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Country"
                  >
                    {countriesOptions}
                  </Select>
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <Divider>Signature</Divider>
            </Grid>

            {this.state.signatureURL && (
              <Grid item xs={12}>
                <div className={classes.setSignatureContainer}>
                  <img
                    className={classes.setSignatureImg}
                    src={this.state.signatureURL}
                    alt="signature"
                  />
                </div>
              </Grid>
            )}

            {!this.state.signatureURL && (
              <Grid item xs={12}>
                <SignatureCanvas
                  ref={ref => {
                    this.sigCanvas = ref;
                  }}
                  penColor="green"
                  canvasProps={{
                    style: {
                      borderColor: this.state.signatureError
                        ? '#f5222d'
                        : undefined,
                    },
                    className: classes.signatureCanvas,
                  }}
                />
              </Grid>
            )}

            {this.state.signatureError &&
              !this.state.signatureURL && (
                <Grid item xs={12}>
                  <div
                    className="ant-form-item-control has-error"
                    style={{ marginTop: '-30px' }}
                  >
                    <div className="ant-form-explain">
                      Please input you signature above!
                    </div>
                  </div>
                </Grid>
              )}

            <Grid item xs={12}>
              {this.state.signatureURL && (
                <div className={classes.signatureBtnsWrapper}>
                  <FormItem>
                    <Button
                      type="danger"
                      onClick={() => {
                        if (this.sigCanvas) {
                          this.sigCanvas.clear();
                        }

                        if (this.state.signatureURL) {
                          this.setState({
                            signatureURL: '',
                          });
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </FormItem>
                </div>
              )}
              {!this.state.signatureURL && (
                <div className={classes.signatureBtnsWrapper}>
                  <FormItem>
                    <Button
                      onClick={() => {
                        if (this.sigCanvas && !this.sigCanvas.isEmpty()) {
                          this.setState({
                            signatureURL: this.sigCanvas
                              // .getTrimmedCanvas()
                              .toDataURL('image/jpeg'),
                          });
                        }
                      }}
                    >
                      Set Signature
                    </Button>
                  </FormItem>
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormItem>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ApplicationForm);
