import { graphQlClient } from '../client';

const query = `
  mutation submitDeal($input: SubmitDealInput!) {
    submitDeal(input: $input) {
      deal {
        dealID
        date
        dealType
        clientName
        clientEmail
        propertyAddress
        city
        managementOrCobrokeCompany
        price
        status
        total
      }
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const submitDeal = values => {
  let res;

  const variables = {
    input: values,
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

      const { submitDeal: data } = res;
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

export default submitDeal;
