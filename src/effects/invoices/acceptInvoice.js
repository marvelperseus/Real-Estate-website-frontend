import { graphQlClient } from '../client';

const query = `
  mutation acceptInvoice($uuid: String!) {
    acceptInvoice(uuid: $uuid) {
      invoice {
        invoiceID
        date
        agentType
        agentName
        invoiceType
        clientName
        propertyAddress
        city
        state
        managementOrCobrokeCompany
        price
        total
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

const acceptInvoice = uuid => {
  let res;

  const variables = {
    uuid,
  };

  const finalResponseObj = {
    invoice: null,
    otherError: null,
    userErrors: [],
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { acceptInvoice: data } = res;
      const { invoice, otherError, userErrors } = data;

      if (userErrors && userErrors.length) {
        finalResponseObj.userErrors = userErrors;
      }

      if (otherError) {
        finalResponseObj.otherError = otherError;
      }

      if (!finalResponseObj.error && !finalResponseObj.userErrors.length) {
        finalResponseObj.invoice = invoice;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default acceptInvoice;
