import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { BounceLoader } from 'react-spinners';
import SubmitListingForm from '../components/forms/SubmitListingForm';
import getListingUploadsSignedURLS from '../effects/listings/getListingUploadsSignedURLS';
import uploadFile from '../effects/uploadFile';
import updateListing from '../effects/listings/updateListing';
import { capitalize } from '../utils/stringUtils';
import { admin, superAdmin } from '../constants/userTypes';

const Loader = BounceLoader;

const viewListingFormQuery = gql`
  query viewListingForm($uuid: String!) {
    viewListingForm(uuid: $uuid) {
      formSelectItems
      listing {
        listingID
        agentID
        agentName
        offer
        address
        region
        neighborhood
        borough
        description
        price
        images
        category
        ownership
        type
        petPolicy
        floors
        unitCount
        builtIn
        approx
        condoOwn {
          minimumDownPayment
          tax
          maintenanceFee
        }
        cooperativeOwn {
          maintenanceFee
        }
        amenities
        coordinates
        sqFootage
        moveInDate
        beds
        baths
      }
    }
  }
`;

@observer
class ViewListingFormContainer extends Component {
  state = {
    paymentAmountItems: {},
    deductionAmountItems: {},
    paymentsTotal: 0,
    deductionsTotal: 0,
    total: 0,
    imagesForms: [],
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
    dealBonus: '0',
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
    if (!file) {
      const uploadBtn = document.getElementById('agencyDisclosureUploadForm');
      if (uploadBtn) {
        uploadBtn.value = null;
      }
    }
  };

  setImagesForms = filesObject => {
    if (Array.isArray(filesObject)) {
      this.setState({ imagesForms: filesObject });
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
    this.setState({ imagesForms: fileArray });
  };

  onSubmit = values => {
    const {
      setFormSubmitted,
      listingID,
      userRole,
      openRequestErrorSnackbar,
      setListingSuccessfullySubmitted,
    } = this.props;
    setFormSubmitted();

    const {
      imagesForms,
      agencyDisclosureForm,
      addedManagementCompanies,
      hasSetNewMgmtOrCobrokeCompany,
      paymentsTotal,
      deductionsTotal,
      total,
    } = this.state;

    const returnObject = {
      ...values,
      images: [],
      listingID,
    };

    delete returnObject.contractOrLeaseItems;
    delete returnObject.deductionsSubtotal;
    delete returnObject.paymentsSubtotal;
    delete returnObject.financialsTotal;
    delete returnObject.date;
    delete returnObject.agent;
    delete returnObject.agentType;
    delete returnObject.state;
    delete returnObject.agentPaymentTypeCoBroke;
    delete returnObject.ACHAccountNumberCoBroke;
    delete returnObject.ACHAccountBankRoutingNumberCoBroke;

    returnObject.price = Number(returnObject.price);

    const uploadItems = [];

    if (imagesForms && imagesForms.length) {
      imagesForms.forEach((file, i) => {
        uploadItems.push({
          itemName: `imageForm${i}`,
          fileName: file.name,
          fileType: file.type,
        });
      });
    }

    if (!uploadItems.length) {
      this.setState({
        submittingFormToServer: true,
      });

      updateListing(returnObject)
        .then(res => {
          let failed = false;

          if (res.otherError) {
            openRequestErrorSnackbar(res.otherError);
            failed = true;
          }

          if (res.userErrors.length) {
            failed = true;
          }

          if (!failed) {
            setListingSuccessfullySubmitted(res.listing);
          }

          this.setState({
            submittingFormToServer: false,
          });

          setFormSubmitted(false);
        })
        .catch(err => {
          setFormSubmitted(false);
          openRequestErrorSnackbar();
        });
      return;
    }

    getListingUploadsSignedURLS(uploadItems, listingID).then(response => {
      if (response.error) {
        openRequestErrorSnackbar(response.error);
        return;
      }

      const errors = [];

      const { items } = response;

      returnObject.listingID = listingID;

      items.forEach(item => {
        if (item.error) errors.push(item.error);
      });

      if (errors.length) {
        openRequestErrorSnackbar(errors[0]);
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

          updateListing(returnObject)
            .then(res => {
              let failed = false;
              console.log(res);
              if (res.otherError) {
                openRequestErrorSnackbar(res.otherError);
                failed = true;
              }

              if (res.userErrors.length) {
                failed = true;
              }

              if (!failed) {
                setListingSuccessfullySubmitted(res.listing);
              }
              setFormSubmitted(false);
            })
            .catch(err => {
              console.log(err);
              setFormSubmitted(false);
              openRequestErrorSnackbar();
            });

          return;
        }

        const item = items[uploadItemIndex];

        let file;
        let fileIndex;

        fileIndex = item.itemName.slice(-1);
        file = thisRef.state.imagesForms[fileIndex];
        returnObject.images.push(item.fileName);

        uploadFile({
          file,
          url: item.signedURL,
          onUploadProgress: progressEvent => {
            // Do whatever you want with the native progress event
            const loadedPercent =
              progressEvent.loaded / progressEvent.total * 100;

            thisRef.setState({
              formSubmissionBegun: true,
              uplodingFileProgress: Math.floor(loadedPercent),
              uplodingFileText: `Now uploading file ${uploadItemIndex +
                1} of ${uploadItemsNum}...`,
              isUploadingFile: true,
            });
          },
        })
          .then(() =>
            recursiveHelper(
              items,
              uploadItemIndex + 1,
              uploadItemsNum,
              returnObject,
              thisRef
            )
          )
          .catch(err => {
            console.log(err);
            openRequestErrorSnackbar();
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
    const {
      userUUID,
      listingID,
      isEditingListing,
      isViewType,
      ...rest
    } = this.props;
    const { imagesForms } = this.state;

    return (
      <Query
        query={viewListingFormQuery}
        variables={{ uuid: listingID }}
        fetchPolicy="cache-and-network"
      >
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
          const {
            listing,
            agents: agentItems,
            formSelectItems,
          } = data.viewListingForm;
          const agents = agentItems || [];
          return (
            <SubmitListingForm
              total={this.state.total}
              submittedListing={listing}
              managementCobrokeCompanyItems={formSelectItems || []}
              onSubmit={this.onSubmit}
              setImagesForms={this.setImagesForms}
              imagesForms={imagesForms}
              uplodingFileProgress={this.state.uplodingFileProgress}
              isUploadingFile={this.state.isUploadingFile}
              uplodingFileText={this.state.uplodingFileText}
              formSubmissionBegun={this.state.formSubmissionBegun}
              submittingFormToServer={
                this.state.submittingFormToServer ||
                this.props.submittingRequestToServer
              }
              isEditingListing={isEditingListing}
              isViewType={isViewType}
              userRole={this.props.userRole}
              {...rest}
            />
          );
        }}
      </Query>
    );
  }
}

export default ViewListingFormContainer;
