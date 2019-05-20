import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SubmitDevelopmentDialogBox from './SubmitDevelopmentDialogBox';

const newdevelopmentFormViewQuery = gql`
  query newdevelopmentFormView($uuid: String!) {
    newdevelopmentFormView(uuid: $uuid) {
      newdevelopmentID
      name
      headline
      subheadline
      description
      website
      image
      category
      ownership
      type
      petPolicy
      floors
      unitCount
      builderimage
      coordinates
      address
      builderlogos
      region
      neighborhood
      borough
      agents
    }
  }
`;

class ViewDevelopmentDialogBox extends React.Component {
  render() {
    const { formOpen, newdevelopmentID, ...rest } = this.props;
    console.log('Rendering View Development Dialog Vox', newdevelopmentID);
    return newdevelopmentID ? (
      <Query
        query={newdevelopmentFormViewQuery}
        variables={{ uuid: newdevelopmentID }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading</p>;
          if (error) return <p>error</p>;
          if (data) {
            return (
              <SubmitDevelopmentDialogBox
                open={formOpen}
                onClickOpen={() => {}}
                isView={true}
                newdevelopment={data.newdevelopmentFormView}
                {...rest}
              />
            );
          }
        }}
      </Query>
    ) : (
      <SubmitDevelopmentDialogBox
        open={formOpen}
        onClickOpen={() => {}}
        {...rest}
      />
    );
  }
}

export default ViewDevelopmentDialogBox;
