import { graphQlClient } from '../../../effects/client';

const query = `
    mutation registerCustomer($input: RegisterCustomerInput!) {
      registerCustomer(input: $input) {
        customer {
          uuid
          role
        }
        wasSuccessful
        userErrors {
          field
          message
        }
      }
    }
  `;

async function signUpCustomer(self, values) {
  let response;
  let error;

  const variables = {
    input: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    },
  };

  const finalResponseObj = {
    response,
    error,
  };

  return graphQlClient
    .request(query, variables)
    .then(res => {
      const { registerCustomer: data } = res;
      const { customer } = data;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.userErrors.length
          ? data.userErrors[0].message
          : data.otherError;
      }

      if (!finalResponseObj.error) {
        self.setUser(customer);
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
}

export default signUpCustomer;
