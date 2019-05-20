import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import { observer } from 'mobx-react';
import moment from 'moment';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DotLoader } from 'react-spinners';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CreateAgentDialogBox from '../components/CreateAgentDialogBox';
import CreateManagementDialogBox from '../components/CreateManagementDialogBox';
import AdminAreaAgentsTableContainer from './AdminAreaAgentsTableContainer';

const styles = theme => ({
  addAgentBtn: {},
  agentsSummaryBtn: {
    backgroundColor: '#2995F3',
    color: '#fff',
    marginLeft: '10px',
    marginRight: '10px',
    '&:hover': {
      backgroundColor: '#2380D1',
    },
  },
  wrapper: {
    position: 'relative',
  },
  buttonsWrapper: {
    display: 'flex',
    marginBottom: '25px',
    justifyContent: 'center',
  },
  tableFormWrapper: {
    width: '100%',
    zIndex: 2,
    marginBottom: '20px',
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: '20px',
  }),
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  formControlWrapperCenter: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    textAlign: 'center',
  },
  submitBtnWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  submitBtnWrapper2: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2px',
  },
  searchBoxHeader: {
    marginBottom: '20px',
  },
  searchWrapper: {
    marginBottom: '25px',
  },
  heading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    color: 'rgba(0,0,0,.7)',
  },
  selectInput: {
    width: '167px',
    marginTop: '0px',
  },
  checkIcon: {
    marginLeft: '10px',
    color: 'green',
    fontSize: '.95rem',
  },
  snackBar: {
    marginTop: 30,
  },
});

const selectInputItems = [
  { label: '' },
  { label: 'Agent Name' },
  { label: 'Client Name' },
  { label: 'Agent ID' },
];

const searchTypes = {
  dateRange: 'dateRange',
  specific: 'specific',
};

const Loader = DotLoader;

const agentsQuery = gql`
  query agents {
    agents {
      uuid
      firstName
      lastName
      email
      role
      lastLoginTimestamp
      createdAt
      agent {
        profilePicURL
        branch
        state
        mobileNumber
        officeNumber
        areaOfFocus
        realEstateLicenseNumber
        agentType
        speciality
        education
        status
      }
    }
  }
`;

@observer
class AdminAreaAgentsContainer extends Component {
  constructor(props) {
    super(props);

    const today = moment();

    this.state = {
      createAgentModalOpen: false,
      snackbarOpen: false,
      snackbarText: '',
      snackbarUndoFunction: null,
      addedAgents: [],
      deletedAgentIDS: [],
      createManagementModalOpen: false,
    };
  }

  confirmManagementCreated = newAgent => {
    this.setState({
      createManagementModalOpen: false,
      snackbarOpen: true,
      snackbarText: 'Agent created successfully',
      addedAgents: this.state.addedAgents.length
        ? [...this.state.addedAgents, newAgent]
        : [newAgent],
    });
  };
  toggleCreateManagementModal = state => {
    const { createManagementModalOpen } = this.state;
    this.setState({
      createManagementModalOpen:
        typeof state === 'boolean' ? state : !createManagementModalOpen,
    });
  };
  toggleCreateAgentModal = state => {
    const { createAgentModalOpen } = this.state;
    this.setState({
      createAgentModalOpen:
        typeof state === 'boolean' ? state : !createAgentModalOpen,
    });
  };

  confirmAgentCreated = newAgent => {
    this.setState({
      createAgentModalOpen: false,
      snackbarOpen: true,
      snackbarText: 'Agent created successfully',
      addedAgents: this.state.addedAgents.length
        ? [...this.state.addedAgents, newAgent]
        : [newAgent],
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
    });
  };

  render() {
    const { classes } = this.props;
    const { createAgentModalOpen, createManagementModalOpen } = this.state;

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
          // TODO: change the error message to a generic
          // 'error connecting to server' message

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const intAgents = {};

          const allAgents = [...data.agents, ...this.state.addedAgents];

          console.log(this.state.addedAgents);

          allAgents.forEach(agent => {
            if (!agent) return;
            intAgents[agent.uuid] = agent;
          });

          let uniqueAgents = [];

          Object.keys(intAgents).forEach(key => {
            uniqueAgents.push(intAgents[key]);
          });

          uniqueAgents = uniqueAgents.filter(
            agent => !this.state.deletedAgentIDS.includes(agent.uuid)
          );

          return (
            <div className={classes.wrapper}>
              <div>
                <div className={classes.buttonsWrapper}>
                  <Button
                    variant="raised"
                    onClick={this.toggleCreateAgentModal}
                    classes={{ root: classes.agentsSummaryBtn }}
                  >
                    <AddIcon />
                    Create Agent
                  </Button>
                  <Button
                    variant="raised"
                    onClick={this.toggleCreateManagementModal}
                    classes={{ root: classes.agentsSummaryBtn }}
                  >
                    <AddIcon />
                    CREATE MGMT
                  </Button>
                </div>
              </div>

              <AdminAreaAgentsTableContainer agents={uniqueAgents} />

              <CreateAgentDialogBox
                open={createAgentModalOpen}
                toggleCreateAgentModal={this.toggleCreateAgentModal}
                confirmAgentCreated={this.confirmAgentCreated}
                currentUserRole={this.props.currentUserRole}
              />
              <CreateManagementDialogBox
                open={createManagementModalOpen}
                toggleCreateAgentModal={this.toggleCreateManagementModal}
                confirmAgentCreated={this.confirmManagementCreated}
                currentUserRole={this.props.currentUserRole}
              />
              <Snackbar
                classes={{ root: classes.snackBar }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={this.state.snackbarOpen}
                autoHideDuration={6000}
                onClose={this.handleCloseSnackbar}
                contentProps={{
                  'aria-describedby': 'snackbar-id',
                }}
                message={
                  <span id="snackbar-id">{this.state.snackbarText}</span>
                }
                action={[
                  this.snackbarUndoFunction ? (
                    <Button
                      key="undo"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        this.handleCloseSnackbar();
                        if (
                          this.state.snackbarUndoFunction &&
                          typeof snackbarUndoFunction === 'function'
                        ) {
                          this.snackbarUndoFunction();
                        }
                      }}
                    >
                      UNDO
                    </Button>
                  ) : (
                    undefined
                  ),
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={this.handleCloseSnackbar}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(AdminAreaAgentsContainer);
