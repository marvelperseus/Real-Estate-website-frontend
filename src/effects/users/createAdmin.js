import { graphQlClient } from '../client';

const query = `
    mutation createAdmin($input: CreateAdminInput!) {
      createAdmin(input: $input) {
        admin {
          uuid
          role
          firstName
          lastName
          email
          lastLoginTimestamp
          createdAt
          admin {
            mobileNumber
            officeNumber
            createdByName
          }
        }
        wasSuccessful
        userErrors {
          field
          message
        }
      }
    }
  `;

const createAdmin = values => {
  let res;
  let error;

  const variables = {
    input: values,
  };

  const finalResponseObj = {
    admin: null,
    error,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;

      const { createAdmin: data } = res;
      const { admin } = data;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.userErrors.length
          ? {
            message: data.userErrors[0].message,
            field: data.userErrors[0].field,
          }
          : data.otherError;
      }

      if (!finalResponseObj.error) {
        finalResponseObj.admin = admin;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default createAdmin;
