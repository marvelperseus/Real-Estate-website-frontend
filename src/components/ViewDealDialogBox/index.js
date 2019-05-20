import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Menu from 'material-ui/Menu';
import classnames from 'classnames';
import MenuItem from 'material-ui/Menu/MenuItem';
import ViewDealForm from '../../containers/ViewDealForm';
import { agent, admin, superAdmin } from '../../constants/userTypes';
import acceptDeal from '../../effects/deals/acceptDeal';
import deleteDeal from '../../effects/deals/deleteDeal';

const networkErrorMessage = "We're sorry. There was an error processing your request.";

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
  },
  editDealBtn: {
    color: theme.custom.submitBlue.main,
    '&:hover': {
      backgroundColor: theme.custom.submitBlue.transparentLightBackground,
    },
  },
  popupMenuTitle: {
    outline: 'none',
    padding: '12px 16px',
    width: 'auto',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '24px',
    overflow: 'hidden',
    fontSize: '1rem',
    boxSizing: 'content-box',
    fontWeight: '400',
    lineHeight: '1.5em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap',
    paddingLeft: '16px',
    textOverflow: 'ellipsis',
    paddingRight: '16px',
    borderBottom: '1px solid rgba(0,0,0,.1)',
    pointerEvents: 'none',
  },
  menuItem: {
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  menuItemDelete: {
    display: 'flex !important',
    justifyContent: 'center !important',
    transition:
      'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.light} !important`,
      color: '#fff !important',
    },
  },
  menuItemAccept: {
    display: 'flex !important',
    justifyContent: 'center !important',
    transition:
      'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
    '&:hover': {
      backgroundColor: `${theme.custom.submitBlue.light} !important`,
      color: '#fff !important',
    },
  },
  snackBar: {
    position: 'absolute',
    bottom: 20,
  },
  errorSnackbar: {
    '& > div': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
});

@observer
class SubmitDealDialogBox extends Component {
  state = {
    formApi: null,
    formSubmitted: false,
    snackbarOpen: false,
    snackbarText: '',
    snackbarUndoFunction: null,
    isEditingDeal: false,
    cancelAnchorEl: null,
    acceptAnchorEl: null,
    dealBonus: '',
    submittingRequestToServer: false,
    isErrorSnackbar: false,
    isCoAgentEditDeal: false,
  };

  setFormSubmitted = (bool = true) => {
    this.setState({ formSubmitted: bool, isEditingDeal: false, isCoAgentEditDeal: false });
  };

  toggleSnackbarOpen = text => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
    });
  };

  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarUndoFunction: null,
      isErrorSnackbar: false,
      snackbarText: '',
    });
  };

  openRequestErrorSnackbar = (text = networkErrorMessage) => {
    this.setState({
      snackbarOpen: true,
      snackbarText: text,
      isErrorSnackbar: true,
    });
  };

  toggleEditingDeal = (bool, isCoAgent) => {
    const { isEditingDeal, isCoAgentEditDeal } = this.state;
    this.setState({
      isEditingDeal:
        typeof bool === 'boolean' ? bool && !isCoAgent : !isEditingDeal,
      isCoAgentEditDeal: typeof bool === 'boolean' ? bool && isCoAgent : !isCoAgentEditDeal,
    });
  };

  handleCancelMenuClick = event => {
    this.setState({ cancelAnchorEl: event.currentTarget });
  };

  handleCancelMenuClose = () => {
    this.setState({ cancelAnchorEl: null });
  };

  handleAcceptMenuClick = event => {
    this.setState({ acceptAnchorEl: event.currentTarget });
  };

  handleAcceptMenuClose = () => {
    this.setState({ acceptAnchorEl: null });
  };

  onBonusChange = ({ target }) => {
    const dollarRegex = /^\d*(\.\d*)?$/;
    const val = target.value;

    if (!dollarRegex.test(val)) return;

    this.setState({
      dealBonus: val,
    });
  };

  resetDealBonus = () => {
    this.setState({
      dealBonus: '',
    });
  };

  acceptDeal = dealID => {
    const { userUUID } = this.props;
    const { dealBonus } = this.state;
    this.toggleSubmittingRequestToServer(true);
    acceptDeal(dealID, Number(dealBonus) ? Number(dealBonus) : undefined, userUUID)
      .then(res => {
        this.toggleSubmittingRequestToServer(false);
        if (res.error) {
          this.openRequestErrorSnackbar(res.error);
          return;
        } if (res.userErrors.length) {
          this.openRequestErrorSnackbar(res.userErrors[0]);
          return;
        }

        this.props.dealAccepted(dealID);
      })
      .catch(err => {
        this.openRequestErrorSnackbar();
      });
  };

  deleteDeal = dealID => {
    const { userUUID } = this.props;

    this.toggleSubmittingRequestToServer(true);
    deleteDeal(dealID, userUUID)
      .then(res => {
        this.toggleSubmittingRequestToServer(false);
        if (res.error) {
          this.openRequestErrorSnackbar(res.error);
          return;
        }

        this.props.dealDeleted(dealID);
      })
      .catch(err => {
        this.toggleSubmittingRequestToServer(true);
        this.openRequestErrorSnackbar();
      });
  };

  toggleSubmittingRequestToServer = (
    bool = !this.state.submittingRequestToServer
  ) => {
    this.setState({
      submittingRequestToServer: bool,
      formSubmitted: bool,
    });
  };

  render() {
    const {
      fullScreen,
      classes,
      closeDealsViewDialogBox,
      dealsViewDialogBoxOpen,
      setDealSuccessfullySubmitted,
      viewingDealID,
      viewingDealStatus,
      isCoAgent,
      userUUID,
      userRole,
      coBrokeAgentId
    } = this.props;

    const hideButton = this.props.coBrokeAgentId ? this.props.coBrokeAgentId.indexOf(this.props.userUUID) > -1 : false;

    const {
      isEditingDeal, cancelAnchorEl, acceptAnchorEl, isCoAgentEditDeal,
    } = this.state;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={dealsViewDialogBoxOpen}
        classes={{ paper: classes.paper }}
        fullScreen={fullScreen}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.formTitle }}
        >
          View Deal
        </DialogTitle>
        <Divider />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <ViewDealForm
            userUUID={userUUID}
            getFormApi={formApi => this.setState({ formApi })}
            setFormSubmitted={this.setFormSubmitted}
            setDealSuccessfullySubmitted={setDealSuccessfullySubmitted}
            dealID={viewingDealID}
            isCoAgent={isCoAgent}
            isEditingDeal={isEditingDeal}
            isCoAgentEditDeal={isCoAgentEditDeal}
            isViewType
            userRole={this.props.userRole}
            dealAccepted={this.props.dealAccepted}
            onBonusChange={this.onBonusChange}
            dealBonus={this.state.dealBonus}
            resetDealBonus={this.resetDealBonus}
            submittingRequestToServer={this.state.submittingRequestToServer}
            openRequestErrorSnackbar={this.openRequestErrorSnackbar}
          />
          <Snackbar
            classes={{
              root: classnames(
                classes.snackBar,
                this.state.isErrorSnackbar && classes.errorSnackbar
              ),
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={4000}
            onClose={this.handleCloseSnackbar}
            message={<span id="snackbar-id">{this.state.snackbarText}</span>}
            action={[
              this.snackbarUndoFunction ? (
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    this.handleCloseSnackbar();
                    if (
                      this.state.snackbarUndoFunction
                      && typeof snackbarUndoFunction === 'function'
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
        </DialogContent>
        {!this.state.formSubmitted ? (
          <DialogActions classes={{ root: classes.dialogActions }}>
            <Button
              disabled={this.state.formSubmitted}
              onClick={() => {
                this.toggleEditingDeal(false);
                closeDealsViewDialogBox();
              }}
              color="primary"
            >
              Cancel
            </Button>
            {((userRole === agent
              && viewingDealStatus === 'pending')
              || userRole === superAdmin
              || userRole === admin) && !isCoAgent ? (
                <Button
                  disabled={this.state.formSubmitted}
                  onClick={this.handleCancelMenuClick}
                  color="secondary"
                >
                  Delete
                </Button>
              ) : null}
            <Menu
              id="simple-menu"
              anchorEl={cancelAnchorEl}
              open={Boolean(cancelAnchorEl)}
              onClose={this.handleCancelMenuClose}
            >
              <div className={classes.popupMenuTitle}>Are you sure?</div>
              <MenuItem
                classes={{ root: classes.menuItemDelete }}
                onClick={() => {
                  this.handleCancelMenuClose();
                  this.deleteDeal(viewingDealID);
                }}
              >
                Yes
              </MenuItem>
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={this.handleCancelMenuClose}
              >
                No
              </MenuItem>
            </Menu>
            {!isEditingDeal && !isCoAgentEditDeal
              && this.props.userRole === agent
              && viewingDealStatus === 'pending'
              ? (
                <Button
                  className={classes.editDealBtn}
                  disabled={this.state.formSubmitted}
                  onClick={() => this.toggleEditingDeal(true, isCoAgent)}
                  color="primary"
                >
                  Edit
                </Button>
              ) : null}
            {(this.props.userRole === admin
              || this.props.userRole === superAdmin)
              && viewingDealStatus === 'pending' && !hideButton ? (
                <Button
                  className={classes.editDealBtn}
                  disabled={this.state.formSubmitted}
                  onClick={this.handleAcceptMenuClick}
                  color="primary"
                >
                  Accept Deal
                </Button>
              ) : null}
            <Menu
              id="simple-menu"
              anchorEl={acceptAnchorEl}
              open={Boolean(acceptAnchorEl)}
              onClose={this.handleAcceptMenuClose}
            >
              <div className={classes.popupMenuTitle}>Are you sure?</div>
              <MenuItem
                classes={{ root: classes.menuItemAccept }}
                onClick={() => {
                  this.handleAcceptMenuClose();
                  this.acceptDeal(viewingDealID);
                }}
              >
                Yes
              </MenuItem>
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={this.handleAcceptMenuClose}
              >
                No
              </MenuItem>
            </Menu>
            {isEditingDeal || isCoAgentEditDeal ? (
              <Button
                disabled={this.state.formSubmitted}
                onClick={() => {
                  const errors = this.state.formApi.getError();
                  let errorCount;
                  console.log(this.state.formApi.getError());
                  if (errors) {
                    errorCount = Object.keys(this.state.formApi.getError())
                      .length;
                  }

                  if (errorCount) {
                    this.toggleSnackbarOpen(
                      `Please correct ${errorCount} form error${
                      errorCount > 1 ? 's' : ''
                      }`
                    );
                  }

                  this.state.formApi.submitForm();
                }}
                color="primary"
              >
                Submit
              </Button>
            ) : null}
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(SubmitDealDialogBox));
