import { graphQlClient } from '../client';

const query = `
  mutation getListingFileUploadsSignedURLS($input: GetListingSignedURLSInput!) {
    getListingFileUploadsSignedURLS(input: $input) {
      listingID
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

const getListingUploadsSignedURLS = (values, listingID) => {
  let res;
  let error;

  const variables = {
    input: {
      items: values,
      listingID,
    },
  };

  const finalResponseObj = {
    listingID: null,
    items: null,
    error,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { getListingFileUploadsSignedURLS: data } = res;
      const { items, listingID } = data;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.error;
      }

      if (!finalResponseObj.error) {
        finalResponseObj.items = items;
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

export default getListingUploadsSignedURLS;
