import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';
import classnames from 'classnames';
import List, { ListItem, ListItemText } from 'material-ui/List';
import AddIcon from '@material-ui/icons/Add';
import Truncate from 'react-truncate';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import { admin as adminRole, superAdmin } from '../../constants/userTypes';

const styles = theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
  },
  heading: {
    fontSize: '.94rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,.7)',
  },
  lightHeading: {
    color: '#fff',
  },
  companyNewsWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    // paddingTop: '20px',
    maxHeight: '256px',
    // backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: theme.shadows[1],
    backgroundColor: '#fff',
    '&::after': {
      content: "''",
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      left: 0,
      right: 0,
      pointerEvents: 'none',
      backgroundImage:
        'linear-gradient(to bottom, rgba(255,255,255, 0), rgba(255,255,255, 1) 90%)',
      width: '100%',
      height: '2em',
    },
  },
  companyAlertsWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    // paddingTop: '20px',
    maxHeight: '256px',
    // backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: theme.shadows[1],
    backgroundColor: '#fff',
    '&::after': {
      content: "''",
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      left: 0,
      right: 0,
      pointerEvents: 'none',
      backgroundImage:
        'linear-gradient(to bottom, rgba(255,255,255, 0), rgba(255,255,255, 1) 90%)',
      width: '100%',
      height: '2em',
    },
  },
  boxTitleWrapper: {
    width: '100%',
    paddingLeft: '24px',
    paddingRight: '24px',
    display: 'flex',
    alignItems: 'center',
    height: '35px',
    fontSize: '.94rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,.7)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  companyNewsPlaceHolder: {
    display: 'flex',
    marginTop: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // backgroundColor: 'rgba(0,0,0,.8)',
    color: 'rgba(0,0,0,.7)',
    borderRadius: '0 0 5px 5px',
  },
  companyAlertsExpansionWrapper: {
    backgroundColor: 'inherit',
    color: 'inherit',
  },
  normalExpansionSummary: {
    minHeight: '48px',
    maxHeight: '48px',
    zIndex: 2,
  },
  darkExpansionSummary: {
    minHeight: '48px',
    maxHeight: '48px',
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    zIndex: 2,
  },
  expansionSummaryExpanded: {
    minHeight: '48px',
    maxHeight: '48px',
    marginBottom: '0 important!',
  },
  expandPanel: {
    marginBottom: 0,
  },
  addBtn: {
    top: -12,
    right: -12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 24,
    width: 24,
    borderRadius: '50%',
    border: 'none',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,.8)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
    zIndex: 3,
  },
  addIcon: {
    fontSize: 12,
  },
  expansionPanelContent: {
    maxHeight: 'calc(256px - 48px)',
    overflow: 'auto',
  },
  listRoot: {
    width: '100%',
  },
  listItem: {
    position: 'relative',
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.1)',
    color: '#000',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01,1.01)',
    },
    '&:last-of-type': {
      marginBottom: 20,
    },
  },
  listItemText: {
    color: '#fff',
    '& h3': {
      color: '#000',
    },
  },
  listItemNumber: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: -2,
    left: -2,
    position: 'absolute',
    height: 24,
    width: 24,
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    backgroundColor: theme.palette.secondary.dark,
    fontSize: '28px',
    outline: 'none',
    transition: 'transform .4s ease-in-out',
    '&:hover': {
      transform: 'rotate(180deg)',
    },
    cursor: 'pointer',
  },
  deleteSign: {
    position: 'absolute',
    top: -9,
  },
});

@observer
@withStyles(styles)
class CompanyNewsAlerts extends React.Component {
  renderCompanyNews = () => {
    const {
      newsItems,
      classes,
      isAdmin,
      deleteNewsAlertItem,
      openVeiwNewsAlertItemDialogBox,
    } = this.props;
    if (newsItems && newsItems.length) {
      return (
        <List classes={{ root: classes.listRoot }}>
          {newsItems.map((item, i) => (
            <ListItem
              onClick={() => {
                openVeiwNewsAlertItemDialogBox(item.uuid, item.html, item.type);
              }}
              classes={{ root: classes.listItem }}
              key={`item-${i}`}
            >
              {isAdmin && (
                <button
                  className={classes.listItemNumber}
                  onClick={event => {
                    if (event.stopPropagation) event.stopPropagation();

                    deleteNewsAlertItem(item.uuid, item.type);
                  }}
                >
                  <span className={classes.deleteSign}>-</span>
                </button>
              )}
              <div style={{ width: '100%' }}>
                <Truncate trimWhitespace lines={1}>
                  {item.string}
                </Truncate>
              </div>
            </ListItem>
          ))}
        </List>
      );
    }
    return (
      <div className={classes.companyNewsPlaceHolder}>
        There is currently no news available...
      </div>
    );
  };

  renderCompanyAlerts = () => {
    const {
      alertItems,
      classes,
      isAdmin,
      deleteNewsAlertItem,
      openVeiwNewsAlertItemDialogBox,
    } = this.props;
    if (alertItems && alertItems.length) {
      return (
        <List classes={{ root: classes.listRoot }}>
          {alertItems.map((item, i) => (
            <ListItem
              onClick={() => {
                openVeiwNewsAlertItemDialogBox(item.uuid, item.html, item.type);
              }}
              classes={{ root: classes.listItem }}
              key={`item-${i}`}
            >
              {isAdmin && (
                <button
                  className={classes.listItemNumber}
                  onClick={event => {
                    if (event.stopPropagation) event.stopPropagation();

                    deleteNewsAlertItem(item.uuid, item.type);
                  }}
                >
                  <span className={classes.deleteSign}>-</span>
                </button>
              )}
              <div style={{ width: '100%' }}>
                <Truncate trimWhitespace lines={1}>
                  {item.string}
                </Truncate>
              </div>
            </ListItem>
          ))}
        </List>
      );
    }
    return (
      <div className={classes.companyNewsPlaceHolder}>
        There are currently no alerts available...
      </div>
    );
  };

  render() {
    const {
      classes,
      newsItems,
      alertItems,
      openDialogBox,
      isAdmin,
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          {/*
            <Grid item xs={12}>
            <div>Company Alerts</div>
          </Grid>
          */}

          <Grid item xs={12} lg={6}>
            <div className={classnames(classes.companyNewsWrapper)}>
              <ExpansionPanel
                defaultExpanded={newsItems && newsItems.length}
                classes={{ root: classnames(classes.expandPanel) }}
              >
                <ExpansionPanelSummary
                  classes={{
                    root: classes.normalExpansionSummary,
                    expanded: classes.expansionSummaryExpanded,
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography color="inherit" className={classes.heading}>
                    Company News
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  classes={{ root: classes.expansionPanelContent }}
                >
                  {this.renderCompanyNews()}
                </ExpansionPanelDetails>
              </ExpansionPanel>
              {isAdmin && (
                <button
                  className={classes.addBtn}
                  onClick={openDialogBox.bind(null, 'news')}
                >
                  <AddIcon classes={{ root: classes.addIcon }} />
                </button>
              )}
            </div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <div className={classnames(classes.companyAlertsWrapper)}>
              <ExpansionPanel
                classes={{
                  root: classnames(
                    classes.companyNewsExpansionWrapper,
                    classes.expandPanel
                  ),
                }}
                defaultExpanded={alertItems && alertItems.length}
              >
                <ExpansionPanelSummary
                  classes={{
                    root: classes.darkExpansionSummary,
                    expanded: classes.expansionSummaryExpanded,
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    color="inherit"
                    className={classnames(
                      classes.heading,
                      classes.lightHeading
                    )}
                  >
                    Company Alerts
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  classes={{ root: classes.expansionPanelContent }}
                >
                  {this.renderCompanyAlerts()}
                </ExpansionPanelDetails>
              </ExpansionPanel>
              {isAdmin && (
                <button
                  className={classes.addBtn}
                  onClick={openDialogBox.bind(null, 'alert')}
                >
                  <AddIcon classes={{ root: classes.addIcon }} />
                </button>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CompanyNewsAlerts;
