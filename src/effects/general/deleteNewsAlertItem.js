import { graphQlClient } from '../client';

const query = `
  mutation deleteNewsAlertItem($uuid: String!) {
    deleteNewsAlertItem(uuid: $uuid) {
      error
    }
  }
`;

const deleteNewsAlertItem = uuid => {
  let res;

  const variables = {
    uuid,
  };

  const finalResponseObj = {
    error: null,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { deleteNewsAlertItem: data } = res;
      const { error } = data;

      if (error) {
        finalResponseObj.error = error;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default deleteNewsAlertItem;
