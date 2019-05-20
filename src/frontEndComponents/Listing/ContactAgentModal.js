import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Input, Modal } from 'antd';
import Grid from 'material-ui/Grid';
import classnames from 'classnames';
import { withStyles } from 'material-ui/styles';
import InputMask from 'react-input-mask';
import '../../static/css/listing.css';

const { TextArea } = Input;

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
});

@withStyles(styles)
@observer
class ContactAgentModal extends React.Component {
  formSubmitted = false;

  defaultMessageValue = `Hi ${
    this.props.agentName
  }, I would like more information about ${this.props.listingAddress}.`;

  handleSubmit = e => {
    const { onSubmit, toggleContactAgentModalClosed } = this.props;
    e.preventDefault();

    this.formSubmitted = true;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (onSubmit) {
          onSubmit(values);
        }
        toggleContactAgentModalClosed();
      }
    });
  };

  render() {
    const {
      classes,
      contactAgentModalOpen,
      toggleContactAgentModalClosed,
      agentName,
    } = this.props;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
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

    const messageError =
      (isFieldTouched('message') || this.formSubmitted) &&
      getFieldError('message');

    return (
      <Modal
        title={`Contact - ${agentName}`}
        visible={contactAgentModalOpen}
        onOk={this.handleSubmit}
        onCancel={toggleContactAgentModalClosed}
        wrapClassName={classnames(
          classes.verticalModalWrapper,
          'contact-agent-modal'
        )}
        okText="Submit"
      >
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
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
                      message: 'Please input your first name!',
                    },
                  ],
                })(<Input type="text" placeholder="First Name" />)}
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
                      message: 'Please input your last name!',
                    },
                  ],
                })(<Input type="text" placeholder="Last Name" />)}
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
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ],
                })(<Input type="email" placeholder="Email" />)}
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
                      message: 'Please input your phone number!',
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

            <Grid item xs={12}>
              <FormItem
                validateStatus={messageError ? 'error' : ''}
                help={messageError || ''}
                label="Message"
              >
                {getFieldDecorator('message', {
                  rules: [
                    {
                      required: true,
                      message:
                        'Please input a message! (min 5, max 500 characters)',
                      min: 5,
                      max: 500,
                    },
                  ],
                })(
                  <TextArea
                    placeholder="Message..."
                    autosize={{ minRows: 3, maxRows: 6 }}
                  />
                )}
              </FormItem>
            </Grid>
          </Grid>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ContactAgentModal);
