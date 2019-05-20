import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import faker from 'faker';
import moment from 'moment';
import AdminAreaAgentsTable from '../components/AdminAreaAgentsTable';
import { capitalize } from '../utils/stringUtils';
import debounce from '../utils/debounce';

const chance = new Chance();

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
  { name: 'realEstateLicenseNumber', title: 'RE License Number' },
  { name: 'photo', title: 'Photo' },
  { name: 'name', title: 'Name' },
  { name: 'email', title: 'Email' },
  { name: 'areaOfFocus', title: 'Area of Focus' },
  { name: 'mobileNumber', title: 'Mobile Number' },
  { name: 'companyNumberAndExt', title: 'Company Number/Extension' },
  { name: 'branch', title: 'Branch' },
  { name: 'state', title: 'State' },
  { name: 'lastLoginTimestamp', title: 'Last Login Time' },
  { name: 'createdAt', title: 'Created At' },
  { name: 'status', title: 'Status' },
  { name: 'view', title: 'View Profile' },
];

@observer
class AdminAreaAgentsTableContainer extends Component {
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
        createdAt,
      } = agent;
      const {
        areaOfFocus,
        state,
        realEstateLicenseNumber,
        profilePicURL,
        officeNumber,
        mobileNumber,
        branch,
        status,
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
        createdAt: createdAt
          ? moment(createdAt).format('MM/DD/YYYY, h:mm:ss a')
          : undefined,
        status: status == 'Active'? <font size="3" color="green">{status}</font>: <font size="3" color="red">{status}</font>,
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
    const { classes, agents, ...rest } = this.props;
    return (
      <div className={classes.root}>
        <AdminAreaAgentsTable
          {...rest}
          onMount={() =>
            tableIsLoading ? this.setState({ tableIsLoading: false }) : null
          }
          columns={columns}
          rows={this.createRows(agents)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaAgentsTableContainer);
