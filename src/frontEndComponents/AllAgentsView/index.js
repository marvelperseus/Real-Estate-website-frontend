import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from '../../routes';

const emailSubject = 'Real estate property inquiry';

const styles = theme => ({
  root: {},
  titleSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: '100%',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    fontSize: '2.8rem',
    color: '#fff',
    backgroundColor: 'black',
    marginBottom: 50,
  },
  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 20px',
  },
  agentsSection: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '50px',
    width: '100%',
    maxWidth: 1200,
  },
  agentCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    transition: 'transform .2s ease-in-out',
    color: 'rgba(0,0,0,.7)',
    '&:hover': {
      transform: 'scale(1.02,1.02)',
    },
  },
  profilePicWrapper: {
    paddingTop: '100%',
    width: '100%',
    position: 'relative',
  },
  profilePicAnchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  profilePic: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  detailsWrapper: {
    padding: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0,0,0,.1)',
    borderTop: 'none',
  },
  agentName: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  agentNameAnchor: {
    marginBottom: '7px',
    textDecoration: 'none',
    color: 'rgba(0,0,0,.8)',
  },
  agentEmail: {
    marginBottom: '10px',
    fontSize: '1.1rem',
    fontSize: '.9rem',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
    textDecoration: 'none',
    color: 'rgba(0,0,0,.7)',
  },
  agentMobileNumber: {
    marginBottom: '10px',
    color: 'rgba(0,0,0,.5)',
    fontSize: '.9rem',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
  },
  filterInputWrapper: {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 1200,
  },
  filterInput: {
    padding: '10px 12px',
    paddingRight: 35,
    width: '100%',
    maxWidth: 1200,
    height: 40,
    fontSize: '.9rem',
    border: '1px solid rgba(0,0,0,.3)',
    borderRadius: 5,
  },
  searchIconWrapper: {
    position: 'absolute',
    right: 20,
    top: 8,
    height: 10,
    width: 10,
  },
});

@withStyles(styles)
@observer
class AllAgentsView extends Component {
  state = {
    filterValue: '',
  };

  onFilterChange = e => {
    const { value } = e.target;
    if (e.preventDefault) e.preventDefault();

    this.setState({ filterValue: value });
  };

  renderAgnets = agents => {
    const { classes } = this.props;
    const filter = this.state.filterValue.trim().toLowerCase();

    let viewableAgents;

    if (filter) {
      viewableAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(filter)
      );
    } else {
      viewableAgents = agents;
    }

    return viewableAgents.map(agent => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={agent.email}>
        <div className={classes.agentCard}>
          <div className={classes.profilePicWrapper}>
            <Link route="agent" params={{ id: agent.agentID }}>
              <a className={classes.profilePicAnchor}>
                <img
                  className={classes.profilePic}
                  src={agent.profilePhotoURL}
                  alt="agent"
                />
              </a>
            </Link>
          </div>
          <div className={classes.detailsWrapper}>
            <Link route="agent" params={{ id: agent.agentID }}>
              <a className={classes.agentNameAnchor}>
                <div className={classes.agentName}>{agent.name}</div>
              </a>
            </Link>
            <div className={classes.agentEmail}>{agent.email}</div>
            <div className={classes.agentMobileNumber}>
              M: {agent.mobileNumber}
            </div>
          </div>
        </div>
      </Grid>
    ));
  };

  render() {
    const { agents, classes } = this.props;
    console.log(`agents: ${agents}`);

    // grab the agent info and listings using this agentID

    return (
      <div className={classes.root}>
        <div className={classes.titleSection}>Our Agents</div>
        <div className={classes.mainSection}>
          <div className={classes.filterInputWrapper}>
            <input
              className={classes.filterInput}
              value={this.state.filterValue}
              onChange={this.onFilterChange}
              type="text"
              placeholder="Search Agents..."
            />
            <span className={classes.searchIconWrapper}>
              <SearchIcon />
            </span>
          </div>
          <div className={classes.agentsSection}>
            <Grid container spacing={24}>
              {agents && agents.length && this.renderAgnets(agents)}
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default AllAgentsView;
