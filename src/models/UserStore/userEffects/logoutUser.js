import { graphQlClient } from '../../../effects/client';

const query = `
    mutation logoutUser {
      logoutUser {
        wasSuccessful
        userError
      }
    }
  `;

async function logoutUser(self) {
  let res;
  let response;
  let error;

  const finalResponseObj = {
    response,
    error,
  };

  try {
    res = await graphQlClient.request(query);
  } catch (err) {
    console.log(err);
    finalResponseObj.error = 'Error reaching the server';
    return finalResponseObj;
  }

  const { logoutUser: data } = res;

  if (!data.wasSuccessful) {
    finalResponseObj.error = data.userError;
  }

  if (data.wasSuccessful) {
    self.unsetUser();
  }

  return finalResponseObj;
}

export default logoutUser;
