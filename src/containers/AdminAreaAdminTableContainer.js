import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Chance from 'chance';
import faker from 'faker';
import moment from 'moment';
import AdminAreaAdminTable from '../components/AdminAreaAdminTable';
import { capitalize } from '../utils/stringUtils';
import { superAdmin, admin as adminRole } from '../constants/userTypes';
import debounce from '../utils/debounce';

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

@observer
class AdminAreaAdminTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
    };
  }

  columns = [
    { name: 'adminID', title: 'Admin ID' },
    { name: 'name', title: 'Name' },
    { name: 'email', title: 'Email' },
    { name: 'mobileNumber', title: 'Mobile Number' },
    { name: 'companyNumberAndExt', title: 'Company Number/Extension' },
    { name: 'role', title: 'Role' },
    { name: 'lastLoginTimestamp', title: 'Last Login Time' },
    { name: 'createdAt', title: 'Created At' },
  ];

  returnColumns = () => {
    const columns = [
      { name: 'adminID', title: 'Admin ID' },
      { name: 'name', title: 'Name' },
      { name: 'email', title: 'Email' },
      { name: 'mobileNumber', title: 'Mobile Number' },
      { name: 'companyNumberAndExt', title: 'Company Number/Extension' },
      { name: 'role', title: 'Role' },
      { name: 'lastLoginTimestamp', title: 'Last Login Time' },
      { name: 'createdAt', title: 'Created At' },
    ];

    if (this.props.userRole === superAdmin) {
      columns.push({ name: 'view', title: 'View Info' });
    }

    return columns;
  };

  createRows = (allAdmin = [], currentUserSecondaryRole) => {
    const rows = [];
    allAdmin.forEach(admin => {
      const {
        admin: adminPart,
        firstName,
        lastName,
        email,
        uuid,
        lastLoginTimestamp,
        createdAt,
        role,
      } = admin;
      const {
        profilePicURL,
        officeNumber,
        mobileNumber,
        isAdminOwner,
      } = adminPart;
      rows.push({
        adminID: uuid,
        photo: {
          imageURL: profilePicURL,
          id: uuid,
        },
        name: capitalize(`${firstName} ${lastName}`),
        email,
        mobileNumber,
        companyNumberAndExt: officeNumber,
        role,
        lastLoginTimestamp: lastLoginTimestamp
          ? moment(lastLoginTimestamp).format('MM/DD/YYYY, h:mm:ss a')
          : '',
        createdAt: createdAt
          ? moment(createdAt).format('MM/DD/YYYY, h:mm:ss a')
          : undefined,
        view:
          role === adminRole ||
          this.props.userUUID === uuid ||
          this.props.currentUserIsAdminOwner
            ? {
                type: 'action',
                needsEvent: true,
                onClick: event =>
                  debounce(
                    this.props.handleEditAdminMenuClick.bind(
                      null,
                      event,
                      uuid,
                      role,
                      isAdminOwner
                    ),
                    1000,
                    true
                  )(),
              }
            : { noShow: true },
      });
    });
    return rows;
  };

  render() {
    const { tableIsLoading, rows } = this.state;
    const { classes, allAdmin, ...rest } = this.props;
    return (
      <div className={classes.root}>
        <AdminAreaAdminTable
          {...rest}
          onMount={() =>
            tableIsLoading ? this.setState({ tableIsLoading: false }) : null
          }
          columns={this.returnColumns()}
          rows={this.createRows(allAdmin)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AdminAreaAdminTableContainer);
