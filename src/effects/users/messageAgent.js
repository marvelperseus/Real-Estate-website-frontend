import { graphQlClient } from '../client';

const query = `
    mutation messageAgent($input: MessageAgentInput!) {
      messageAgent(input: $input) {
        result
      }
    }
  `;
const messageAgent = input => {
  const variables = {
    input,
  };

  return graphQlClient.request(query, variables);
};

export default messageAgent;
