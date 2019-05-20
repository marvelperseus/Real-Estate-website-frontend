import { graphQlClient } from '../client';

const query = `
  mutation createNewDevelopoment($input: CreateNewDevelopmentInput!) {
    createNewDevelopment (input: $input) {
      newdevelopment {
        name
        newdevelopmentID
      }
    }
  }
`;

const submitDevelopment = (values, newdevelopmentID) => {
  console.log(newdevelopmentID);
  let res;
  const { image, builderlogos, builderimage, ...input } = values;
  const {
    name,
    headline,
    subheadline,
    description,
    website,
    category,
    ownership,
    type,
    petPolicy,
    floors,
    unitCount,
    coordinates,
    address,
    region,
    neighborhood,
    borough,
    agents,
  } = input;

  const variables = {
    input: {
      name,
      headline,
      subheadline,
      description,
      website,
      category,
      ownership,
      type,
      petPolicy,
      floors,
      unitCount,
      coordinates,
      address,
      region,
      neighborhood,
      borough,
      agents,
      newdevelopmentID,
    },
  };

  if (image) {
    variables.input.image = image.name;
  }
  if (builderimage) {
    variables.input.builderimage = builderimage.name;
  }
  if (builderlogos.length) {
    variables.input.builderlogos = Array.from(builderlogos).map(
      logo => logo.name
    );
  }

  console.log('Submitting', variables.input);

  const finalResponseObj = {
    listing: null,
    otherError: null,
    userErrors: [],
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      const { createNewDevelopoment: data } = res;
      const { newdevelopment, otherError, userErrors } = data;

      if (userErrors && userErrors.length) {
        finalResponseObj.userErrors = userErrors;
      }

      if (otherError) {
        finalResponseObj.otherError = otherError;
      }

      if (!finalResponseObj.error && !finalResponseObj.userErrors.length) {
        finalResponseObj.listing = listing;
      }
      console.log(finalResponseObj);
      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default submitDevelopment;
