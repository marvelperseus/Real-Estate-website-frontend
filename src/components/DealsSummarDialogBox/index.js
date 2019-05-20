import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import DealsSummaryContainer from '../../containers/DealsSummary';
const styles = theme => ({
  paper: {
    width: '90%',
    maxWidth: '90%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
    },
  },
  dialogActions: {
    margin: '8px 0',
  },
  formTitle: {
    padding: 'theme.spacing.unit theme.spacing.unit * 3',
    textAlign: 'center',
  },
  formSubheader: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  dialogContent: {
    paddingTop: '32px',
  },
});

@observer
class DealsSummaryDialogBox extends Component {
  render() {
    const {
      fullScreen,
      classes,
      toggleDealsSummaryDialogBox,
      dealsSummaryDialogBoxOpen,
    } = this.props;

    return (
      <Dialog
        onClose={toggleDealsSummaryDialogBox}
        open={dealsSummaryDialogBoxOpen}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          Deals Summary
        </DialogTitle>
        <Divider />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <DealsSummaryContainer
            userUUID={this.props.userUUID}
            deals={this.props.deals}
          />
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActions }}>
          <Button onClick={toggleDealsSummaryDialogBox} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(DealsSummaryDialogBox));
