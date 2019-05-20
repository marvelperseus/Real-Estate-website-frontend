import { graphQlClient } from '../client';

const query = `
    mutation resetPassword($input: ResetPasswordInput!) {
      resetPassword(input: $input) {
        wasSuccessful
        userErrors {
          field
          message
        }
      }
    }
  `;

const resetPassword = input => {
  const variables = {
    input,
  };

  const finalResponseObj = {
    error: null,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      const res = result;

      const { resetPassword: data } = res;

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

export default resetPassword;
