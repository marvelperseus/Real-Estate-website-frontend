import { graphQlClient } from '../client';

const query = `
    mutation userForgotPassword($email: String!) {
      userForgotPassword(email: $email) {
        wasSuccessful
        userErrors {
          field
          message
        }
      }
    }
  `;

const createAgent = email => {
  const variables = {
    email,
  };

  const finalResponseObj = {
    error: null,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      const res = result;

      const { userForgotPassword: data } = res;

      if (data.userErrors.length) {
        finalResponseObj.error = {
          message: data.userErrors[0].message,
          field: data.userErrors[0].field,
        };
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default createAgent;
