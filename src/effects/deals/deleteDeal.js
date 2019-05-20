import { graphQlClient } from '../client';

const query = `
  mutation deleteDeal($uuid: String!) {
    deleteDeal(uuid: $uuid) {
      dealID
      error
    }
  }
`;

const deleteDeal = uuid => {
  let res;

  const variables = {
    uuid,
  };

  const finalResponseObj = {
    dealID: null,
    error: null,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { deleteDeal: data } = res;
      const { dealID, error } = data;

      if (error) {
        finalResponseObj.error = error;
      }

      if (!finalResponseObj.error) {
        finalResponseObj.dealID = dealID;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default deleteDeal;
