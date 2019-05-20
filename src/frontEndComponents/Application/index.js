import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Grid from 'material-ui/Grid';
import { Form, Icon, Input, Button, Divider, Select, Modal } from 'antd';
import { states, countriesArrayWithCodes } from '../../utils/constants';
import FullApplicationForm from '../ApplicationForm';
import CreditCheckApplicationForm from '../CreditCheckApplicationForm';

const ButtonGroup = Button.Group;

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
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
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
  paymentFromLabel: {
    display: 'block',
    marginBottom: 10,
  },
  paymentBtnWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginRight: 15,
  },
  paymentCardWrapper: {},
  payBtn: {
    width: '100%',
    fontSize: '18px',
    color: '#fff',
  },
  paymentAmount: {
    fontSize: '17px',
  },
  disabledLoading: {
    backgroundColor: '#40a9ff',
    borderColor: '#40a9ff',
    opacity: '.7',
    cursor: 'progress',
    '&:hover': {
      backgroundColor: '#40a9ff !important',
      borderColor: '#40a9ff !important',
    },
  },
  disabled: {
    backgroundColor: '#40a9ff',
    borderColor: '#40a9ff',
    opacity: '.7',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
      borderColor: '#d9d9d9 !important',
    },
  },
});

const { Option } = Select;

const hasErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const stateOptions = states.map(state => (
  <Option key={state} value={state}>
    {state}
  </Option>
));

const countriesOptions = countriesArrayWithCodes.map(country => (
  <Option key={country.name} value={country.code}>
    {country.name}
  </Option>
));

@withStyles(styles)
@observer
class Application extends React.Component {
  componentDidMount = () => {
    this.props.getPaymentFormApi(this.props.form);
  };

  hasFormFieldErrors = () => {
    const { getFieldError, getFieldValue } = this.props.form;
    const errors = [
      getFieldError('cardOwnerName'),
      getFieldError('paymentAddress'),
      getFieldError('paymentAddressCity'),
      getFieldError('paymentAddressState'),
      getFieldError('applicantCountry'),
      !getFieldValue('cardOwnerName'),
      !getFieldValue('paymentAddress'),
      !getFieldValue('paymentAddressCity'),
      !getFieldValue('paymentAddressState'),
      !getFieldValue('applicantCountry'),
    ];

    return errors.some(error => error);
  };

  render() {
    const {
      onSubmit,
      classes,
      listingAgents,
      setFullApplication,
      setCreditCheckApplication,
      isFullApplication,
      paymentFormSubmitInProgress,
      paymentModalVisible,
      cardElementOnChange,
      cardElementComplete,
      onSubmitPaymentForm,
      handleClosePaymentModal,
    } = this.props;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;

    const cardOwnerNameError =
      isFieldTouched('cardOwnerName') && getFieldError('cardOwnerName');

    const paymentAddressError =
      isFieldTouched('paymentAddress') && getFieldError('paymentAddress');

    const paymentAddressCityError =
      isFieldTouched('paymentAddressCity') &&
      getFieldError('paymentAddressCity');

    const paymentAddressStateError =
      isFieldTouched('paymentAddressState') &&
      getFieldError('paymentAddressState');

    const applicantCountryError =
      isFieldTouched('applicantCountry') && getFieldError('applicantCountry');

    return (
      <div className={classes.root}>
        <div className={classes.titleSection}>Apply</div>
        <div className={classes.applicationTypeBtnsWrapper}>
          <ButtonGroup>
            <Button
              className={classnames(
                isFullApplication ? classes.activePrimaryToggleBtn : null
              )}
              onClick={setFullApplication}
            >
              Full Application
            </Button>
            <Button
              className={classnames(
                !isFullApplication ? classes.activePrimaryToggleBtn : null
              )}
              onClick={setCreditCheckApplication}
            >
              Credit Check Only
            </Button>
          </ButtonGroup>
        </div>
        <div className={classes.formWrapper}>
          {isFullApplication ? (
            <FullApplicationForm
              listingAgents={listingAgents}
              onSubmit={onSubmit}
            />
          ) : (
            <CreditCheckApplicationForm
              listingAgents={listingAgents}
              onSubmit={onSubmit}
            />
          )}
        </div>
        <Modal
          title="Payment"
          visible={paymentModalVisible}
          onOk={this.handleOk}
          confirmLoading={paymentFormSubmitInProgress}
          onCancel={handleClosePaymentModal}
          wrapClassName={classnames(
            classes.verticalModalWrapper,
            'payment-modal'
          )}
          okText="Pay $100.00"
          footer={null}
        >
          <div className={classes.paymentCardWrapper}>
            <Form layout="vertical" onSubmit={onSubmitPaymentForm}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Divider>Cardholder Information</Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormItem
                    validateStatus={cardOwnerNameError ? 'error' : ''}
                    help={cardOwnerNameError || ''}
                    label="Name"
                  >
                    {getFieldDecorator('cardOwnerName', {
                      rules: [
                        {
                          required: true,
                          message:
                            "Please input the carholder's name! (As it appears on the card)",
                        },
                      ],
                    })(<Input type="text" placeholder="Name" />)}
                  </FormItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormItem
                    validateStatus={paymentAddressError ? 'error' : ''}
                    help={paymentAddressError || ''}
                    label="Address"
                  >
                    {getFieldDecorator('paymentAddress', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the payment address!',
                        },
                      ],
                    })(<Input type="text" placeholder="Address" />)}
                  </FormItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormItem
                    validateStatus={paymentAddressCityError ? 'error' : ''}
                    help={paymentAddressCityError || ''}
                    label="City"
                  >
                    {getFieldDecorator('paymentAddressCity', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the city!',
                        },
                      ],
                    })(<Input type="text" placeholder="City" />)}
                  </FormItem>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormItem
                    validateStatus={paymentAddressStateError ? 'error' : ''}
                    help={paymentAddressStateError || ''}
                    label="State"
                  >
                    {getFieldDecorator('paymentAddressState', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input the state!',
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
                        placeholder="State"
                      >
                        {stateOptions}
                      </Select>
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
                  <Divider>Card Details</Divider>
                </Grid>
              </Grid>

              <div className={classnames(classes.paymentBtnWrapper)}>
                <Button
                  htmlType="submit"
                  disabled={!cardElementComplete || this.hasFormFieldErrors()}
                  className={classnames(
                    classes.payBtn,
                    !cardElementComplete || this.hasFormFieldErrors()
                      ? classes.disabled
                      : null,
                    paymentFormSubmitInProgress && classes.disabledLoading
                  )}
                  type="primary"
                >
                  {paymentFormSubmitInProgress && <Icon type="loading" />}Pay{' '}
                  <span className={classes.paymentAmount}>$100.00</span>{' '}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Application);
