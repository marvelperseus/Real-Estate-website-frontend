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

const styles = theme => ({
  paper: {
    width: '800px',
    maxWidth: '800px',
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
    display: 'flex',
    flexDirection: 'column',
  },
  saveDraftBtn: {
    marginRight: 'auto',
    color: theme.custom.submitBlue.main,
    '&:hover': {
      backgroundColor: theme.custom.submitBlue.transparentLightBackground,
    },
  },
  textEditor: {
    width: '100%',
    paddingBottom: 42,
    height: 250,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  newsAlertHTMLWrapper: {},
});

@observer
class CompanyAlertsNewsDialogBox extends Component {
  render() {
    const {
      fullScreen,
      classes,
      open,
      dialogBoxType,
      closeDialogBox,
      newsAlertHTML,
    } = this.props;

    return (
      <Dialog
        onClose={closeDialogBox}
        open={open}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          Viewing {dialogBoxType === 'news' ? 'News' : 'Alert'}
        </DialogTitle>
        <Divider />
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="formDialog"
        >
          <div
            className={classes.newsAlertHTMLWrapper}
            dangerouslySetInnerHTML={{ __html: newsAlertHTML }}
          />
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActions }}>
          <Button onClick={closeDialogBox} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(CompanyAlertsNewsDialogBox)
);
