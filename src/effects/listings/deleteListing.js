import { graphQlClient } from '../client';

const query = `
  mutation deleteListing($uuid: String!) {
    deleteListing(uuid: $uuid) {
      listingID
      error
    }
  }
`;

const deleteListing = uuid => {
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

      const { deleteListing: data } = res;
      const { listingID, error } = data;

      if (error) {
        finalResponseObj.error = error;
      }

      if (!finalResponseObj.error) {
        finalResponseObj.listingID = listingID;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default deleteListing;
