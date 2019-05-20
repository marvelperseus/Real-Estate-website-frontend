import { graphQlClient } from '../client';

const query = `
  mutation featureListing($uuids: [String!]) {
    featureListing(uuids: $uuids)
  }
`;

const featureListing = uuids => {
  let res;

  const variables = {
    uuids,
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      const { featureListing: data } = res;
      return data;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

export default featureListing;
