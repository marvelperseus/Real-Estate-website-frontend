import { graphQlClient } from '../client';

const query = `
  mutation acceptDeal($input: AcceptDealInput!) {
    acceptDeal(input: $input) {
      deal {
        dealID
        date
        agentName
        agentType
        leadSource
        dealType
        propertyAddress
        state
        city
        apartmentNumber
        managementOrCobrokeCompany
        price
        clientName
        clientEmail
        paymentsTotal
        deductionsTotal
        total
        agentNotes
        status
        bonusPercentageAddedByAdmin
        netAgentCommission
        netCompanyCommission
      }
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const acceptDeal = (dealID, bonusPercentageAddedByAdmin, userUUID) => {
  let res;

  const variables = {
    input: {
      uuid: dealID,
      bonusPercentageAddedByAdmin,
      userUUID,
    },
  };

  const finalResponseObj = {
    deal: null,
    otherError: null,
    userErrors: [],
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { acceptDeal: data } = res;
      const { deal, otherError, userErrors } = data;

      if (userErrors && userErrors.length) {
        finalResponseObj.userErrors = userErrors;
      }

      if (otherError) {
        finalResponseObj.otherError = otherError;
      }

      if (!finalResponseObj.error && !finalResponseObj.userErrors.length) {
        finalResponseObj.deal = deal;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default acceptDeal;
