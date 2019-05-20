import { graphQlClient } from '../../../effects/client';

const query = `
    mutation loginUser($input: LoginUserInput!) {
      loginUser(input: $input) {
        user {
          uuid
          role
          admin {
            isAdminOwner
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

async function loginUser(self, values) {
  const variables = {
    input: values,
  };

  const finalResponseObj = {
    user: null,
    error: null,
  };

  return graphQlClient
    .request(query, variables)
    .then(res => {
      const { loginUser: data } = res;
      const { user } = data;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.userErrors.length
          ? data.userErrors[0].message
          : data.otherError;
      }

      if (user) {
        finalResponseObj.user = user;

        if (user.admin && user.admin.isAdminOwner) {
          user.isAdminOwner = true;
        }
      }

      if (!finalResponseObj.error) {
        self.setUser(user);
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
}

export default loginUser;
