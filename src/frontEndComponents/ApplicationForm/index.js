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
import legalWording from './legal';
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
  redColor: {
    color: '#f5222d',
  },
  legalSection: {
    fontSize: '.9rem',
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
    photoIDUploadError: false,
    photoIDFileList: [],
    paystub1FileList: [],
    paystub2FileList: [],
    bankStatment1FileList: [],
    bankStatment2FileList: [],
    taxReturnFileList: [],
    employmentLetterFileList: [],
    additionalFilesFileList: [],
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

      if (!this.state.signatureURL && !this.state.photoIDFileList.length) {
        this.setState({
          signatureError: true,
          photoIDUploadError: true,
        });
        return;
      } else if (!this.state.signatureURL) {
        this.setState({
          signatureError: true,
        });
        return;
      } else if (!this.state.photoIDFileList.length) {
        this.setState({
          photoIDUploadError: true,
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
            photoIDFile: this.state.photoIDFileList[0],
            paystub1File: this.state.paystub1FileList[0],
            paystub2File: this.state.paystub2FileList[0],
            bankStatment1File: this.state.bankStatment1FileList[0],
            bankStatment2File: this.state.bankStatment2FileList[0],
            taxReturnFilt: this.state.taxReturnFileList[0],
            employmentLetterFile: this.state.employmentLetterFileList[0],
            additionalFilesFile: this.state.additionalFilesFileList[0],
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

  photoIDUploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ photoIDFileList }) => {
        const index = photoIDFileList.indexOf(file);
        const newFileList = photoIDFileList.slice();
        newFileList.splice(index, 1);
        return {
          photoIDFileList: newFileList,
        };
      });

      if (
        !this.state.photoIDFileList ||
        this.state.photoIDFileList.length - 1 === 0
      ) {
        this.setState(() => ({
          photoIDUploadError: true,
        }));
      }
    },
    beforeUpload: file => {
      if (this.state.photoIDFileList && this.state.photoIDFileList.length >= 3)
        return;
      this.setState(({ photoIDFileList }) => ({
        photoIDFileList: [...photoIDFileList, file],
      }));

      if (this.state.photoIDUploadError) {
        this.setState(() => ({
          photoIDUploadError: false,
        }));
      }

      return false;
    },
    fileList: this.state.photoIDFileList,
  });

  paystub1UploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ paystub1FileList }) => {
        const index = paystub1FileList.indexOf(file);
        const newFileList = paystub1FileList.slice();
        newFileList.splice(index, 1);
        return {
          paystub1FileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ paystub1FileList }) => ({
        paystub1FileList: [...paystub1FileList, file],
      }));
      return false;
    },
    fileList: this.state.paystub1FileList,
  });

  paystub2UploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ paystub2FileList }) => {
        const index = paystub2FileList.indexOf(file);
        const newFileList = paystub2FileList.slice();
        newFileList.splice(index, 1);
        return {
          paystub2FileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ paystub2FileList }) => ({
        paystub2FileList: [...paystub2FileList, file],
      }));
      return false;
    },
    fileList: this.state.paystub2FileList,
  });

  bankStatment1UploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ bankStatment1FileList }) => {
        const index = bankStatment1FileList.indexOf(file);
        const newFileList = bankStatment1FileList.slice();
        newFileList.splice(index, 1);
        return {
          pbankStatment1FileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ bankStatment1FileList }) => ({
        bankStatment1FileList: [...bankStatment1FileList, file],
      }));
      return false;
    },
    fileList: this.state.bankStatment1FileList,
  });

  bankStatment2UploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ bankStatment2FileList }) => {
        const index = bankStatment2FileList.indexOf(file);
        const newFileList = bankStatment2FileList.slice();
        newFileList.splice(index, 1);
        return {
          bankStatment2FileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ bankStatment2FileList }) => ({
        bankStatment2FileList: [...bankStatment2FileList, file],
      }));
      return false;
    },
    fileList: this.state.bankStatment2FileList,
  });

  taxReturnUploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ taxReturnFileList }) => {
        const index = taxReturnFileList.indexOf(file);
        const newFileList = taxReturnFileList.slice();
        newFileList.splice(index, 1);
        return {
          taxReturnFileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ taxReturnFileList }) => ({
        taxReturnFileList: [...taxReturnFileList, file],
      }));
      return false;
    },
    fileList: this.state.taxReturnFileList,
  });

  employmentLetterUploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ employmentLetterFileList }) => {
        const index = employmentLetterFileList.indexOf(file);
        const newFileList = employmentLetterFileList.slice();
        newFileList.splice(index, 1);
        return {
          employmentLetterFileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ employmentLetterFileList }) => ({
        employmentLetterFileList: [...employmentLetterFileList, file],
      }));
      return false;
    },
    fileList: this.state.employmentLetterFileList,
  });

  additionalFilesUploadBtnProps = () => ({
    action: '#',
    onRemove: file => {
      this.setState(({ additionalFilesFileList }) => {
        const index = additionalFilesFileList.indexOf(file);
        const newFileList = additionalFilesFileList.slice();
        newFileList.splice(index, 1);
        return {
          additionalFilesFileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(({ additionalFilesFileList }) => ({
        additionalFilesFileList: [...additionalFilesFileList, file],
      }));
      return false;
    },
    fileList: this.state.additionalFilesFileList,
  });

  submitBtnDisabled = () => {
    const { getFieldsError } = this.props.form;

    if (this.state.photoIDFileList[0] && this.state.photoIDUploadError) {
      return true;
    }

    if (hasErrors(getFieldsError())) {
      return true;
    }

    if (!this.state.signatureURL) {
      return true;
    }

    return false;
  };

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
    const applicantLandlordError =
      (isFieldTouched('applicantLandlord') || this.formSubmitted) &&
      getFieldError('applicantLandlord');
    const applicantLandlordPhoneNumberError =
      (isFieldTouched('applicantLandlordPhoneNumber') || this.formSubmitted) &&
      getFieldError('applicantLandlordPhoneNumber');
    const currentEmployer1Error =
      (isFieldTouched('currentEmployer1') || this.formSubmitted) &&
      getFieldError('currentEmployer1');
    const currentJobTitle1Error =
      (isFieldTouched('currentJobTitle1') || this.formSubmitted) &&
      getFieldError('currentJobTitle1');
    const currentEmployerAddress1Error =
      (isFieldTouched('currentEmployerAddress1') || this.formSubmitted) &&
      getFieldError('currentEmployerAddress1');
    const currentEmployerPhoneNumber1Error =
      (isFieldTouched('currentEmployerPhoneNumber1') || this.formSubmitted) &&
      getFieldError('currentEmployerPhoneNumber1');
    const currentEmployerEmploymentLength1Error =
      (isFieldTouched('currentEmployerEmploymentLength1') ||
        this.formSubmitted) &&
      getFieldError('currentEmployerEmploymentLength1');
    const currentEmployerContactName1Error =
      (isFieldTouched('currentEmployerContactName1') || this.formSubmitted) &&
      getFieldError('currentEmployerContactName1');
    const currentEmployerContactNumber1Error =
      (isFieldTouched('currentEmployerContactNumber1') || this.formSubmitted) &&
      getFieldError('currentEmployerContactNumber1');
    const currentEmployerAnnualCompensation1Error =
      (isFieldTouched('currentEmployerAnnualCompensation1') ||
        this.formSubmitted) &&
      getFieldError('currentEmployerAnnualCompensation1');
    const currentEmployerContactEmail1Error =
      (isFieldTouched('currentEmployerContactEmail1') || this.formSubmitted) &&
      getFieldError('currentEmployerContactEmail1');

    const currentEmployer2Error =
      (isFieldTouched('currentEmployer2') || this.formSubmitted) &&
      getFieldError('currentEmployer2');
    const currentJobTitle2Error =
      (isFieldTouched('currentJobTitle2') || this.formSubmitted) &&
      getFieldError('currentJobTitle2');
    const currentEmployerAddress2Error =
      (isFieldTouched('currentEmployerAddress2') || this.formSubmitted) &&
      getFieldError('currentEmployerAddress2');
    const currentEmployerPhoneNumber2Error =
      (isFieldTouched('currentEmployerPhoneNumber2') || this.formSubmitted) &&
      getFieldError('currentEmployerPhoneNumber2');
    const currentEmployerEmploymentLength2Error =
      (isFieldTouched('currentEmployerEmploymentLength2') ||
        this.formSubmitted) &&
      getFieldError('currentEmployerEmploymentLength2');
    const currentEmployerContactName2Error =
      (isFieldTouched('currentEmployerContactName2') || this.formSubmitted) &&
      getFieldError('currentEmployerContactName2');
    const currentEmployerContactNumber2Error =
      (isFieldTouched('currentEmployerContactNumber2') || this.formSubmitted) &&
      getFieldError('currentEmployerContactNumber2');
    const currentEmployerAnnualCompensation2Error =
      (isFieldTouched('currentEmployerAnnualCompensation2') ||
        this.formSubmitted) &&
      getFieldError('currentEmployerAnnualCompensation2');
    const currentEmployerContactEmail2Error =
      (isFieldTouched('currentEmployerContactEmail2') || this.formSubmitted) &&
      getFieldError('currentEmployerContactEmail2');

    const previousEmployerError =
      (isFieldTouched('previousEmployer') || this.formSubmitted) &&
      getFieldError('previousEmployer');
    const previousJobTitleError =
      (isFieldTouched('previousJobTitle') || this.formSubmitted) &&
      getFieldError('previousJobTitle');
    const previousEmployerAddressError =
      (isFieldTouched('previousEmployerAddress') || this.formSubmitted) &&
      getFieldError('previousEmployerAddress');
    const previousEmployerPhoneNumberError =
      (isFieldTouched('previousEmployerPhoneNumber') || this.formSubmitted) &&
      getFieldError('previousEmployerPhoneNumber');
    const previousEmployerEmploymentLengthError =
      (isFieldTouched('previousEmployerEmploymentLength') ||
        this.formSubmitted) &&
      getFieldError('previousEmployerEmploymentLength');
    const previousEmployerContactNameError =
      (isFieldTouched('previousEmployerContactName') || this.formSubmitted) &&
      getFieldError('previousEmployerContactName');
    const previousEmployerContactNumberError =
      (isFieldTouched('previousEmployerContactNumber') || this.formSubmitted) &&
      getFieldError('previousEmployerContactNumber');
    const previousEmployerAnnualCompensationError =
      (isFieldTouched('previousEmployerAnnualCompensation') ||
        this.formSubmitted) &&
      getFieldError('previousEmployerAnnualCompensation');
    const previousEmployerContactEmailError =
      (isFieldTouched('previousEmployerContactEmail') || this.formSubmitted) &&
      getFieldError('previousEmployerContactEmail');
    const emergencyContactError =
      (isFieldTouched('emergencyContact') || this.formSubmitted) &&
      getFieldError('emergencyContact');
    const emergencyContactPhoneNumberError =
      (isFieldTouched('emergencyContactPhoneNumber') || this.formSubmitted) &&
      getFieldError('emergencyContactPhoneNumber');
    const emergencyContactEmailError =
      (isFieldTouched('emergencyContactEmail') || this.formSubmitted) &&
      getFieldError('emergencyContactEmail');
    const emergencyContactAddressError =
      (isFieldTouched('emergencyContactAddress') || this.formSubmitted) &&
      getFieldError('emergencyContactAddress');
    const targetMoveInDateError =
      (isFieldTouched('targetMoveInDate') || this.formSubmitted) &&
      getFieldError('targetMoveInDate');
    const expectedMoveOutDateError =
      (isFieldTouched('expectedMoveOutDate') || this.formSubmitted) &&
      getFieldError('expectedMoveOutDate');
    const monthlyRentError =
      (isFieldTouched('monthlyRent') || this.formSubmitted) &&
      getFieldError('monthlyRent');
    const propertyAddressError =
      (isFieldTouched('propertyAddress') || this.formSubmitted) &&
      getFieldError('propertyAddress');
    const propertyApartmentNumberError =
      (isFieldTouched('propertyApartmentNumber') || this.formSubmitted) &&
      getFieldError('propertyApartmentNumber');

    const agentError =
      (isFieldTouched('agent') || this.formSubmitted) && getFieldError('agent');

    return (
      <div className={classes.root}>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Divider>Rental Information</Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={propertyAddressError ? 'error' : ''}
                help={propertyAddressError || ''}
                label="Property Address"
              >
                {getFieldDecorator('propertyAddress', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input the property address!',
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
                    placeholder="Property Address"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={propertyApartmentNumberError ? 'error' : ''}
                help={propertyApartmentNumberError || ''}
                label="Apartment Number"
              >
                {getFieldDecorator('propertyApartmentNumber', {
                  rules: [
                    {
                      message: "Please input the property's apartment number!",
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
                    placeholder="Apartment Number"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={monthlyRentError ? 'error' : ''}
                help={monthlyRentError || ''}
                label="Monthly Rent"
              >
                {getFieldDecorator('monthlyRent', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input the amount of the monthly rent!',
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="credit-card"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    type="number"
                    placeholder="Monthly Rent"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={targetMoveInDateError ? 'error' : ''}
                help={targetMoveInDateError || ''}
                label="Target Move in Date"
              >
                {getFieldDecorator('targetMoveInDate', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your move In date!',
                    },
                  ],
                })(
                  <DatePicker
                    className={classes.datePicker}
                    disabledDate={date =>
                      date ? date.isBefore(moment().subtract(1, 'days')) : true
                    }
                    type="text"
                    placeholder="Target Move in Date"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={expectedMoveOutDateError ? 'error' : ''}
                help={expectedMoveOutDateError || ''}
                label="Expected Move Out Date"
              >
                {getFieldDecorator('expectedMoveOutDate', {
                  rules: [
                    {
                      required: false,
                      message: 'Please input your expected move out date!',
                    },
                  ],
                })(
                  <DatePicker
                    className={classes.datePicker}
                    disabledDate={date =>
                      date ? date.isBefore(moment()) : true
                    }
                    type="text"
                    placeholder="Expected Move out Date"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={applicantLandlordError ? 'error' : ''}
                help={applicantLandlordError || ''}
                label="Landlord"
              >
                {getFieldDecorator('applicantLandlord', {
                  rules: [
                    {
                      required: true,
                      message: "Please input your loandlord's name!",
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Landlord"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={
                  applicantLandlordPhoneNumberError ? 'error' : ''
                }
                help={applicantLandlordPhoneNumberError || ''}
                label="Landlord's Phone Number"
              >
                {getFieldDecorator('applicantLandlordPhoneNumber', {
                  rules: [
                    {
                      required: true,
                      message:
                        "Please input your loandlord's 10-digit phone number!",
                      len: 14,
                    },
                  ],
                })(
                  <InputMask
                    mask="(999) 999-9999"
                    maskChar={null}
                    className="ant-input"
                    placeholder="Landlord's Phone Number"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <Divider>Employment</Divider>
            </Grid>

            <Grid item xs={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Current Employer*" key="1">
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={currentEmployer1Error ? 'error' : ''}
                        help={currentEmployer1Error || ''}
                        label="Employer"
                      >
                        {getFieldDecorator('currentEmployer1', {
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input your current employer's name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Employer"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={currentJobTitle1Error ? 'error' : ''}
                        help={currentJobTitle1Error || ''}
                        label="Job Title"
                      >
                        {getFieldDecorator('currentJobTitle1', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your current job title!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Job Title"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerAddress1Error ? 'error' : ''
                        }
                        help={currentEmployerAddress1Error || ''}
                        label="Employer Address"
                      >
                        {getFieldDecorator('currentEmployerAddress1', {
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input your current employer's address!",
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
                            placeholder="Employer Address"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerPhoneNumber1Error ? 'error' : ''
                        }
                        help={currentEmployerPhoneNumber1Error || ''}
                        label="Employer's Phone Number"
                      >
                        {getFieldDecorator('currentEmployerPhoneNumber1', {
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input your employer's 10-digit phone number!",
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Employer's Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerEmploymentLength1Error ? 'error' : ''
                        }
                        help={currentEmployerEmploymentLength1Error || ''}
                        label="Employment Length"
                      >
                        {getFieldDecorator('currentEmployerEmploymentLength1', {
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input your current job's employment length!",
                            },
                          ],
                        })(<Input placeholder="Employment Length" />)}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactName1Error ? 'error' : ''
                        }
                        help={currentEmployerContactName1Error || ''}
                        label="Contact Name"
                      >
                        {getFieldDecorator('currentEmployerContactName1', {
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input your current employer's contact name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Contact Name"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactNumber1Error ? 'error' : ''
                        }
                        help={currentEmployerContactNumber1Error || ''}
                        label="Contact Phone Number"
                      >
                        {getFieldDecorator('currentEmployerContactNumber1', {
                          rules: [
                            {
                              required: true,
                              message:
                                'Please input a 10-digit contact phone number!',
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Contact Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerAnnualCompensation1Error ? 'error' : ''
                        }
                        help={currentEmployerAnnualCompensation1Error || ''}
                        label="Annual Compensation"
                      >
                        {getFieldDecorator(
                          'currentEmployerAnnualCompensation1',
                          {
                            rules: [
                              {
                                required: true,
                                message:
                                  'Please input your annual compensation!',
                              },
                            ],
                          }
                        )(
                          <Input
                            prefix={
                              <Icon
                                type="wallet"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="number"
                            placeholder="Annual Compensation"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactEmail1Error ? 'error' : ''
                        }
                        help={currentEmployerContactEmail1Error || ''}
                        label="Contact Email"
                      >
                        {getFieldDecorator('currentEmployerContactEmail1', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input a contact email!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="mail"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="email"
                            placeholder="Contact Email"
                          />
                        )}
                      </FormItem>
                    </Grid>
                  </Grid>
                </TabPane>
                <TabPane tab="2nd Current Employer" key="2">
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={currentEmployer2Error ? 'error' : ''}
                        help={currentEmployer2Error || ''}
                        label="Employer"
                      >
                        {getFieldDecorator('currentEmployer2', {
                          rules: [
                            {
                              message:
                                "Please input your current employer's name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Employer"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={currentJobTitle2Error ? 'error' : ''}
                        help={currentJobTitle2Error || ''}
                        label="Job Title"
                      >
                        {getFieldDecorator('currentJobTitle2', {
                          rules: [
                            {
                              message: 'Please input your current job title!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Job Title"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerAddress2Error ? 'error' : ''
                        }
                        help={currentEmployerAddress2Error || ''}
                        label="Employer Address"
                      >
                        {getFieldDecorator('currentEmployerAddress2', {
                          rules: [
                            {
                              message:
                                "Please input your current employer's address!",
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
                            placeholder="Employer Address"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerPhoneNumber2Error ? 'error' : ''
                        }
                        help={currentEmployerPhoneNumber2Error || ''}
                        label="Employer's Phone Number"
                      >
                        {getFieldDecorator('currentEmployerPhoneNumber2', {
                          rules: [
                            {
                              message:
                                "Please input your employer's 10-digit phone number!",
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Employer's Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerEmploymentLength2Error ? 'error' : ''
                        }
                        help={currentEmployerEmploymentLength2Error || ''}
                        label="Employment Length"
                      >
                        {getFieldDecorator('currentEmployerEmploymentLength2', {
                          rules: [
                            {
                              message:
                                "Please input your current job's employment length!",
                            },
                          ],
                        })(<Input placeholder="Employment Length" />)}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactName2Error ? 'error' : ''
                        }
                        help={currentEmployerContactName2Error || ''}
                        label="Contact Name"
                      >
                        {getFieldDecorator('currentEmployerContactName2', {
                          rules: [
                            {
                              message:
                                "Please input your current employer's contact name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Contact Name"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactNumber2Error ? 'error' : ''
                        }
                        help={currentEmployerContactNumber2Error || ''}
                        label="Contact Phone Number"
                      >
                        {getFieldDecorator('currentEmployerContactNumber2', {
                          rules: [
                            {
                              message:
                                'Please input a 10-digit contact phone number!',
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Contact Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerAnnualCompensation2Error ? 'error' : ''
                        }
                        help={currentEmployerAnnualCompensation2Error || ''}
                        label="Annual Compensation"
                      >
                        {getFieldDecorator(
                          'currentEmployerAnnualCompensation2',
                          {
                            rules: [
                              {
                                message:
                                  'Please input your annual compensation!',
                              },
                            ],
                          }
                        )(
                          <Input
                            prefix={
                              <Icon
                                type="wallet"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="number"
                            placeholder="Annual Compensation"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          currentEmployerContactEmail2Error ? 'error' : ''
                        }
                        help={currentEmployerContactEmail2Error || ''}
                        label="Contact Email"
                      >
                        {getFieldDecorator('currentEmployerContactEmail2', {
                          rules: [
                            {
                              message: 'Please input a contact email!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="mail"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="email"
                            placeholder="Contact Email"
                          />
                        )}
                      </FormItem>
                    </Grid>
                  </Grid>
                </TabPane>
                <TabPane tab="Previous Employer" key="3">
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={previousEmployerError ? 'error' : ''}
                        help={previousEmployerError || ''}
                        label="Employer"
                      >
                        {getFieldDecorator('previousEmployer', {
                          rules: [
                            {
                              message:
                                "Please input your previous employer's name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Employer"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={previousJobTitleError ? 'error' : ''}
                        help={previousJobTitleError || ''}
                        label="Job Title"
                      >
                        {getFieldDecorator('previousJobTitle', {
                          rules: [
                            {
                              message: 'Please input your previous job title!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Job Title"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          previousEmployerAddressError ? 'error' : ''
                        }
                        help={previousEmployerAddressError || ''}
                        label="Employer Address"
                      >
                        {getFieldDecorator('previousEmployerAddress', {
                          rules: [
                            {
                              message:
                                "Please input your previous employer's address!",
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
                            placeholder="Employer Address"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          previousEmployerPhoneNumberError ? 'error' : ''
                        }
                        help={previousEmployerPhoneNumberError || ''}
                        label="Employer's Phone Number"
                      >
                        {getFieldDecorator('previousEmployerPhoneNumber', {
                          rules: [
                            {
                              message:
                                "Please input your employer's 10-digit phone number!",
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Employer's Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          previousEmployerEmploymentLengthError ? 'error' : ''
                        }
                        help={previousEmployerEmploymentLengthError || ''}
                        label="Employment Length"
                      >
                        {getFieldDecorator('previousEmployerEmploymentLength', {
                          rules: [
                            {
                              message:
                                "Please input your previous job's employment length!",
                            },
                          ],
                        })(<Input placeholder="Employment Length" />)}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          previousEmployerContactNameError ? 'error' : ''
                        }
                        help={previousEmployerContactNameError || ''}
                        label="Contact Name"
                      >
                        {getFieldDecorator('previousEmployerContactName', {
                          rules: [
                            {
                              message:
                                "Please input your previous employer's contact name!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Contact Name"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormItem
                        validateStatus={
                          previousEmployerContactNumberError ? 'error' : ''
                        }
                        help={previousEmployerContactNumberError || ''}
                        label="Contact Phone Number"
                      >
                        {getFieldDecorator('previousEmployerContactNumber', {
                          rules: [
                            {
                              message:
                                'Please input a 10-digit contact phone number!',
                              len: 14,
                            },
                          ],
                        })(
                          <InputMask
                            mask="(999) 999-9999"
                            maskChar={null}
                            className="ant-input"
                            placeholder="Contact Phone Number"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          previousEmployerAnnualCompensationError ? 'error' : ''
                        }
                        help={previousEmployerAnnualCompensationError || ''}
                        label="Annual Compensation"
                      >
                        {getFieldDecorator(
                          'previousEmployerAnnualCompensation',
                          {
                            rules: [
                              {
                                message:
                                  'Please input your annual compensation!',
                              },
                            ],
                          }
                        )(
                          <Input
                            prefix={
                              <Icon
                                type="wallet"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="number"
                            placeholder="Annual Compensation"
                          />
                        )}
                      </FormItem>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormItem
                        validateStatus={
                          previousEmployerContactEmailError ? 'error' : ''
                        }
                        help={previousEmployerContactEmailError || ''}
                        label="Contact Email"
                      >
                        {getFieldDecorator('previousEmployerContactEmail', {
                          rules: [
                            {
                              message: 'Please input a contact email!',
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="mail"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="email"
                            placeholder="Contact Email"
                          />
                        )}
                      </FormItem>
                    </Grid>
                  </Grid>
                </TabPane>
              </Tabs>
            </Grid>

            <Grid item xs={12}>
              <Divider>Emergency Contact</Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={emergencyContactError ? 'error' : ''}
                help={emergencyContactError || ''}
                label="Name"
              >
                {getFieldDecorator('emergencyContact', {
                  rules: [
                    {
                      required: true,
                      message: "Please input your emergency contact's name!",
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Name"
                  />
                )}
              </FormItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={emergencyContactPhoneNumberError ? 'error' : ''}
                help={emergencyContactPhoneNumberError || ''}
                label="Phone Number"
              >
                {getFieldDecorator('emergencyContactPhoneNumber', {
                  rules: [
                    {
                      required: true,
                      message:
                        "Please input your emergency contact's 10-digit phone number!",
                      len: 14,
                    },
                  ],
                })(
                  <InputMask
                    mask="(999) 999-9999"
                    maskChar={null}
                    className="ant-input"
                    placeholder="Contact Phone Number"
                  />
                )}
              </FormItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormItem
                validateStatus={emergencyContactEmailError ? 'error' : ''}
                help={emergencyContactEmailError || ''}
                label="Email"
              >
                {getFieldDecorator('emergencyContactEmail', {
                  rules: [
                    {
                      message: "Please input your emergency contact's email!",
                    },
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
                validateStatus={emergencyContactAddressError ? 'error' : ''}
                help={emergencyContactAddressError || ''}
                label="Address"
              >
                {getFieldDecorator('emergencyContactAddress', {
                  rules: [
                    {
                      message: "Please input your emergency contact's address!",
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    type="environment"
                    placeholder="Address"
                  />
                )}
              </FormItem>
            </Grid>

            <Grid item xs={12}>
              <Divider>Upload Forms</Divider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload
                {...this.photoIDUploadBtnProps()}
                onChange={this.photoIDUploadChange}
                accept=".jpg, .jpeg, .png, .pdf"
              >
                <Button
                  className={classes.uploadBtn}
                  style={{
                    borderColor: this.state.photoIDUploadError
                      ? '#f5222d'
                      : undefined,
                  }}
                >
                  <Icon type="upload" />
                  <span className={classes.redColor}>*</span> Photo ID Upload
                </Button>
              </Upload>
              {this.state.photoIDUploadError && (
                <div className="ant-form-item-control has-error">
                  <div className="ant-form-explain">
                    Please input upload an image of your Photo ID!
                  </div>
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.paystub1UploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Paystub 1 Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.paystub2UploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Paystub 2 Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.taxReturnUploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Tax Return/W2 Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.bankStatment1UploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Bank Statement 1 Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.bankStatment2UploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Bank Statement 2 Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.employmentLetterUploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Employment Letter Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Upload {...this.additionalFilesUploadBtnProps()}>
                <Button className={classes.uploadBtn}>
                  <Icon type="upload" /> Additional Upload
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={12}>
              <Divider>Legal</Divider>
            </Grid>

            <Grid item xs={12}>
              <div className={classes.legalSection}>{legalWording}</div>
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
                      Please sign and set your signature above!
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
