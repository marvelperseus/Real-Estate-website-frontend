import { graphQlClient } from '../client';

const query = `
  mutation updateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
      invoice {
        invoiceID
        date
        invoiceType
        clientName
        propertyAddress
        city
        managementOrCobrokeCompany
        price
      }
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const updateInvoice = values => {
  let res;

  const variables = {
    input: values,
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

      const { updateInvoice: data } = res;
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

export default updateInvoice;
