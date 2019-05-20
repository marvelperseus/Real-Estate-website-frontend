import { graphQlClient } from '../client';

const query = `
  mutation deleteNewDevelopment($uuid: String!) {
    deleteNewDevelopment (uuid: $uuid) {
        newdevelopmentID
        error
    }
  }
`;

const deleteDevelopment = newdevelopmentID => {
  return graphQlClient
    .request(query, { uuid: newdevelopmentID })
    .then(response => console.log('deleted'))
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default deleteDevelopment;
