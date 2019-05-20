import { graphQlClient } from '../client';

const query = `
  mutation createListing($input: CreateListingInput!) {
    createListing(input: $input) {
      listing {
        listingID
        address
        description       
        price
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

const submitListing = values => {
  let res;
  const variables = {
    input: values,
  };

  const finalResponseObj = {
    listing: null,
    otherError: null,
    userErrors: [],
  };

  return graphQlClient
    .request(query, variables)
    .then(result => {
      res = result;
      const { createListing: data } = res;
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
      console.log(finalResponseObj);
      return finalResponseObj;
    })
    .catch(err => {
      console.log(err);
      finalResponseObj.error = 'Error reaching the server';
      return finalResponseObj;
    });
};

export default submitListing;
