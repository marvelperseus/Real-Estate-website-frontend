import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BounceLoader } from 'react-spinners';
import SubmitInvoiceForm from '../components/forms/SubmitInvoiceForm';
import updateInvoice from '../effects/invoices/updateInvoice';
import { capitalize } from '../utils/stringUtils';

const Loader = BounceLoader;

const viewInvoiceFormQuery = gql`
  query viewInvoiceForm($uuid: String!) {
    viewInvoiceForm(uuid: $uuid) {
      formSelectItems
      invoice {
        invoiceID
        date
        agentName
        agentType
        invoiceType
        propertyAddress
        state
        city
        apartmentNumber
        managementOrCobrokeCompany
        price
        clientName
        paymentItems {
          paymentType
          checkOrTransactionNumber
          amount
        }
        total
        agentNotes
        attention
        attentionEmail
      }
    }
  }
`;

@observer
class ViewInvoiceFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentAmountItems: {},
      total: 0,
      permanentPaymentSubtractions: 0,
      choosingMgmtCoBrokeCompany: false,
      newMgmtOrCobrokeCompany: '',
      hasSetNewMgmtOrCobrokeCompany: false,
      addedManagementCompanies: [],
      formSubmissionBegun: false,
      submittingFormToServer: false,
    };
  }

  totalPayments = 0;

  paymentAmountChangeHandler = (id, value) => {
    value = Number(value);
    const paymentsTotal = this.getTotalPaymentsAmount({
      id,
      value: value || 0,
    });
    this.setState({
      paymentAmountItems: {
        ...this.state.paymentAmountItems,
        [id]: value || 0,
      },
      total: paymentsTotal,
    });
  };

  getTotalPaymentsAmount = newItem => {
    let total = 0;
    const { paymentAmountItems, permanentPaymentSubtractions } = this.state;

    Object.keys(paymentAmountItems)
      .filter(itemID => (newItem ? itemID !== newItem.id : true))
      .forEach(key => {
        total += paymentAmountItems[key];
      });

    if (newItem && newItem.value) total += newItem.value;

    return total - permanentPaymentSubtractions;
  };

  subtractPaymentValueFromState = payment => {
    const paymentsTotal = this.getTotalPaymentsAmount() - payment;

    this.setState({
      permanentPaymentSubtractions:
        this.state.permanentPaymentSubtractions + payment,
      total: paymentsTotal,
    });
  };

  handleMgmtOrCobrokeCompanyChange = event => {
    this.setState({
      newMgmtOrCobrokeCompany: event.target.value,
    });
  };

  toggleChoosingMgmtCoBrokeCompany = bool => {
    const { choosingMgmtCoBrokeCompany } = this.state;
    this.setState({
      choosingMgmtCoBrokeCompany:
        typeof bool === 'boolean' ? bool : !choosingMgmtCoBrokeCompany,
      newMgmtOrCobrokeCompany: '',
    });
  };

  setHasSetNewMgmtOrCobrokeCompany = bool => {
    const { addedManagementCompanies, newMgmtOrCobrokeCompany } = this.state;
    this.setState({
      choosingMgmtCoBrokeCompany: false,
      hasSetNewMgmtOrCobrokeCompany: true,
      newMgmtOrCobrokeCompany: '',
      addedManagementCompanies: [
        ...addedManagementCompanies,
        capitalize(newMgmtOrCobrokeCompany.trim()),
      ],
    });
  };

  setInitialContainerState = ({ total }) => {
    this.setState({
      total,
    });
  };

  onSubmit = values => {
    this.props.setFormSubmitted();

    const { addedManagementCompanies, total } = this.state;

    const returnObject = {
      ...values,
      addedManagementCompanies,
      total,
      invoiceID: this.props.invoiceID,
    };

    delete returnObject.date;
    delete returnObject.agent;
    delete returnObject.agentType;
    delete returnObject.state;
    delete returnObject.financialsTotal;

    returnObject.price = Number(returnObject.price);
    returnObject.paymentItems = returnObject.paymentItems.map(item => ({
      ...item,
      amount: Number(item.amount),
    }));

    this.setState({
      formSubmissionBegun: true,
      submittingFormToServer: true,
    });

    updateInvoice(returnObject)
      .then(res => {
        let failed = false;

        if (res.otherError) {
          this.props.openRequestErrorSnackbar(res.otherError);
          failed = true;
        }

        if (res.userErrors.length) {
          failed = true;
        }

        if (!failed) {
          this.props.setInvoiceSuccessfullySubmitted(res.invoice);
        }

        this.setState({
          submittingFormToServer: false,
        });

        this.props.setFormSubmitted(false);
      })
      .catch(err => {
        this.props.setFormSubmitted(false);
        this.props.openRequestErrorSnackbar();
      });

    console.log(returnObject);
  };

  onSubmitFailure = (errs, onSubmitError, formApi) => {
    console.log(errs);
    console.log(onSubmitError);
    console.log(formApi.errors);
  };

  render() {
    const {
      userUUID: uuid,
      invoiceID,
      isEditingInvoice,
      isViewType,
      ...rest
    } = this.props;

    return (
      <Query
        query={viewInvoiceFormQuery}
        variables={{ uuid: invoiceID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          console.log(data);
          if (loading)
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader color="#f44336" loading />
              </div>
            );

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const {
            invoice: submittedInvoice,
            formSelectItems,
          } = data.viewInvoiceForm;

          return (
            <SubmitInvoiceForm
              deductionsTotal={`${this.state.deductionsTotal}`}
              total={this.state.total}
              submittedInvoice={submittedInvoice}
              managementCobrokeCompanyItems={formSelectItems || []}
              onSubmit={this.onSubmit}
              paymentAmountChangeHandler={this.paymentAmountChangeHandler}
              subtractPaymentValueFromState={this.subtractPaymentValueFromState}
              addedManagementCompanies={this.state.addedManagementCompanies}
              newMgmtOrCobrokeCompany={this.state.newMgmtOrCobrokeCompany}
              isEditingInvoice={isEditingInvoice}
              isViewType={isViewType}
              setHasSetNewMgmtOrCobrokeCompany={
                this.setHasSetNewMgmtOrCobrokeCompany
              }
              toggleChoosingMgmtCoBrokeCompany={
                this.toggleChoosingMgmtCoBrokeCompany
              }
              handleMgmtOrCobrokeCompanyChange={
                this.handleMgmtOrCobrokeCompanyChange
              }
              choosingMgmtCoBrokeCompany={this.state.choosingMgmtCoBrokeCompany}
              {...rest}
              formSubmissionBegun={this.state.formSubmissionBegun}
              submittingFormToServer={
                this.state.submittingFormToServer ||
                this.props.submittingRequestToServer
              }
            />
          );
        }}
      </Query>
    );
  }
}

export default ViewInvoiceFormContainer;
