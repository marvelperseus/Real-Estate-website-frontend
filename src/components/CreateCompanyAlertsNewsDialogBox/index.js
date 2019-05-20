import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { Icon } from 'antd';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import RichTextEditor from '../RichTextEditor';

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
    alignItems: 'center',
  },
  saveDraftBtn: {
    marginRight: 'auto',
    color: theme.custom.submitBlue.main,
    '&:hover': {
      backgroundColor: theme.custom.submitBlue.transparentLightBackground,
    },
  },
  textEditor: {
    paddingBottom: 42,
    height: 250,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

@observer
class CreateCompanyAlertsNewsDialogBox extends Component {
  state = {
    formApi: null,
    formSubmitted: false,
    editorBounds: null,
  };

  componentDidMount() {
    this.setState({ editorBounds: document.getElementById('formDialog') });
  }

  setFormSubmitted = (bool = true) => {
    this.setState({ formSubmitted: bool });
  };

  render() {
    const {
      fullScreen,
      classes,
      open,
      dialogBoxType,
      closeDialogBox,
    } = this.props;

    const placeholderText = `Enter you new ${
      dialogBoxType === 'news' ? 'news' : 'alert'
    } item here...`;

    return (
      <Dialog
        disableEscapeKeyDown
        disableBackdropClick
        onClose={closeDialogBox}
        open={open}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          Add New {dialogBoxType === 'news' ? 'News' : 'Alert'} Item
        </DialogTitle>
        <Divider />
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="formDialog"
        >
          <RichTextEditor
            onChange={this.props.onTextEditorChange}
            autoFocus
            placeholder={placeholderText}
            className={classes.textEditor}
            bounds={'#formDialog'}
          />
        </DialogContent>
        {!this.state.formSubmitted ? (
          <DialogActions classes={{ root: classes.dialogActions }}>
            <Button onClick={closeDialogBox} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.onSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(CreateCompanyAlertsNewsDialogBox)
);
