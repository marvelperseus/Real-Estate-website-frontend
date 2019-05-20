import * as emailValidator from 'email-validator';

const dollarAmountOnlyRegex = /^[0-9]+(\.[0-9][0-9])?$/;

const validator = values => {
  return {
    // date: !values.date ? 'This value is required' : null,
    // agent: !values.agent ? 'This value is required' : null,
    // agentType: !values.agentType ? 'This value is required' : null,
    type: !values.type ? 'This value is required' : null,
    category: !values.category ? 'This value is required' : null,
    region: !values.region ? 'This value is required' : null,
    neighborhood: !values.neighborhood ? 'This value is required' : null,
    borough: !values.borough ? 'This value is required' : null,
    ownership: !values.ownership ? 'This value is required' : null,
    petPolicy: !values.petPolicy ? 'This value is required' : null,
    price: !values.price ? 'This value is required' : null,
    amenities: !values.amenities ? 'This value is required' : null,
    // price:
    //   !values.price || !dollarAmountOnlyRegex.test(values.price)
    //     ? 'This value is required and must be a dollar amount'
    //     : null,
    // clientName:
    //   !values.clientName ||
    //   values.clientName.length < 3 ||
    //   values.clientName.length > 80
    //     ? 'Between 3 and 80 characters'
    //     : null,
    // clientEmail:
    //   !values.clientEmail ||
    //   !emailValidator.validate(values.clientEmail) ||
    //   values.clientEmail.length > 60
    //     ? 'Please provide a valid email address that is less than 60 characters'
    //     : null,
    // agentPaymentType: !values.agentPaymentType
    //   ? 'This value is required'
    //   : null,
    // fundsPaidBy: !values.fundsPaidBy ? 'This value is required' : null,
    // alreadyTurnedFundsIn: !values.alreadyTurnedFundsIn
    //   ? 'This value is required'
    //   : null,
    // shouldSendApprovalTextMessageNotification: !values.shouldSendApprovalTextMessageNotification
    //   ? 'This value is required'
    //   : null,
    // financialsTotal:
    //   !values.financialsTotal ||
    //   parseFloat(values.financialsTotal.split(',').join('')) <= 0
    //     ? 'The total amount for this deal must be greater than 0'
    //     : null,
  };
};

// export const agencyDisclosureFormValidator = value => ({
//   error: !value
//     ? 'This value is required and must be either JPEG/JPG or PDF format'
//     : null,
// });

// export const paymentTypeValidator = value => ({
//   error: !value ? 'This value is required' : null,
// });

// export const checkOrTransactionNumberValidator = value => ({
//   error: !value ? null : null, // changes for making it not req
// });

// export const ACHAccountNumberValidator = value => ({
//   error: !value ? 'This value is required' : null,
// });

// export const paymentAmountValidator = value => ({
//   error:
//     !value || !dollarAmountOnlyRegex.test(value)
//       ? 'This value is required and must be a dollar amount'
//       : null,
// });

// export const deductionTypeValidator = value => ({
//   error: !value ? 'This value is required' : null,
// });

// export const descriptionValidator = value => ({
//   error: !value ? 'This value is required' : null,
// });

// export const deductionsAmountValidator = value => ({
//   error:
//     !value || !dollarAmountOnlyRegex.test(value)
//       ? 'This value is required and must be a dollar amount'
//       : null,
// });

export default validator;
