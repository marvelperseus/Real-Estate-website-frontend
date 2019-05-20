import { graphQlClient } from '../client';

const query = `
  mutation blockAgent($input: BlockAgentInput!) {
    blockAgent(input: $input) {
      userErrors {
        field
        message
      }
     otherError
    }
  }
`;

const blockAgent = values => {
  let res;
  let error;

  const variables = {
    input: values,
  };

  const finalResponseObj = {
    error: null,
  };
console.log("calling the server blobk agent ", variables);
  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      console.log(res);

      const { blockAgent: data } = res;

      if (!data.wasSuccessful) {
        finalResponseObj.error = data.userErrors.length
          ? {
            message: data.userErrors[0].message,
            field: data.userErrors[0].field,
          }
          : data.otherError;
      }

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

export default blockAgent;
