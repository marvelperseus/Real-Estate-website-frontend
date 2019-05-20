import * as emailValidator from 'email-validator';

const dollarAmountOnlyRegex = /^[0-9]+(\.[0-9][0-9])?$/;

const validator = values => {
  return {
    date: !values.date ? 'This value is required' : null,
    agent: !values.agent ? 'This value is required' : null,
    agentType: !values.agentType ? 'This value is required' : null,
    dealType: !values.dealType ? 'This value is required' : null,
    propertyAddress: !values.propertyAddress ? 'This value is required' : null,
    city: !values.city ? 'This value is required' : null,
    state: !values.state ? 'This value is required' : null,
    apartmentNumber: !values.apartmentNumber ? 'This value is required' : null,
    managementOrCobrokeCompany: !values.managementOrCobrokeCompany
      ? 'This value is required'
      : null,
    price:
      !values.price || !dollarAmountOnlyRegex.test(values.price)
        ? 'This value is required and must be a dollar amount'
        : null,
    clientName:
      !values.clientName ||
      values.clientName.length < 3 ||
      values.clientName.length > 80
        ? 'Between 3 and 80 characters'
        : null,
    clientEmail:
      !values.clientEmail ||
      !emailValidator.validate(values.clientEmail) ||
      values.clientEmail.length > 60
        ? 'Please provide a valid email address that is less than 60 characters'
        : null,
    agentPaymentType: !values.agentPaymentType
      ? 'This value is required'
      : null,
    fundsPaidBy: !values.fundsPaidBy ? 'This value is required' : null,
    alreadyTurnedFundsIn: !values.alreadyTurnedFundsIn
      ? 'This value is required'
      : null,
    shouldSendApprovalTextMessageNotificaion: !values.shouldSendApprovalTextMessageNotificaion
      ? 'This value is required'
      : null,
    financialsTotal:
      values.financialsTotal <= 0
        ? 'The total amount for this deal must be greater than 0'
        : null,
    agencyDisclosureForm: !values.agencyDisclosureForm
      ? 'This value is required and must be either JPEG/JPG or PDF format'
      : null,
  };
};

export default validator;
