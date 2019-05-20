import { graphQlClient } from '../client';

const query = `
  mutation updateAdmin($input: UpdateAdminInput!) {
    updateAdmin(input: $input) {
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
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const updateAdmin = values => {
  let res;

  const variables = {
    input: values,
  };

  const finalResponseObj = {
    admin: null,
    otherError: null,
    userErrors: [],
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { updateAdmin: data } = res;
      const { admin, otherError, userErrors } = data;

      if (userErrors && userErrors.length) {
        finalResponseObj.userErrors = userErrors;
      }

      if (otherError) {
        finalResponseObj.otherError = otherError;
      }

      if (!finalResponseObj.error && !finalResponseObj.userErrors.length) {
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

export default updateAdmin;
