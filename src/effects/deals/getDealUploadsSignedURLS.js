import { graphQlClient } from '../client';

const query = `
  mutation getDealFileUploadsSignedURLS($input: GetSignedURLSInput!) {
    getDealFileUploadsSignedURLS(input: $input) {
      dealID
      items {
        itemName
        fileName
        signedURL
        uuid
        error
      }
      error
    }
  }
`;

const getDealUploadsSignedURLS = (values, dealID) => {
  let res;
  let error;

  const variables = {
    input: {
      items: values,
      dealID,
    },
  };

  const finalResponseObj = {
    dealID: null,
    items: null,
    error,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { getDealFileUploadsSignedURLS: data } = res;
      const { items, dealID } = data;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.error;
      }

      if (!finalResponseObj.error) {
        finalResponseObj.items = items;
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

export default getDealUploadsSignedURLS;
