import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BounceLoader } from 'react-spinners';
import SubmitDealForm from '../components/forms/SubmitDealForm';
import getDealUploadsSignedURLS from '../effects/deals/getDealUploadsSignedURLS';
import uploadFile from '../effects/uploadFile';
import submitDeal from '../effects/deals/submitDeal';
import { capitalize } from '../utils/stringUtils';

const Loader = BounceLoader;

export const dealFormQuery = gql`
  query dealForm($uuid: String) {
    dealForm(uuid: $uuid) {
      agent {
        firstName
        lastName
        role
        agent {
          agentType
          state
          ACHAccountNumber
          ACHAccountBankRoutingNumber
        }
      }
      agents {
        firstName
        lastName
        uuid
      }
      formSelectItems
    }
  }
`;

@observer
class SubmitDealFormContainer extends Component {
  state = {
    paymentAmountItems: {},
    deductionAmountItems: {},
    paymentsTotal: 0,
    deductionsTotal: 0,
    total: 0,
    contractOrLeaseForms: [],
    agencyDisclosureForm: null,
    permanentPaymentSubtractions: 0, // not submitted
    permanentDeductionSubtractions: 0, // not submitted
    choosingMgmtCoBrokeCompany: false,
    newMgmtOrCobrokeCompany: '',
    hasSetNewMgmtOrCobrokeCompany: false,
    addedManagementCompanies: [],
    uplodingFileProgress: 0,
    isUploadingFile: false,
    uplodingFileText: '',
    filesUploadedSuccessfully: null,
    formSubmissionBegun: false,
    submittingFormToServer: false,
    agentPaymentTypeIsACH: false,
  };

  uploadItemsNum = 0;

  itemsUploaded = 0;

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
      paymentsTotal,
      total: paymentsTotal - this.state.deductionsTotal,
    });
  };

  deductionAmountChangeHandler = (id, value) => {
    value = Number(value);
    const deductionsTotal = this.getTotalDeductionsAmount({
      id,
      value: value || 0,
    });
    this.setState({
      deductionAmountItems: {
        ...this.state.deductionAmountItems,
        [id]: value || 0,
      },
      deductionsTotal,
      total: this.state.paymentsTotal - deductionsTotal,
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

  getTotalDeductionsAmount = newItem => {
    let total = 0;
    const { deductionAmountItems, permanentDeductionSubtractions } = this.state;

    Object.keys(deductionAmountItems)
      .filter(itemID => (newItem ? itemID !== newItem.id : true))
      .forEach(key => {
        total += deductionAmountItems[key];
      });

    if (newItem && newItem.value) total += newItem.value;

    return total - permanentDeductionSubtractions;
  };

  subtractPaymentValueFromState = payment => {
    const paymentsTotal = this.getTotalPaymentsAmount() - payment;

    this.setState({
      permanentPaymentSubtractions:
        this.state.permanentPaymentSubtractions + payment,
      paymentsTotal,
      total: paymentsTotal - this.state.deductionsTotal,
    });
  };

  subtractDeductionValueFromState = deduction => {
    const deductionsTotal = this.getTotalDeductionsAmount() - deduction;

    this.setState({
      permanentDeductionSubtractions:
        this.state.permanentDeductionSubtractions + deduction,
      deductionsTotal,
      total: this.state.paymentsTotal - deductionsTotal,
    });
  };

  setAgencyDisclosureForm = file => {
    this.setState({ agencyDisclosureForm: file });
  };

  setContractOrLeaseForms = filesObject => {
    if (Array.isArray(filesObject)) {
      this.setState({ contractOrLeaseForms: filesObject });
      if (filesObject.length === 0) {
        const uploadBtn = document.getElementById(
          'contractOrLeaseItemsUploadForm'
        );
        if (uploadBtn) {
          uploadBtn.value = null;
        }
      }
      return;
    }
    const fileArray = Object.keys(filesObject).map(key => filesObject[key]);
    this.setState({ contractOrLeaseForms: fileArray });
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

  onAgentPaymentTypeChange = ({ target }) => {
    const { value } = target;
    const isACH = value === 'Please ACH me';
    if (isACH) {
      this.setState({ agentPaymentTypeIsACH: true });
    } else {
      this.setState({ agentPaymentTypeIsACH: false });
    }
  };

  onSubmit = values => {
    this.props.setFormSubmitted();

    const {
      contractOrLeaseForms,
      agencyDisclosureForm,
      addedManagementCompanies,
      paymentsTotal,
      deductionsTotal,
      total,
    } = this.state;

    const returnObject = {
      ...values,
      addedManagementCompanies,
      paymentsTotal,
      deductionsTotal,
      total,
      agencyDisclosureForm: null,
      contractOrLeaseForms: [],
      dealID: null,
    };

    delete returnObject.contractOrLeaseItems;
    delete returnObject.deductionsSubtotal;
    delete returnObject.paymentsSubtotal;
    delete returnObject.financialsTotal;
    delete returnObject.date;
    delete returnObject.agent;
    delete returnObject.agentType;
    delete returnObject.state;
    returnObject.price = Number(returnObject.price);
    returnObject.paymentItems = returnObject.paymentItems.map(item => ({
      ...item,
      amount: Number(item.amount),
    }));
    // logic for handling null vlues of checktransaction number
    for(var i = 0 ; i < returnObject.paymentItems.length; i++ ){
    if(returnObject.paymentItems[i].checkOrTransactionNumber == null){
      returnObject.paymentItems[i].checkOrTransactionNumber = "";
      };
    }
   

    returnObject.deductionItems = returnObject.deductionItems.map(item => ({
      ...item,
      amount: Number(item.amount),
    }));

    const uploadItems = [
      {
        itemName: 'agencyDisclosureForm',
        fileName: agencyDisclosureForm.name,
        fileType: agencyDisclosureForm.type,
      },
    ];

    if (contractOrLeaseForms && contractOrLeaseForms.length) {
      contractOrLeaseForms.forEach((file, i) => {
        uploadItems.push({
          itemName: `contractOrLeaseForm${i}`,
          fileName: file.name,
          fileType: file.type,
        });
      });
    }

    getDealUploadsSignedURLS(uploadItems).then(response => {
      if (response.error) {
        this.props.openRequestErrorSnackbar(response.error);
        this.props.setFormSubmitted(false);
        return;
      }

      const errors = [];

      const { items, dealID } = response;

      returnObject.dealID = dealID;

      items.forEach(item => {
        if (item.error) errors.push(item.error);
      });

      if (errors.length) {
        this.props.openRequestErrorSnackbar(errors[0]);
        this.props.setFormSubmitted(false);
        return;
      }

      this.uploadItemsNum = items.length;

      const recursiveUploads = (items, returnObject, thisRef) => {
        const uploadItemsNum = items.length;
        const uploadItemIndex = 0;
        recursiveHelper(
          items,
          uploadItemIndex,
          uploadItemsNum,
          returnObject,
          thisRef
        );
      };

      const recursiveHelper = (
        items,
        uploadItemIndex,
        uploadItemsNum,
        returnObject,
        thisRef
      ) => {
        if (uploadItemIndex >= items.length) {
          thisRef.setState({
            isUploadingFile: false,
            uplodingFileProgress: 0,
            filesUploadedSuccessfully: true,
            submittingFormToServer: true,
          });

          submitDeal(returnObject)
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
                this.props.setDealSuccessfullySubmitted(res.deal);
              }

              this.setState({
                submittingFormToServer: false,
              });

              this.props.setFormSubmitted(false);
            })
            .catch(err => {
              this.setState({
                submittingFormToServer: false,
              });
              this.props.setFormSubmitted(false);
              this.props.openRequestErrorSnackbar();
            });
          return;
        }

        const item = items[uploadItemIndex];

        let file;
        let fileIndex;

        if (item.itemName === 'agencyDisclosureForm') {
          file = thisRef.state.agencyDisclosureForm;
          returnObject.agencyDisclosureForm = item.fileName;
        } else {
          fileIndex = item.itemName.slice(-1);
          file = thisRef.state.contractOrLeaseForms[fileIndex];
          returnObject.contractOrLeaseForms.push(item.fileName);
        }

        uploadFile({
          file,
          url: item.signedURL,
          onUploadProgress: progressEvent => {
            // Do whatever you want with the native progress event
            const loadedPercent = (progressEvent.loaded / progressEvent.total) * 100;

            thisRef.setState({
              formSubmissionBegun: true,
              uplodingFileProgress: Math.floor(loadedPercent),
              uplodingFileText: `Now uploading file ${uploadItemIndex
                + 1} of ${uploadItemsNum}...`,
              isUploadingFile: true,
            });
          },
        })
          .then(res => {
            const status = `${res.status}`;
            const okRegex = /^[2][0-9][0-9]$/;

            if (!okRegex.test(status)) {
              this.setState({
                submittingFormToServer: false,
                isUploadingFile: false,
              });
              this.props.setFormSubmitted(false);
              this.props.openRequestErrorSnackbar(
                'There was an error uploading your files. Please try again shortly.'
              );
              return;
            }

            return recursiveHelper(
              items,
              uploadItemIndex + 1,
              uploadItemsNum,
              returnObject,
              thisRef
            );
          })
          .catch(err => {
            this.setState({
              submittingFormToServer: false,
              isUploadingFile: false,
            });
            this.props.setFormSubmitted(false);
            this.props.openRequestErrorSnackbar();
          });
      };

      recursiveUploads(items, returnObject, this);
    });
  };

  onSubmitFailure = (errs, onSubmitError, formApi) => {
    console.log(errs);
    console.log(onSubmitError);
    console.log(formApi.errors);
  };

  render() {
    const { userUUID: uuid, ...rest } = this.props;
    const { agencyDisclosureForm, contractOrLeaseForms } = this.state;

    return (
      <Query query={dealFormQuery} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader color="#f44336" loading />
              </div>
            );
          }

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const { agent, agents, formSelectItems } = data.dealForm;

          return (
            <SubmitDealForm
              paymentsTotal={`${this.state.paymentsTotal}`}
              deductionsTotal={`${this.state.deductionsTotal}`}
              total={this.state.total}
              agent={agent}
              agents={agents.filter(agent => agent.uuid !== uuid)}
              managementCobrokeCompanyItems={formSelectItems || []}
              onSubmit={this.onSubmit}
              setAgencyDisclosureForm={this.setAgencyDisclosureForm}
              setContractOrLeaseForms={this.setContractOrLeaseForms}
              agencyDisclosureForm={agencyDisclosureForm}
              contractOrLeaseForms={contractOrLeaseForms}
              paymentAmountChangeHandler={this.paymentAmountChangeHandler}
              addedManagementCompanies={this.state.addedManagementCompanies}
              newMgmtOrCobrokeCompany={this.state.newMgmtOrCobrokeCompany}
              uplodingFileProgress={this.state.uplodingFileProgress}
              isUploadingFile={this.state.isUploadingFile}
              uplodingFileText={this.state.uplodingFileText}
              formSubmissionBegun={this.state.formSubmissionBegun}
              submittingFormToServer={this.state.submittingFormToServer}
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
              deductionAmountChangeHandler={this.deductionAmountChangeHandler}
              subtractPaymentValueFromState={this.subtractPaymentValueFromState}
              subtractDeductionValueFromState={
                this.subtractDeductionValueFromState
              }
              agentPaymentTypeIsACH={this.state.agentPaymentTypeIsACH}
              onAgentPaymentTypeChange={this.onAgentPaymentTypeChange}
              {...rest}
            />
          );
        }}
      </Query>
    );
  }
}

export default SubmitDealFormContainer;
