import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import faker from 'faker';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import AgentsTable from '../components/AgentsTable';
import { capitalize } from '../utils/stringUtils';

const chance = new Chance();

const Loader = DotLoader;

const agentsQuery = gql`
  query agents {
    agents {
      uuid
      firstName
      lastName
      email
      role
      agent {
        profilePicURL
        branch
        mobileNumber
        officeNumber
        areaOfFocus
      }
    }
  }
`;

const styles = theme => ({
  root: {
    position: 'relative',
  },
  progress: {
    margin: theme.spacing.unit * 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'block',
  },
  progressWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '60px 20px',
    borderRadius: '3px',
    backgroundColor: '#fff',
    zIndex: 2,
  },
});

const columns = [
  { name: 'agentID', title: 'Agent ID' },
  { name: 'photo', title: 'Photo' },
  { name: 'name', title: 'Name' },
  { name: 'email', title: 'Email' },
  { name: 'areaOfFocus', title: 'Area of Focus' },
  { name: 'mobileNumber', title: 'Mobile Number' },
  { name: 'companyNumberAndExt', title: 'Company Number/Extension' },
  { name: 'branch', title: 'Branch' },
  { name: 'view', title: 'View Profile' },
];

@observer
class AgentsTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
    };
  }

  createRows = agents => {
    const rows = [];
    agents.forEach(agent => {
      const {
        agent: agentPart,
        firstName,
        lastName,
        email,
        uuid,
        lastLoginTimestamp,
      } = agent;
      const {
        areaOfFocus,
        state,
        realEstateLicenseNumber,
        profilePicURL,
        officeNumber,
        mobileNumber,
        branch,
      } = agentPart;
      rows.push({
        agentID: uuid,
        realEstateLicenseNumber: realEstateLicenseNumber,
        photo: {
          imageURL: profilePicURL,
          id: uuid,
        },
        name: capitalize(`${firstName} ${lastName}`),
        email,
        areaOfFocus: areaOfFocus,
        mobileNumber,
        companyNumberAndExt: officeNumber,
        branch,
        state,
        lastLoginTimestamp: lastLoginTimestamp
          ? moment(lastLoginTimestamp).format('MM/DD/YYYY, h:mm:ss a')
          : '',
        view: {
          route: 'profile',
          id: uuid,
        },
      });
    });
    return rows;
  };

  render() {
    const { tableIsLoading, rows } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <Query query={agentsQuery} ssr={false} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          console.log(data);
          if (loading)
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'calc(100vh - 110px)',
                  boxShadow:
                    '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Loader color="#f44336" loading />
              </div>
            );

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          return (
            <div className={classes.root}>
              {tableIsLoading ? (
                <div
                  className={classes.progressWrapper}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Loader color="#f44336" loading />
                </div>
              ) : null}
              <AgentsTable
                {...rest}
                onMount={() =>
                  tableIsLoading
                    ? this.setState({ tableIsLoading: false })
                    : null
                }
                columns={columns}
                rows={this.createRows(data.agents)}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(AgentsTableContainer);
