import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import { Form, NestedField } from 'react-form';
import moment from 'moment';
import uuid from 'uuid/v4';
import Grid from 'material-ui/Grid';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from 'material-ui/TextField';
import { Icon } from 'antd';
import MaterialCustomTextFieldWrapper from '../../MaterialCustomTextFieldWrapper';
import MaterialCustomRadioInputWrapper from '../../MaterialCustomRadioInputWrapper';
import MaterialCustomSelectInputWrapper from '../../MaterialCustomSelectInputWrapper';
import CustomFileUploadInputWrapper from '../../CustomFileUploadInputWrapper';
import { capitalize } from '../../../utils/stringUtils';
import validators, {
  paymentTypeValidator,
  checkOrTransactionNumberValidator,
  paymentAmountValidator,
  deductionTypeValidator,
  descriptionValidator,
  deductionsAmountValidator,
} from './formValidation';
import CustomInputMask from '../../CustomInputMask';

const CustomTextField = MaterialCustomTextFieldWrapper;
const MaterialCustomRadioInput = MaterialCustomRadioInputWrapper;
const MaterialCustomSelectInput = MaterialCustomSelectInputWrapper;
const CustomFileUploadInputBtn = CustomFileUploadInputWrapper;

const acceptedFileExtensions = ['jpg', 'jpeg', 'pdf'];

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing.unit * 3,
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
  },
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  formControl: {
    marginLeft: 0,
    marginRight: 0,
  },
  alignCenter: {
    textAlign: 'center',
  },
  formHeader: {
    marginBottom: theme.spacing.unit * 3,
  },
  formWrapper: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    textAlign: 'center',
    overflow: 'hidden',
  },
  formRoot: {
    paddingBottom: 10,
    overflow: 'hidden',
    flexGrow: 1,
    justifyContent: 'center',
  },
  radioInputWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formSubheading: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '82px',
  },
  h3: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  addPaymentBtn: {
    marginTop: '10px',
  },
  removePaymentBtn: {
    marginTop: '5px',
    marginLeft: '28px',
  },
  paymentItemsWrapper: {
    display: 'flex',
    width: '100%',
    padding: '5px 0 12px 0',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    '& > div': {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
  formMiniHeading: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
  },
  formMiniHeading2: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
    marginTop: '60px',
  },
  topPaymentMethodWrapper: {
    paddingTop: '0',
  },
  paddingBottom10: {
    paddingBottom: '15px',
  },
  greenText: {
    color: '#448A19',
  },
  redText: {
    color: '#ED462F',
  },
  blueText: {
    color: '#3878D8',
  },
  financialsTotal: {
    backgroundColor: 'rgba(0,0,0,.12)',
  },
  uploadBtnClassName: {
    color: '#fff',
    backgroundColor: '#272A2E',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    padding: '8px 16px',
    minWidth: '88px',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    minHeight: '36px',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    lineHeight: '1.4em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '500',
    borderRadius: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#000',
    },
    addUploadBtnClassName: {},
  },
  fileUploadBtnWrapper2: {
    display: 'inline-block',
  },
  smallFileAddBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    backgroundColor: '#2995F3',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#2483D6',
    },
  },
  smallFileRemoveBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    position: 'absolute',
    top: '18px',
  },
  uploadContractDivWrapper: {
    position: 'relative',
  },
  blueBackgroundColor: {
    backgroundColor: '#2995F3',
  },
  finalTotalLabelClass: {
    paddingLeft: '10px',
  },
  finalTotalInputClass: {
    backgroundColor: 'rgba(0,0,0,.12)',
    borderRadius: '5px 5px 0 0',
    paddingLeft: '10px',
  },
  alignCenterGrid: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  formSubmittingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  progressBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '25%',
  },
  progressBarExplanation: {
    marginTop: '20px',
    fontSize: '1.1rem',
  },
  ManagementOrCobrokeCompanyTextField: {
    width: '100%',
    margin: 8,
    marginLeft: 0,
  },
});

const radioInputAgentItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
];

const radioInputManagementItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '85%', value: '85' },
  { label: '100%', value: '100' },
];
const radioInputAgentPaymentItems = [
  { label: 'Ill pick up the check' },
  { label: 'Please ACH me' },
];

const radioInputYesNoItems = [{ label: 'Yes' }, { label: 'No' }];

const invoiceTypeSelectItems = [
  { label: 'Residential Rental' },
  { label: 'Residential Sale' },
  { label: 'Commercial Rental' },
  { label: 'Commercial Sale' },
];

const fundsPaidBySelectItems = [
  { label: 'Bringing a ckeck to the office' },
  { label: 'Remote deposit to Chase account' },
  { label: 'Check or "OP" mailed to office' },
  { label: 'Cridit card payment' },
  { label: 'Client wired funds' },
  { label: 'Commision advance' },
];

const paymentTypeSelectItems = [
  { label: 'Check' },
  { label: 'Money Order' },
  { label: 'Wire' },
  { label: 'Owner Pays (OP)' },
];

@observer
class SubmitInvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderInitialDeductionItem: true,
    };
  }
  isFirstTimeRender = true;

  componentDidMount() {
    if (this.props.setInitialContainerState && this.props.submittedInvoice) {
      this.props.setInitialContainerState({
        total: this.props.submittedInvoice.total,
      });
    }
  }

  render() {
    let firstName;
    let lastName;
    let agentPart;
    let agentType;
    let state;

    if (this.props.agent) {
      firstName = this.props.agent.firstName;
      lastName = this.props.agent.lastName;
      agentPart = this.props.agent.agentPart;
      agentType = this.props.agent.agent.agentType;
      state = this.props.agent.agent.state;
    }

    const {
      classes,
      setAgentDisclosureForm,
      setContractOrLeaseForms,
      agentDisclosureForm,
      contractOrLeaseForms,
      subtractPaymentValueFromState,
      choosingMgmtCoBrokeCompany,
      toggleChoosingMgmtCoBrokeCompany,
      handleMgmtOrCobrokeCompanyChange,
      setHasSetNewMgmtOrCobrokeCompany,
      newMgmtOrCobrokeCompany,
      addedManagementCompanies,
      formSubmissionBegun,
      submittingFormToServer,
      submittedInvoice,
      isEditingInvoice,
      managementCobrokeCompanyItems,
      isViewType,
    } = this.props;

    const managementCobrokeCompanies =
      managementCobrokeCompanyItems && managementCobrokeCompanyItems.length
        ? [...managementCobrokeCompanyItems]
        : [];

    if (submittedInvoice && submittedInvoice.managementOrCobrokeCompany) {
      if (
        !managementCobrokeCompanies.includes(
          submittedInvoice.managementOrCobrokeCompany
        )
      ) {
        managementCobrokeCompanies.push(
          submittedInvoice.managementOrCobrokeCompany
        );
      }
    }

    let managementCobrokeCompanySelectItems = managementCobrokeCompanies.map(
      company => ({ label: company })
    );

    managementCobrokeCompanySelectItems = managementCobrokeCompanySelectItems
      ? [
          ...managementCobrokeCompanySelectItems,
          ...addedManagementCompanies.map(company => ({ label: company })),
          { label: 'Add a new item...' },
        ]
      : [];

    let finalDefaultValues;

    if (submittedInvoice) {
      const {
        agentNotes,
        agentType,
        agentName,
        city,
        // clientPhoneNumber,
        clientName,
        date,
        invoiceType,
        managementOrCobrokeCompany,
        propertyAddress,
        // shouldSendApprovalTextMessageNotification,
        state,
        price,
        paymentItems,
        apartmentNumber,
        total,
        attention,
        attentionEmail,
      } = submittedInvoice;
      finalDefaultValues = {
        agent: agentName,
        agentNotes,
        agentType,
        city,
        apartmentNumber,
        // clientPhoneNumber,
        clientName,
        date: moment(date).format('MMMM Do YYYY'),
        invoiceType,
        managementOrCobrokeCompany,
        propertyAddress,
        // shouldSendApprovalTextMessageNotification,
        state,
        price,
        paymentItems: paymentItems.map(
          ({ paymentType, checkOrTransactionNumber, amount }) => ({
            paymentType,
            checkOrTransactionNumber,
            amount,
          })
        ),
        financialsTotal: total ? total.toLocaleString() : '0',
        attention,
        attentionEmail,
      };
    }

    return (
      <div className={classes.formWrapper}>
        {!formSubmissionBegun ? (
          <Form
            defaultValues={
              !finalDefaultValues && this.props.agent
                ? {
                    date: `${moment().format('MMMM Do YYYY')}`,
                    agentType: `${this.props.agent.agent.agentType}`,
                    state: this.props.agent.agent.state,
                    agent: `${capitalize(
                      this.props.agent.firstName
                    )} ${capitalize(this.props.agent.lastName)}`,
                    financialsTotal: this.props.total,
                  }
                : finalDefaultValues
            }
            preValidate={this.preValidate}
            onSubmit={this.props.onSubmit}
            onSubmitFailure={this.props.onSubmitFailure}
            validate={validators}
            validateOnMount
            getApi={formApi => {
              this.props.getFormApi(formApi);
            }}
          >
            {formApi => {
              /*
              if (this.isFirstTimeRender) {
                this.isFirstTimeRender = false;
                formApi.setValue('date', `${moment().format('MMMM Do YYYY')}`);
                formApi.setValue(
                  'agent',
                  `${capitalize(firstName)} ${capitalize(lastName)}`
                );
                formApi.setValue('agentType', `${agentType}`);
                formApi.setValue('state', state);
                formApi.setValue('financialsTotal', this.props.total);
              }
              */

              return (
                <form
                  onSubmit={formApi.submitForm}
                  id="form1"
                  className={classes.formRoot}
                >
                  <Grid container spacing={24}>
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="date"
                          id={uuid()}
                          label="Date"
                          disabled
                          fullWidth
                          required
                        />
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="agent"
                          id={uuid()}
                          label="Agent"
                          disabled
                          fullWidth
                          required
                        />
                      </div>
                    </Grid>

                    <div
                      className={`${classes.formControlWrapper} ${
                        classes.radioInputWrapper
                      }`}
                    >
                      <MaterialCustomRadioInput
                        field="agentType"
                        id={uuid()}
                        required
                        label="Agent Type"
                        radioInputItems={
                          (this.props.agent &&
                            this.props.agent.agent.agentType > 80) ||
                          (this.props.submittedInvoice &&
                            this.props.submittedInvoice.agentType > 80)
                            ? radioInputManagementItems
                            : radioInputAgentItems
                        }
                        disabled
                        horizontal
                      />
                    </div>

                    <div className={classes.formSubheading}>
                      <Typography
                        variant="subheading"
                        classes={{ subheading: classes.h3 }}
                      >
                        Property Information
                      </Typography>
                    </div>

                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <MaterialCustomSelectInput
                          field="invoiceType"
                          id={uuid()}
                          required
                          fullWidth
                          label="Invoice Type"
                          name="invoiceType"
                          selectInputItems={invoiceTypeSelectItems}
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="propertyAddress"
                          id={uuid()}
                          label="Property Address"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="state"
                          id={uuid()}
                          label="State"
                          required
                          fullWidth
                          disabled
                        />
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="city"
                          id={uuid()}
                          label="City"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="apartmentNumber"
                          id={uuid()}
                          label="Apartment Number"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>
                    {!choosingMgmtCoBrokeCompany ? (
                      <Grid item sm={6} xs={12}>
                        <div className={classes.formControlWrapper}>
                          <MaterialCustomSelectInput
                            field="managementOrCobrokeCompany"
                            id={uuid()}
                            required
                            fullWidth
                            label="Management/Co-Broke Company"
                            name="managementOrCobrokeCompany"
                            onChange={value => {
                              if (value === 'Add a new item...') {
                                toggleChoosingMgmtCoBrokeCompany(true);
                              }
                            }}
                            selectInputItems={
                              managementCobrokeCompanySelectItems
                            }
                            disabled={submittedInvoice && !isEditingInvoice}
                          />
                        </div>
                      </Grid>
                    ) : (
                      <Grid item sm={6} xs={12}>
                        <div className={classes.formControlWrapper}>
                          <TextField
                            id="newManagementOrCobrokeCompany"
                            label="Add Mgmt/Co-broke Company..."
                            value={newMgmtOrCobrokeCompany}
                            className={
                              classes.ManagementOrCobrokeCompanyTextField
                            }
                            onChange={handleMgmtOrCobrokeCompanyChange}
                            margin="normal"
                          />
                        </div>
                        <Button
                          classes={{ root: classes.removePaymentBtn }}
                          variant="raised"
                          color="secondary"
                          style={{ marginLeft: '0' }}
                          onClick={() => {
                            toggleChoosingMgmtCoBrokeCompany(false);
                            formApi.setValue('managementOrCobrokeCompany', '');
                          }}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          classes={{ root: classes.addPaymentBtn }}
                          variant="raised"
                          color="primary"
                          style={{ marginLeft: '10px', marginTop: '5px' }}
                          onClick={() => {
                            const trimmedItem = newMgmtOrCobrokeCompany.trim();
                            if (!newMgmtOrCobrokeCompany || !trimmedItem)
                              return;

                            const items = [
                              ...managementCobrokeCompanyItems,
                              ...addedManagementCompanies,
                            ];

                            const regex = new RegExp(trimmedItem, 'i');

                            const match = items.filter(item =>
                              item.match(regex)
                            );

                            if (match.length) {
                              toggleChoosingMgmtCoBrokeCompany(false);
                              formApi.setValue(
                                'managementOrCobrokeCompany',
                                match[0]
                              );
                              return;
                            }

                            setHasSetNewMgmtOrCobrokeCompany();
                            formApi.setValue(
                              'managementOrCobrokeCompany',
                              capitalize(newMgmtOrCobrokeCompany)
                            );
                          }}
                          type="button"
                        >
                          Add Item
                        </Button>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="price"
                          id={uuid()}
                          label="Rent or Sale Price"
                          required
                          fullWidth
                          noLetters
                          isDollarAmount
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>

                    <div className={classes.formSubheading}>
                      <Typography
                        variant="subheading"
                        classes={{ subheading: classes.h3 }}
                      >
                        {"Client's"} Information
                      </Typography>
                    </div>

                    <Grid item xs={12} sm={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="clientName"
                          id={uuid()}
                          label="Client's Name"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>

                    {/* <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomInputMask
                          mask="(999) 999-9999"
                          maskChar={null}
                          placeholder="Client's Phone Number"
                          disabled={submittedInvoice && !isEditingInvoice}
                          defaultValue={
                            isViewType && submittedInvoice
                              ? submittedInvoice.clientPhoneNumber
                              : undefined
                          }
                        >
                          {props => (
                            <CustomTextField
                              field="clientPhoneNumber"
                              id={uuid()}
                              label="Client's Phone Number"
                              fullWidth
                              required
                              type="tel"
                              isInputMasked
                              requiresDefaultOnChange
                              mask="(999) 999-9999"
                              {...props}
                              disabledStyle={
                                submittedInvoice && !isEditingInvoice
                              }
                            />
                          )}
                        </CustomInputMask>
                      </div>
                    </Grid> */}

                    <div
                      className={`${classes.formSubheading} ${
                        classes.paddingBottom10
                      }`}
                    >
                      <Typography
                        variant="subheading"
                        classes={{ subheading: classes.h3 }}
                      >
                        Transaction Financials
                      </Typography>
                    </div>

                    <div className={classes.formMiniHeading}>
                      <Typography
                        variant="subheading"
                        classes={{
                          subheading: classes.h4,
                          root: classes.greenText,
                        }}
                      >
                        Paid:
                      </Typography>
                    </div>

                    <NestedField field={['paymentItems', 0]}>
                      <Grid item sm={4} xs={12}>
                        <div className={classes.formControlWrapper}>
                          <MaterialCustomSelectInput
                            field="paymentType"
                            id={uuid()}
                            required
                            fullWidth
                            label="Payment Type"
                            name="paymentType"
                            selectInputItems={paymentTypeSelectItems}
                            validate={paymentTypeValidator}
                            disabled={submittedInvoice && !isEditingInvoice}
                          />
                        </div>
                      </Grid>

                      <Grid item sm={4} xs={12}>
                        <div className={classes.formControlWrapper}>
                          <CustomTextField
                            field="checkOrTransactionNumber"
                            id={uuid()}
                            label="Check/Transaction#"
                            required
                            fullWidth
                            validate={checkOrTransactionNumberValidator}
                            disabled={submittedInvoice && !isEditingInvoice}
                          />
                        </div>
                      </Grid>

                      <Grid item sm={4} xs={12}>
                        <div className={classes.formControlWrapper}>
                          <CustomTextField
                            field="amount"
                            id={uuid()}
                            label="Amount"
                            required
                            fullWidth
                            validate={paymentAmountValidator}
                            noLetters
                            noNegativeSign
                            onChangeWithID={
                              this.props.paymentAmountChangeHandler
                            }
                            isDollarAmount
                            disabled={submittedInvoice && !isEditingInvoice}
                          />
                        </div>
                      </Grid>
                    </NestedField>

                    {formApi.values.paymentItems &&
                      formApi.values.paymentItems
                        .map((paymentItems, i) => (
                          <div className={classes.paymentItemsWrapper} key={i}>
                            <NestedField field={['paymentItems', i]}>
                              <Grid item sm={4} xs={12}>
                                <div className={classes.formControlWrapper}>
                                  <MaterialCustomSelectInput
                                    field="paymentType"
                                    id={uuid()}
                                    required
                                    fullWidth
                                    label="Payment Type"
                                    name="paymentType"
                                    selectInputItems={paymentTypeSelectItems}
                                    validate={paymentTypeValidator}
                                    disabled={
                                      submittedInvoice && !isEditingInvoice
                                    }
                                  />
                                </div>
                              </Grid>

                              <Grid item sm={4} xs={12}>
                                <div className={classes.formControlWrapper}>
                                  <CustomTextField
                                    field="checkOrTransactionNumber"
                                    id={uuid()}
                                    label="Check/Transaction#"
                                    required
                                    fullWidth
                                    validate={checkOrTransactionNumberValidator}
                                    disabled={
                                      submittedInvoice && !isEditingInvoice
                                    }
                                  />
                                </div>
                              </Grid>

                              <Grid item sm={4} xs={12}>
                                <div className={classes.formControlWrapper}>
                                  <CustomTextField
                                    field="amount"
                                    id={uuid()}
                                    label="Amount"
                                    required
                                    fullWidth
                                    validate={paymentAmountValidator}
                                    noLetters
                                    noNegativeSign
                                    onChangeWithID={
                                      this.props.paymentAmountChangeHandler
                                    }
                                    isDollarAmount
                                    disabled={
                                      submittedInvoice && !isEditingInvoice
                                    }
                                  />
                                </div>
                              </Grid>
                            </NestedField>
                            <Button
                              classes={{ root: classes.removePaymentBtn }}
                              variant="raised"
                              color="secondary"
                              onClick={() => {
                                const amount = Number(
                                  formApi.values.paymentItems[i].amount
                                );

                                if (amount) {
                                  subtractPaymentValueFromState(amount);
                                }

                                formApi.removeValue('paymentItems', i);
                              }}
                              type="button"
                              disabled={submittedInvoice && !isEditingInvoice}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                        .slice(1)}
                    <Grid item xs={12}>
                      <Button
                        classes={{ root: classes.addPaymentBtn }}
                        variant="raised"
                        color="primary"
                        onClick={() => formApi.addValue('paymentItems')}
                        type="button"
                        disabled={submittedInvoice && !isEditingInvoice}
                      >
                        Add invoice item
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="financialsTotal"
                          id={uuid()}
                          label="Total"
                          disabled
                          fullWidth
                          labelClassName={classes.finalTotalLabelClass}
                          submittedValue={`${this.props.total}`}
                          formApi={formApi}
                          convertToLocaleString
                          isDollarAmount
                          inputRootClassName={classes.finalTotalInputClass}
                        />
                      </div>
                    </Grid>

                    <div
                      className={`${classes.formSubheading} ${
                        classes.paddingBottom10
                      }`}
                    >
                      <Typography
                        variant="subheading"
                        classes={{ subheading: classes.h3 }}
                      >
                        Send To
                      </Typography>
                    </div>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="attention"
                          id={uuid()}
                          label="Attention"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="attentionEmail"
                          id={uuid()}
                          label="Email"
                          type="email"
                          required
                          fullWidth
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>

                    <div className={classes.formMiniHeading2}>
                      <Typography
                        variant="subheading"
                        classes={{ subheading: classes.h4 }}
                      >
                        Other:
                      </Typography>
                    </div>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="agentNotes"
                          id={uuid()}
                          label="Notes"
                          fullWidth
                          multiline
                          placeholder="Leave any notes here..."
                          disabled={submittedInvoice && !isEditingInvoice}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Form>
        ) : null}

        {submittingFormToServer ? (
          <div className={classes.formSubmittingWrapper}>
            <Icon type="loading" style={{ color: '#000', fontSize: '4rem' }} />
            <div className={classes.progressBarExplanation}>
              Submitting form...
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(SubmitInvoiceForm);
