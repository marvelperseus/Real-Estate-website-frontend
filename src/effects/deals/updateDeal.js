import { graphQlClient } from '../client';

const query = `
  mutation updateDeal($input: UpdateDealInput!) {
    updateDeal(input: $input) {
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
      }
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const updateDeal = values => {
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
      console.log(res);

      const { updateDeal: data } = res;
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

export default updateDeal;
