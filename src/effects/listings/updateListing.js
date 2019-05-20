import { graphQlClient } from '../client';

const query = `
  mutation updateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      listing {
        listingID
        address
        description
        price        
        images
        category
        ownership
        type
        petPolicy
        floors
        unitCount
        builtIn
        approx      
        amenities
      }
      userErrors {
        field
        message
      }
      otherError
    }
  }
`;

const updateListing = values => {
  let res;

  const variables = {
    input: values,
  };

  const finalResponseObj = {
    deal: null,
    otherError: null,
    userErrors: [],
  };
  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;

      const { updateListing: data } = res;
      const { listing, otherError, userErrors } = data;

      if (userErrors && userErrors.length) {
        finalResponseObj.userErrors = userErrors;
      }

      if (otherError) {
        finalResponseObj.otherError = otherError;
      }

      if (!finalResponseObj.error && !finalResponseObj.userErrors.length) {
        finalResponseObj.listing = listing;
      }

      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default updateListing;
