import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import faker from 'faker';
import moment from 'moment';
import AdminAreaCustomersTable from '../components/AdminAreaCustomersTable';
import { capitalize } from '../utils/stringUtils';

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
  { name: 'customerID', title: 'Customer ID' },
  { name: 'photo', title: 'Photo' },
  { name: 'name', title: 'Name' },
  { name: 'email', title: 'Email' },
  { name: 'interest', title: 'Interest' },
  { name: 'lastLoginTimestamp', title: 'Last Login Time' },
  { name: 'view', title: 'View Profile' },
];

@observer
class AdminAreaCustomersTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
      rows: this.createRows(this.props.agents),
    };
  }

  createRows = (customers = []) => {
    const rows = [];
    customers.forEach(customer => {
      const {
        customer: customerPart,
        firstName,
        lastName,
        email,
        uuid,
        lastLoginTimestamp,
      } = customer;
      const { profilePicURL, interest } = customerPart;
      rows.push({
        customerID: uuid,
        photo: {
          imageURL: profilePicURL,
          id: uuid,
        },
        name: capitalize(`${firstName} ${lastName}`),
        email,
        interest: interest || 'unspecified',
        lastLoginTimestamp: lastLoginTimestamp
          ? moment(lastLoginTimestamp).format('MM/DD/YYYY, h:mm:ss a')
          : '',
        view: {
          route: 'customer',
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
      <div className={classes.root}>
        <AdminAreaCustomersTable
          {...rest}
          onMount={() =>
            tableIsLoading ? this.setState({ tableIsLoading: false }) : null
          }
          columns={columns}
          rows={rows}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaCustomersTableContainer);
