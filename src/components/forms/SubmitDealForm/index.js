import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import { Form, NestedField } from 'react-form';
import moment from 'moment';
import uuid from 'uuid/v4';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdFileDownload } from 'react-icons/lib/md';
import Tooltip from 'material-ui/Tooltip';
import { Icon } from 'antd';
import Lightbox from 'react-images';
import classnames from 'classnames';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import MaterialCustomTextFieldWrapper from '../../MaterialCustomTextFieldWrapper';
import MaterialCustomRadioInputWrapper from '../../MaterialCustomRadioInputWrapper';
import MaterialCustomSelectInputWrapper from '../../MaterialCustomSelectInputWrapper';
import CustomFileUploadInputWrapper from '../../CustomFileUploadInputWrapper';
import { capitalize } from '../../../utils/stringUtils';
import validators, {
  paymentTypeValidator,
  checkOrTransactionNumberValidator,
  paymentAmountValidator,
  deductionTypeValidator,
  descriptionValidator,
  deductionsAmountValidator,
  agencyDisclosureFormValidator,
  ACHAccountNumberValidator,
} from './formValidation';
import {
  agent as agentRole,
  admin,
  superAdmin,
} from '../../../constants/userTypes';
import { padStringToDecimalString } from '../../../utils/Math';

const CustomTextField = MaterialCustomTextFieldWrapper;
const MaterialCustomRadioInput = MaterialCustomRadioInputWrapper;
const MaterialCustomSelectInput = MaterialCustomSelectInputWrapper;
const CustomFileUploadInputBtn = CustomFileUploadInputWrapper;

const acceptedFileExtensions = ['jpg', 'jpeg', 'pdf'];

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing.unit * 3,
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
  },
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  formControl: {
    marginLeft: 0,
    marginRight: 0,
  },
  alignCenter: {
    textAlign: 'center',
  },
  formHeader: {
    marginBottom: theme.spacing.unit * 3,
  },
  formWrapper: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    textAlign: 'center',
  },
  formRoot: {
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  radioInputWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formSubheading: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '82px',
  },
  h3: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  addPaymentBtn: {
    marginTop: '10px',
  },
  removePaymentBtn: {
    marginTop: '5px',
    marginLeft: '28px',
  },
  paymentItemsWrapper: {
    display: 'flex',
    width: '100%',
    padding: '5px 0 12px 0',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    '& > div': {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
  formMiniHeading: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
  },
  formMiniHeading2: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
    marginTop: '60px',
  },
  topPaymentMethodWrapper: {
    paddingTop: '0',
  },
  paddingBottom10: {
    paddingBottom: '15px',
  },
  greenText: {
    color: '#448A19',
  },
  redText: {
    color: '#ED462F',
  },
  blueText: {
    color: '#3878D8',
  },
  financialsTotal: {
    backgroundColor: 'rgba(0,0,0,.12)',
  },
  uploadBtnClassName: {
    color: '#fff',
    backgroundColor: '#272A2E',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    padding: '8px 16px',
    minWidth: '88px',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    minHeight: '36px',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    lineHeight: '1.4em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '500',
    borderRadius: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#000',
    },
    addUploadBtnClassName: {},
  },
  fileUploadBtnWrapper2: {
    position: 'relative',
    display: 'inline-block',
  },
  fileUploadBtnWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  smallFileAddBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    backgroundColor: '#2995F3',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#2483D6',
    },
  },
  smallFileRemoveBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    position: 'absolute',
    top: '5px',
    marginLeft: '6px',
  },
  smallFileViewBtn: {
    width: '35px',
    height: '35px',
    minWidth: '35px',
    minHeight: '35px',
    position: 'absolute',
    backgroundColor: '#008000',
    top: '8px',
    marginLeft: '6px',
    color: '#fff',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#067706',
    },
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      marginTop: '-18px',
    },
    '@media only screen and (max-width: 400px)': {
      position: 'relative',
      marginTop: '0 !important',
    },
  },
  uploadContractDivWrapper: {
    position: 'relative',
  },
  blueBackgroundColor: {
    backgroundColor: '#2995F3',
  },
  finalTotalLabelClass: {
    paddingLeft: '10px',
  },
  finalTotalInputClass: {
    backgroundColor: 'rgba(0,0,0,.12)',
    borderRadius: '5px 5px 0 0',
    paddingLeft: '10px',
  },
  ManagementOrCobrokeCompanyTextField: {
    width: '100%',
    margin: 8,
    marginLeft: 0,
  },
  progressBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formSubmittingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '25%',
  },
  progressBarExplanation: {
    marginTop: '20px',
    fontSize: '1.1rem',
  },
  gridContainer: {
    marginBottom: 0,
  },
  viewIcon: {
    fontSize: '1.2rem',
  },
  disabled: {
    cursor: 'not-allowed',
  },
  fullwidthInput: {
    width: '100%',
  },
  downloadFileBtn: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '26px',
    width: '26px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff !important',
    backgroundColor: '#646d64',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
  },
  popupMenuTitle: {
    display: 'flex',
    justifyContent: 'center',
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
});

const radioInputAgentItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
];

const radioInputManagementItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '85%', value: '85' },
  { label: '100%', value: '100' },
];
const radioInputAgentPaymentItems = [
  { label: "I'll pick up the check" },
  { label: 'Please ACH me' },
];

const radioInputYesNoItems = [{ label: 'Yes' }, { label: 'No' }];

const dealTypeSelectItems = [
  { label: 'Residential Rental' },
  { label: 'Residential Sale' },
  { label: 'Commercial Rental' },
  { label: 'Commercial Sale' },
];

const fundsPaidBySelectItems = [
  { label: 'Bringing a certified check to the office' },
  { label: 'Remote deposit to Chase account' },
  { label: 'Check or "OP" mailed to office' },
  { label: 'Credit card payment' },
  { label: 'Client wired funds' },
];

const paymentTypeSelectItems = [
  { label: 'Certified Check' },
  { label: 'Money Order' },
  { label: 'Wire' },
  { label: 'Owner Pays (OP)' },
];

const deductionTypeSelectItems = [
  { label: 'Co-Brokering Split' },
  { label: 'Company Deal Fee' },
  { label: 'Outside Company Check' },
];

const imagePreloader = images => {
  images.forEach(imageItem => {
    if (imageItem && imageItem.src) {
      const fileType = imageItem.src.split('.').pop();

      if (fileType.toLowerCase === 'pdf') return;

      const newImage = new Image();

      newImage.src = imageItem.src;
    }
  });
};

@observer
class SubmitDealForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderInitialDeductionItem: true,
      lightboxIsOpen: false,
      currentLightBoxIndex: 0,
      lightboxType: 'agencyDisclosure',
      contractLeaseAnchorEl: null,
      agencyDisclosureAnchorEl: null,
      currentLightboxItem: [{ src: '' }],
    };
  }

  componentDidMount() {
    if (this.props.setInitialContainerState && this.props.submittedDeal) {
      this.props.setInitialContainerState({
        paymentsTotal: this.props.submittedDeal.paymentsTotal,
        deductionsTotal: this.props.submittedDeal.deductionsTotal,
        total: this.props.submittedDeal.total,
      });

      imagePreloader([
        ...this.returnContractLeaseURLS(),
        ...this.returnAgencyDisclosureURL(),
      ]);
    }

    if (this.props.resetDealBonus) {
      this.props.resetDealBonus();
    }
  }

  returnAgencyDisclosureURL = () => {
    const { submittedDeal } = this.props;
    if (!submittedDeal) return [];
    const src = submittedDeal.agencyDisclosureForm;
    const fileName = src.split('/').pop();
    const encodedFileName = encodeURIComponent(fileName);
    const srcArray = src.split('/');
    const encodedSrc = `${srcArray
      .slice(0, srcArray.length - 1)
      .join('/')}/${encodedFileName}`;

    if (submittedDeal.agencyDisclosureForm) {
      return [
        {
          src: encodedSrc,
        },
      ];
    }
  };

  returnContractLeaseURLS = () => {
    const { submittedDeal } = this.props;
    if (!submittedDeal) return [];

    if (submittedDeal.contractOrLeaseForms) {
      return submittedDeal.contractOrLeaseForms.map(url => {
        const fileName = url.split('/').pop();
        const urlArray = url.split('/');

        const encodedFileName = encodeURIComponent(fileName);
        const encodedUrl = `${urlArray
          .slice(0, urlArray.length - 1)
          .join('/')}/${encodedFileName}`;
        return {
          src: encodedUrl,
        };
      });
    }
  };

  openFileLightBox = item => {
    this.setState({
      lightboxIsOpen: true,
      currentLightBoxIndex: 0,
      lightboxType: 'contractLease',
      currentLightboxItem: [item],
    });
  };

  openFileViewer = (src, fileName, fileType) => {
    if (fileType === 'pdf' && fileType === 'PDF') {
      return;
    }

    this.openFileLightBox({
      src,
    });
  };

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  };

  onClickPrev = () => {
    const { currentLightBoxIndex } = this.state;

    this.setState({
      currentLightBoxIndex: currentLightBoxIndex - 1,
    });
  };

  onClickNext = () => {
    const { currentLightBoxIndex } = this.state;

    this.setState({
      currentLightBoxIndex: currentLightBoxIndex + 1,
    });
  };

  onClickThumbnail = index => {
    this.setState({
      currentLightBoxIndex: index,
    });
  };

  downloadFile = async () => {
    const urls =
      this.state.lightboxType === 'agencyDisclosure'
        ? this.returnAgencyDisclosureURL()
        : this.returnContractLeaseURLS();

    const fileType = urls[this.state.currentLightBoxIndex].src.split('.').pop();

    let objectURL;

    try {
      const res = await fetch(
        `${urls[this.state.currentLightBoxIndex].src}?v=10`
      );
      console.log(res);
      objectURL = URL.createObjectURL(await res.blob());
    } catch (err) {
      console.log(err);
      return;
    }

    if (this._fileLink) {
      this._fileLink.setAttribute('href', objectURL);
      this._fileLink.setAttribute(
        'download',
        `${this.state.lightboxType}${this.state.currentLightBoxIndex + 1}`
      );
      this._fileLink.click();
    }
  };

  returnDownloadFileBtn = () => {
    const { classes } = this.props;

    return (
      <Tooltip
        title="Download current file."
        enterDelay={300}
        leaveDelay={100}
        PopperProps={{ style: { zIndex: 2100 } }}
      >
        <button className={classes.downloadFileBtn} onClick={this.downloadFile}>
          <MdFileDownload />
        </button>
      </Tooltip>
    );
  };

  handleContractLeaseMenuClick = event => {
    this.setState({ contractLeaseAnchorEl: event.currentTarget });
  };

  handleContractLeaseMenuClose = () => {
    this.setState({ contractLeaseAnchorEl: null });
  };

  handleAgencyDisclosureMenuClick = event => {
    this.setState({ agencyDisclosureAnchorEl: event.currentTarget });
  };

  handleAgencyDisclosureMenuClose = () => {
    this.setState({ agencyDisclosureAnchorEl: null });
  };

  renderRestDeductionItems(formApi, splitAgents) {
    const {
      classes,
      submittedDeal,
      isEditingDeal,
      deductionAmountChangeHandler,
      subtractDeductionValueFromState,
      isViewType,
    } = this.props;
    const { shouldRenderInitialDeductionItem } = this.state;
    if (!formApi.values.deductionItems || !formApi.values.deductionItems.length)
      return;
    const deductionItems = formApi.values.deductionItems.map(
      (deductionItem, i) => {
        const isAgentSplit =
          deductionItem && deductionItem.deductionType === 'Co-Brokering Split';
        const canRenderSplitAgentId = !!splitAgents.length && isAgentSplit;
        const rowSize = canRenderSplitAgentId ? 3 : 4;
        return (
          <div
            className={classes.paymentItemsWrapper}
            key={`Deduction-item-${i.toString()}`}
          >
            <NestedField field={['deductionItems', i]}>
              <Grid item sm={rowSize} xs={12}>
                <div className={classes.formControlWrapper}>
                  <MaterialCustomSelectInput
                    field="deductionType"
                    id={uuid()}
                    fullWidth
                    label="Deduction Type"
                    name="deductionType"
                    required
                    selectInputItems={deductionTypeSelectItems}
                    validate={deductionTypeValidator}
                    disabled={submittedDeal && !isEditingDeal}
                  />
                </div>
              </Grid>

              {canRenderSplitAgentId && (
                <Grid item sm={rowSize} xs={12}>
                  <div className={classes.formControlWrapper}>
                    <MaterialCustomSelectInput
                      field="agentID"
                      id={uuid()}
                      fullWidth
                      label="Select Agent"
                      name="agentID"
                      required
                      selectInputItems={splitAgents}
                      disabled={(submittedDeal && !isEditingDeal) || isViewType}
                    />
                  </div>
                </Grid>
              )}

              <Grid item sm={rowSize} xs={12}>
                <div className={classes.formControlWrapper}>
                  <CustomTextField
                    field="description"
                    id={uuid()}
                    label="Description"
                    fullWidth
                    required
                    validate={descriptionValidator}
                    disabled={submittedDeal && !isEditingDeal}
                  />
                </div>
              </Grid>

              <Grid item sm={rowSize} xs={12}>
                <div className={classes.formControlWrapper}>
                  <CustomTextField
                    field="amount"
                    id={uuid()}
                    label="Amount"
                    fullWidth
                    validate={deductionsAmountValidator}
                    noLetters
                    required
                    noNegativeSign
                    onChangeWithID={deductionAmountChangeHandler}
                    isDollarAmount
                    disabled={submittedDeal && !isEditingDeal}
                  />
                </div>
              </Grid>
            </NestedField>
            <Button
              classes={{ root: classes.removePaymentBtn }}
              variant="raised"
              color="secondary"
              onClick={() => {
                const amount = Number(formApi.values.deductionItems[i].amount);

                if (amount) {
                  subtractDeductionValueFromState(amount);
                }
                formApi.removeValue('deductionItems', i);
              }}
              type="button"
            >
              Remove
            </Button>
          </div>
        );
      }
    );
    if (shouldRenderInitialDeductionItem) {
      return deductionItems.slice(1);
    }
    return deductionItems;
  }

  render() {
    const {
      classes,
      setAgencyDisclosureForm,
      setContractOrLeaseForms,
      agencyDisclosureForm,
      contractOrLeaseForms,
      subtractPaymentValueFromState,
      subtractDeductionValueFromState,
      choosingMgmtCoBrokeCompany,
      toggleChoosingMgmtCoBrokeCompany,
      handleMgmtOrCobrokeCompanyChange,
      setHasSetNewMgmtOrCobrokeCompany,
      newMgmtOrCobrokeCompany,
      addedManagementCompanies,
      agents,
      uplodingFileProgress,
      isUploadingFile,
      uplodingFileText,
      formSubmissionBegun,
      submittingFormToServer,
      submittedDeal,
      isEditingDeal,
      isViewType,
      agentUUID,
      managementCobrokeCompanyItems,
      agentPaymentTypeIsACH,
      onSubmit,
      userRole,
      isCoAgent,
      isCoAgentEditDeal,
    } = this.props;

    const { contractLeaseAnchorEl, agencyDisclosureAnchorEl } = this.state;

    const managementCobrokeCompanies =
      managementCobrokeCompanyItems && managementCobrokeCompanyItems.length
        ? [...managementCobrokeCompanyItems]
        : [];

    if (submittedDeal && submittedDeal.managementOrCobrokeCompany) {
      if (
        !managementCobrokeCompanies.includes(
          submittedDeal.managementOrCobrokeCompany
        )
      ) {
        managementCobrokeCompanies.push(
          submittedDeal.managementOrCobrokeCompany
        );
      }
    }

    const agentsSelectItems = agents
      .filter(agent => (agentUUID ? agent.uuid !== agentUUID : agent))
      .map(({ firstName, lastName, uuid }) => ({
        label: `${capitalize(firstName)} ${capitalize(
          lastName
        )} (Agent ID - ${uuid})`,
        key: uuid,
        value: uuid,
      }));

    if (isViewType && submittedDeal && submittedDeal.deductionItems.length) {
      submittedDeal.deductionItems.forEach(item => {
        if (item.deductionType === 'Co-Brokering Split') {
          const { firstName, lastName } = agents.find(
            agent => agent.uuid === item.agentID
          );
          const agentName = `${capitalize(firstName)} ${capitalize(
            lastName
          )} (Agent ID - ${item.agentID})`;
          agentsSelectItems.push({
            label: agentName,
            key: item.agentID,
            value: item.agentID,
          });
        }
      });
    }

    let managementCobrokeCompanySelectItems = managementCobrokeCompanies.map(
      company => ({ label: company })
    );

    managementCobrokeCompanySelectItems = managementCobrokeCompanySelectItems
      ? [
          ...managementCobrokeCompanySelectItems,
          ...addedManagementCompanies.map(company => ({ label: company })),
          { label: 'Add a new item...' },
        ]
      : [];

    /*
      const {
        firstName,
        lastName,
        uuid: agentUUID,
        agent: agentPart,
      } = this.props.agent;
      const { agentType, state } = agentPart;
      */

    let finalDefaultValues;
    const isCoBrokeringAgentPaymentType =
      (submittedDeal &&
        submittedDeal.coBrokeringAgentPaymentTypes &&
        submittedDeal.coBrokeringAgentPaymentTypes[0]) ||
      {};
    const isACHAccountNumberCoBroke =
      isCoBrokeringAgentPaymentType.ACHAccountNumber;
    const isACHAccountBankRoutingNumber =
      isCoBrokeringAgentPaymentType.ACHAccountBankRoutingNumber;

    if (submittedDeal) {
      const {
        agentNotes,
        agentType,
        agentName,
        alreadyTurnedFundsIn,
        city,
        clientEmail,
        clientName,
        date,
        dealType,
        leadSource,
        managementOrCobrokeCompany,
        propertyAddress,
        shouldSendApprovalTextMessageNotification,
        state,
        fundsPaidBy,
        agentPaymentType,
        price,
        paymentsTotal,
        deductionsTotal,
        paymentItems,
        deductionItems,
        apartmentNumber,
        total,
        bonusPercentageAddedByAdmin,
        ACHAccountNumber,
        ACHAccountBankRoutingNumber,
        coBrokeringAgentPaymentTypes,
      } = submittedDeal;
      finalDefaultValues = {
        agent: agentName,
        agentNotes,
        agentType,
        alreadyTurnedFundsIn,
        city,
        apartmentNumber,
        clientEmail,
        clientName,
        date: moment(date).format('MMMM Do YYYY'),
        dealType,
        leadSource,
        agentPaymentType,
        managementOrCobrokeCompany,
        propertyAddress,
        shouldSendApprovalTextMessageNotification,
        state,
        fundsPaidBy,
        price,
        coBrokeringAgentPaymentTypes,
        agentPaymentTypeCoBroke: isCoBrokeringAgentPaymentType.agentPaymentType,
        ACHAccountNumberCoBroke: isCoBrokeringAgentPaymentType.ACHAccountNumber,
        ACHAccountBankRoutingNumberCoBroke:
          isCoBrokeringAgentPaymentType.ACHAccountBankRoutingNumber,
        paymentItems: paymentItems.map(
          ({ paymentType, checkOrTransactionNumber, amount }) => ({
            paymentType,
            checkOrTransactionNumber,
            amount,
          })
        ),
        deductionItems: deductionItems.map(
          ({ deductionType, agentID, description, amount }) => ({
            deductionType,
            description,
            amount,
            agentID,
          })
        ),
        paymentsSubtotal: paymentsTotal ? paymentsTotal.toLocaleString() : '0',
        deductionsSubtotal: deductionsTotal
          ? deductionsTotal.toLocaleString()
          : '0',
        financialsTotal: total ? total.toLocaleString() : '0',
        ACHAccountNumber,
        ACHAccountBankRoutingNumber,
        bonusPercentageAddedByAdmin: `${bonusPercentageAddedByAdmin}`,
      };
    }

    const renderContractLeaseMenuItems = () =>
      this.returnContractLeaseURLS().map(({ src }) => {
        const fileName = decodeURIComponent(src.split('/').pop());
        const fileType = src.split('.').pop();

        if (fileType.toLowerCase() === 'pdf') {
          return (
            <a href={src} target="_blank">
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={() => {
                  this.handleContractLeaseMenuClose();
                }}
              >
                {fileName}
              </MenuItem>
            </a>
          );
        }

        return (
          <MenuItem
            classes={{ root: classes.menuItem }}
            onClick={() => {
              this.handleContractLeaseMenuClose();
              this.openFileViewer(src, fileName, fileType);
            }}
          >
            {fileName}
          </MenuItem>
        );
      });

    const renderAgencyDisclosureMenuItems = () =>
      this.returnAgencyDisclosureURL().map(({ src }) => {
        const fileName = decodeURIComponent(src.split('/').pop());
        const fileType = src.split('.').pop();

        if (fileType.toLowerCase() === 'pdf') {
          return (
            <MenuItem
              classes={{ root: classes.menuItem }}
              onClick={this.handleAgencyDisclosureMenuClose}
            >
              <a href={src} target="_blank">
                {fileName}
              </a>
            </MenuItem>
          );
        }

        return (
          <MenuItem
            classes={{ root: classes.menuItem }}
            onClick={() => {
              this.handleAgencyDisclosureMenuClose();
              this.openFileViewer(src, fileName, fileType);
            }}
          >
            {fileName}
          </MenuItem>
        );
      });

    return (
      <div className={classes.formWrapper}>
        <a
          href="#"
          id="fileLink"
          ref={ref => (this._fileLink = ref)}
          style={{
            visibility: 'hidden',
            position: 'absolute',
            poniterEvents: 'none',
          }}
        />

        <Menu
          id="simple-menu"
          anchorEl={contractLeaseAnchorEl}
          open={Boolean(contractLeaseAnchorEl)}
          onClose={this.handleContractLeaseMenuClose}
        >
          <div className={classes.popupMenuTitle}>Contract/Lease Items</div>
          {renderContractLeaseMenuItems()}
        </Menu>

        <Menu
          id="simple-menu2"
          anchorEl={agencyDisclosureAnchorEl}
          open={Boolean(agencyDisclosureAnchorEl)}
          onClose={this.handleAgencyDisclosureMenuClose}
        >
          <div className={classes.popupMenuTitle}>Agency Disclosure Form</div>
          {renderAgencyDisclosureMenuItems()}
        </Menu>

        <Form
          defaultValues={
            !finalDefaultValues && this.props.agent
              ? {
                  date: `${moment().format('MMMM Do YYYY')}`,
                  agentType: `${this.props.agent.agent.agentType}`,
                  state: this.props.agent.agent.state,
                  agent: `${capitalize(
                    this.props.agent.firstName
                  )} ${capitalize(this.props.agent.lastName)}`,
                  paymentsSubtotal: this.props.paymentsTotal,
                  deductionsSubtotal: this.props.deductionsTotal,
                  ACHAccountNumber: this.props.agent.agent.ACHAccountNumber
                    ? `${this.props.agent.agent.ACHAccountNumber}`
                    : undefined,
                  ACHAccountBankRoutingNumber: this.props.agent.agent
                    .ACHAccountBankRoutingNumber
                    ? `${this.props.agent.agent.ACHAccountBankRoutingNumber}`
                    : undefined,
                }
              : finalDefaultValues
          }
          preValidate={this.preValidate}
          validateOnMount
          onSubmit={values => {
            if (onSubmit) {
              onSubmit(values);
            }
          }}
          onSubmitFailure={this.props.onSubmitFailure}
          validate={validators}
          getApi={formApi => {
            this.props.getFormApi(formApi);
          }}
        >
          {formApi => {
            const isAgentSplit =
              formApi.values.deductionItems &&
              formApi.values.deductionItems[0] &&
              formApi.values.deductionItems[0].deductionType ===
                'Co-Brokering Split';

            const canRenderSplitAgentId =
              !!agentsSelectItems.length && isAgentSplit;
            const rowSize = canRenderSplitAgentId ? 3 : 4;

            return (
              <form
                onSubmit={formApi.submitForm}
                id="form1"
                className={classes.formRoot}
                style={{
                  display:
                    formSubmissionBegun || submittingFormToServer
                      ? 'none'
                      : undefined,
                }}
              >
                <Grid container spacing={24}>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="date"
                        id={uuid()}
                        label="Date"
                        disabled
                        fullWidth
                        required
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="agent"
                        id={uuid()}
                        label="Agent"
                        disabled
                        fullWidth
                        required
                      />
                    </div>
                  </Grid>

                  <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomRadioInput
                      field="agentType"
                      id={uuid()}
                      required
                      label="Agent Type"
                      radioInputItems={
                        (this.props.agent &&
                          this.props.agent.agent.agentType > 80) ||
                        (this.props.submittedDeal &&
                          this.props.submittedDeal.agentType > 80)
                          ? radioInputManagementItems
                          : radioInputAgentItems
                      }
                      disabled
                      horizontal
                    />
                  </div>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="leadSource"
                        id={uuid()}
                        label="Lead Source"
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Property Information
                    </Typography>
                  </div>

                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="dealType"
                        id={uuid()}
                        required
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                        label="Deal Type"
                        name="dealType"
                        selectInputItems={dealTypeSelectItems}
                      />
                    </div>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="propertyAddress"
                        id={uuid()}
                        label="Property Address"
                        required
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="state"
                        id={uuid()}
                        label="State"
                        required
                        fullWidth
                        disabled
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="city"
                        id={uuid()}
                        label="City"
                        required
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="apartmentNumber"
                        id={uuid()}
                        label="Apartment Number"
                        required
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  {!choosingMgmtCoBrokeCompany ? (
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <MaterialCustomSelectInput
                          field="managementOrCobrokeCompany"
                          id={uuid()}
                          required
                          fullWidth
                          label="Management/Co-Broke Company"
                          name="managementOrCobrokeCompany"
                          onChange={value => {
                            if (value === 'Add a new item...') {
                              toggleChoosingMgmtCoBrokeCompany(true);
                            }
                          }}
                          selectInputItems={managementCobrokeCompanySelectItems}
                          disabled={submittedDeal && !isEditingDeal}
                        />
                      </div>
                    </Grid>
                  ) : (
                    <Grid item sm={6} xs={12}>
                      <div className={classes.formControlWrapper}>
                        <TextField
                          id="newManagementOrCobrokeCompany"
                          label="Add Mgmt/Co-broke Company..."
                          value={newMgmtOrCobrokeCompany}
                          className={
                            classes.ManagementOrCobrokeCompanyTextField
                          }
                          onChange={handleMgmtOrCobrokeCompanyChange}
                          margin="normal"
                        />
                      </div>
                      <Button
                        classes={{ root: classes.removePaymentBtn }}
                        variant="raised"
                        color="secondary"
                        style={{ marginLeft: '0' }}
                        onClick={() => {
                          toggleChoosingMgmtCoBrokeCompany(false);
                          formApi.setValue('managementOrCobrokeCompany', '');
                        }}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        classes={{ root: classes.addPaymentBtn }}
                        variant="raised"
                        color="primary"
                        style={{ marginLeft: '10px', marginTop: '5px' }}
                        onClick={() => {
                          const trimmedItem = newMgmtOrCobrokeCompany.trim();
                          if (!newMgmtOrCobrokeCompany || !trimmedItem) return;

                          const items = [
                            ...managementCobrokeCompanyItems,
                            ...addedManagementCompanies,
                          ];

                          const regex = new RegExp(trimmedItem, 'i');

                          const match = items.filter(item => item.match(regex));

                          if (match.length) {
                            toggleChoosingMgmtCoBrokeCompany(false);
                            formApi.setValue(
                              'managementOrCobrokeCompany',
                              match[0]
                            );
                            return;
                          }

                          setHasSetNewMgmtOrCobrokeCompany();
                          formApi.setValue(
                            'managementOrCobrokeCompany',
                            capitalize(newMgmtOrCobrokeCompany)
                          );
                        }}
                        type="button"
                      >
                        Add Item
                      </Button>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="price"
                        id={uuid()}
                        label="Rent or Sale Price"
                        required
                        fullWidth
                        noLetters
                        isDollarAmount
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      {"Client's"} Information
                    </Typography>
                  </div>

                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="clientName"
                        id={uuid()}
                        label="Client's Name"
                        required
                        fullWidth
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="clientEmail"
                        id={uuid()}
                        label="Client Email"
                        required
                        fullWidth
                        type="email"
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  {(isEditingDeal || userRole !== agentRole || !isCoAgent) && (
                    <Fragment>
                      <div
                        className={`${classes.formSubheading} ${
                          classes.paddingBottom10
                        }`}
                      >
                        <Typography
                          variant="subheading"
                          classes={{ subheading: classes.h3 }}
                        >
                          Transaction Financials
                        </Typography>
                      </div>

                      <div className={classes.formMiniHeading}>
                        <Typography
                          variant="subheading"
                          classes={{
                            subheading: classes.h4,
                            root: classes.greenText,
                          }}
                        >
                          Paid:
                        </Typography>
                      </div>

                      <NestedField field={['paymentItems', 0]}>
                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <MaterialCustomSelectInput
                              field="paymentType"
                              id={uuid()}
                              required
                              fullWidth
                              label="Payment Type"
                              name="paymentType"
                              selectInputItems={paymentTypeSelectItems}
                              validate={paymentTypeValidator}
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="checkOrTransactionNumber"
                              id={uuid()}
                              label="Check/Transaction#"
                              
                              fullWidth
                              validate={checkOrTransactionNumberValidator}
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>

                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="amount"
                              id={uuid()}
                              label="Amount"
                              required
                              fullWidth
                              validate={paymentAmountValidator}
                              noLetters
                              noNegativeSign
                              onChangeWithID={
                                this.props.paymentAmountChangeHandler
                              }
                              isDollarAmount
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>
                      </NestedField>

                      {formApi.values.paymentItems &&
                        formApi.values.paymentItems
                          .map((paymentItems, i) => (
                            <div
                              className={classes.paymentItemsWrapper}
                              key={i}
                            >
                              <NestedField field={['paymentItems', i]}>
                                <Grid item sm={4} xs={12}>
                                  <div className={classes.formControlWrapper}>
                                    <MaterialCustomSelectInput
                                      field="paymentType"
                                      id={uuid()}
                                      required
                                      fullWidth
                                      label="Payment Type"
                                      name="paymentType"
                                      selectInputItems={paymentTypeSelectItems}
                                      validate={paymentTypeValidator}
                                      disabled={submittedDeal && !isEditingDeal}
                                    />
                                  </div>
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                  <div className={classes.formControlWrapper}>
                                    <CustomTextField
                                      field="checkOrTransactionNumber"
                                      id={uuid()}
                                      label="Check/Transaction#"
                                      fullWidth
                                      validate={
                                        checkOrTransactionNumberValidator
                                      }
                                      disabled={submittedDeal && !isEditingDeal}
                                    />
                                  </div>
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                  <div className={classes.formControlWrapper}>
                                    <CustomTextField
                                      field="amount"
                                      id={uuid()}
                                      label="Amount"
                                      required
                                      fullWidth
                                      validate={paymentAmountValidator}
                                      noLetters
                                      noNegativeSign
                                      onChangeWithID={
                                        this.props.paymentAmountChangeHandler
                                      }
                                      isDollarAmount
                                      disabled={submittedDeal && !isEditingDeal}
                                    />
                                  </div>
                                </Grid>
                              </NestedField>
                              {submittedDeal && !isEditingDeal ? null : (
                                <Button
                                  classes={{ root: classes.removePaymentBtn }}
                                  variant="raised"
                                  color="secondary"
                                  onClick={() => {
                                    const amount = Number(
                                      formApi.values.paymentItems[i].amount
                                    );

                                    if (amount) {
                                      subtractPaymentValueFromState(amount);
                                    }

                                    formApi.removeValue('paymentItems', i);
                                  }}
                                  type="button"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))
                          .slice(1)}
                      <Grid item xs={12}>
                        <Button
                          classes={{ root: classes.addPaymentBtn }}
                          variant="raised"
                          color="primary"
                          onClick={() => formApi.addValue('paymentItems')}
                          type="button"
                          disabled={submittedDeal && !isEditingDeal}
                        >
                          Add payment item
                        </Button>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <div className={classes.formControlWrapper}>
                          <CustomTextField
                            field="paymentsSubtotal"
                            id={uuid()}
                            label="Payments Subtotal"
                            disabled
                            fullWidth
                            submittedValue={this.props.paymentsTotal}
                            formApi={formApi}
                            convertToLocaleString
                            isDollarAmount
                          />
                        </div>
                      </Grid>
                    </Fragment>
                  )}

                  <div className={classes.formMiniHeading2}>
                    <Typography
                      variant="subheading"
                      classes={{
                        subheading: classes.h4,
                        root: classes.redText,
                      }}
                    >
                      Deductions:
                    </Typography>
                  </div>

                  {this.state.shouldRenderInitialDeductionItem ? (
                    <div className={classes.paymentItemsWrapper}>
                      <NestedField field={['deductionItems', 0]}>
                        <Grid item sm={rowSize} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <MaterialCustomSelectInput
                              field="deductionType"
                              id={uuid()}
                              fullWidth
                              label="Deduction Type"
                              name="deductionType"
                              required
                              selectInputItems={deductionTypeSelectItems}
                              validate={deductionTypeValidator}
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>

                        {canRenderSplitAgentId && (
                          <Grid item sm={rowSize} xs={12}>
                            <div className={classes.formControlWrapper}>
                              <MaterialCustomSelectInput
                                field="agentID"
                                id={uuid()}
                                fullWidth
                                label="Select Agent"
                                name="agentID"
                                required
                                disabled={
                                  (submittedDeal && !isEditingDeal) ||
                                  isViewType
                                }
                                selectInputItems={agentsSelectItems}
                              />
                            </div>
                          </Grid>
                        )}

                        <Grid item sm={rowSize} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="description"
                              id={uuid()}
                              label="Description"
                              fullWidth
                              required
                              validate={descriptionValidator}
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>

                        <Grid item sm={rowSize} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="amount"
                              id={uuid()}
                              label="Amount"
                              fullWidth
                              validate={deductionsAmountValidator}
                              noLetters
                              required
                              noNegativeSign
                              onChangeWithID={
                                this.props.deductionAmountChangeHandler
                              }
                              isDollarAmount
                              disabled={submittedDeal && !isEditingDeal}
                            />
                          </div>
                        </Grid>
                      </NestedField>
                      {submittedDeal && !isEditingDeal ? null : (
                        <Button
                          classes={{ root: classes.removePaymentBtn }}
                          variant="raised"
                          color="secondary"
                          onClick={() => {
                            this.setState({
                              shouldRenderInitialDeductionItem: false,
                            });
                            const amount = Number(
                              formApi.values.deductionItems[0].amount
                            );

                            if (amount) {
                              subtractDeductionValueFromState(amount);
                            }
                            formApi.removeValue('deductionItems', 0);
                          }}
                          type="button"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ) : null}

                  {this.renderRestDeductionItems(formApi, agentsSelectItems)}
                  <Grid item xs={12}>
                    <Button
                      classes={{ root: classes.addPaymentBtn }}
                      variant="raised"
                      color="primary"
                      onClick={() => formApi.addValue('deductionItems')}
                      type="button"
                      disabled={submittedDeal && !isEditingDeal}
                    >
                      Add deduction item
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="deductionsSubtotal"
                        id={uuid()}
                        label="Deductions Subtotal"
                        disabled
                        fullWidth
                        submittedValue={`${this.props.deductionsTotal}`}
                        formApi={formApi}
                        convertToLocaleString
                        isDollarAmount
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="financialsTotal"
                        id={uuid()}
                        label="Final Total"
                        disabled
                        fullWidth
                        labelClassName={classes.finalTotalLabelClass}
                        submittedValue={`${this.props.total}`}
                        formApi={formApi}
                        convertToLocaleString
                        isDollarAmount
                        inputRootClassName={classes.finalTotalInputClass}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="agentNotes"
                        id={uuid()}
                        label="Listing agent/performance bonus info"
                        fullWidth
                        multiline
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  <div className={classes.formMiniHeading2}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h4 }}
                    >
                      File Uploads:
                    </Typography>
                  </div>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.fileUploadBtnWrapper}>
                      <CustomFileUploadInputBtn
                        field="agencyDisclosureForm"
                        id="agencyDisclosureUploadForm"
                        label="Upload Agency Disclosure Form*"
                        btnClassName={classes.uploadBtnClassName}
                        customOnChange={setAgencyDisclosureForm}
                        customState={agencyDisclosureForm}
                        helperInfo="Agency Disclosure Form* (PDF or JPEG/JPG file)"
                        acceptedFileExtensions={acceptedFileExtensions}
                        accept=".jpeg, .jpg, .pdf"
                        disabled={submittedDeal && !isEditingDeal}
                        required={isViewType ? undefined : true}
                        submits={formApi.submits}
                        formError={
                          formApi.errors
                            ? formApi.errors.agencyDisclosureForm
                            : undefined
                        }
                        validate={
                          isViewType ? undefined : agencyDisclosureFormValidator
                        }
                      />
                      {submittedDeal &&
                      submittedDeal.agencyDisclosureForm &&
                      !agencyDisclosureForm ? (
                        <Button
                          variant="fab"
                          color="primary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileViewBtn }}
                          onClick={this.handleAgencyDisclosureMenuClick}
                        >
                          <EyeIcon className={classes.viewIcon} />
                        </Button>
                      ) : null}
                      {isEditingDeal && agencyDisclosureForm ? (
                        <Button
                          variant="fab"
                          color="secondary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileRemoveBtn }}
                          onClick={() => {
                            setAgencyDisclosureForm('');
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      ) : null}
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.fileUploadBtnWrapper}>
                      <CustomFileUploadInputBtn
                        field="contractOrLeaseItems"
                        id="contractOrLeaseItemsUploadForm"
                        label="Upload your Contract or Lease items"
                        btnClassName={classes.uploadBtnClassName}
                        multiple
                        customOnChange={setContractOrLeaseForms}
                        customState={contractOrLeaseForms}
                        helperInfo="Contract or Lease items (PDF or JPEG/JPG files)"
                        acceptedFileExtensions={acceptedFileExtensions}
                        accept=".jpeg, .jpg, .pdf"
                        disabled={submittedDeal && !isEditingDeal}
                      />
                      {submittedDeal &&
                      submittedDeal.contractOrLeaseForms &&
                      submittedDeal.contractOrLeaseForms.length &&
                      !(contractOrLeaseForms && contractOrLeaseForms.length) ? (
                        <Button
                          variant="fab"
                          color="primary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileViewBtn }}
                          onClick={this.handleContractLeaseMenuClick}
                        >
                          <EyeIcon className={classes.viewIcon} />
                        </Button>
                      ) : null}
                      {contractOrLeaseForms.length ? (
                        <Button
                          variant="fab"
                          color="secondary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileRemoveBtn }}
                          onClick={() => {
                            setContractOrLeaseForms([]);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      ) : null}
                    </div>
                  </Grid>

                  <div className={classes.formMiniHeading2}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h4 }}
                    >
                      Other:
                    </Typography>
                  </div>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomRadioInput
                      field={`${
                        isCoAgent
                          ? 'agentPaymentTypeCoBroke'
                          : 'agentPaymentType'
                      }`}
                      id={uuid()}
                      required
                      label="How would you like to get paid?"
                      radioInputItems={radioInputAgentPaymentItems}
                      onInput={this.props.onAgentPaymentTypeChange}
                      horizontal
                      disabled={
                        submittedDeal && (!isEditingDeal && !isCoAgentEditDeal)
                      }
                    />
                  </div>

                  {(agentPaymentTypeIsACH ||
                    (submittedDeal &&
                      (submittedDeal.ACHAccountNumber ||
                        isACHAccountNumberCoBroke))) && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field={`${
                            isCoAgent
                              ? 'ACHAccountNumberCoBroke'
                              : 'ACHAccountNumber'
                          }`}
                          id={uuid()}
                          label="ACH Account Number"
                          required
                          fullWidth
                          validate={ACHAccountNumberValidator}
                          disabled={
                            submittedDeal &&
                            (!isEditingDeal && !isCoAgentEditDeal)
                          }
                        />
                      </div>
                    </Grid>
                  )}

                  {(agentPaymentTypeIsACH ||
                    (submittedDeal &&
                      (submittedDeal.ACHAccountBankRoutingNumber ||
                        isACHAccountBankRoutingNumber))) && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field={`${
                            isCoAgent
                              ? 'ACHAccountBankRoutingNumberCoBroke'
                              : 'ACHAccountBankRoutingNumber'
                          }`}
                          id={uuid()}
                          label="ACH Account's Bank Routing Number"
                          required
                          fullWidth
                          validate={ACHAccountNumberValidator}
                          disabled={
                            submittedDeal &&
                            (!isEditingDeal && !isCoAgentEditDeal)
                          }
                        />
                      </div>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="fundsPaidBy"
                        id={uuid()}
                        required
                        fullWidth
                        label="Funds will/have been paid by..."
                        name="fundsPaidBy"
                        selectInputItems={fundsPaidBySelectItems}
                        disabled={submittedDeal && !isEditingDeal}
                      />
                    </div>
                  </Grid>

                  <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomRadioInput
                      field="alreadyTurnedFundsIn"
                      id={uuid()}
                      required
                      label="Have you already deposited or given the funds to us?"
                      radioInputItems={radioInputYesNoItems}
                      horizontal
                      disabled={submittedDeal && !isEditingDeal}
                    />
                  </div>

                  <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomRadioInput
                      field="shouldSendApprovalTextMessageNotification"
                      id={uuid()}
                      required
                      label="Want to recieve a text notification upon deal approval?"
                      radioInputItems={radioInputYesNoItems}
                      horizontal
                      disabled={submittedDeal && !isEditingDeal}
                    />
                  </div>

                  {!this.props.userRole ||
                  !submittedDeal ||
                  (this.props.userRole === agentRole &&
                    submittedDeal.status === 'pending') ||
                  (!submittedDeal.bonusPercentageAddedByAdmin &&
                    submittedDeal.status === 'approved') ? null : (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <FormControl
                          className={classnames(
                            submittedDeal &&
                              submittedDeal.status === 'approved' &&
                              classes.disabled
                          )}
                          disabled={
                            submittedDeal && submittedDeal.status === 'approved'
                          }
                          fullWidth
                        >
                          <InputLabel
                            htmlFor="bonusPercentageAddedByAdmin"
                            className={classnames(
                              submittedDeal &&
                                submittedDeal.status === 'approved' &&
                                classes.disabled
                            )}
                          >
                            Listing agent/performance bonus
                          </InputLabel>
                          <Input
                            id="bonusPercentageAddedByAdmin"
                            value={
                              submittedDeal &&
                              submittedDeal.bonusPercentageAddedByAdmin
                                ? submittedDeal.bonusPercentageAddedByAdmin
                                : this.props.dealBonus
                            }
                            className={classnames(
                              submittedDeal &&
                                submittedDeal.status === 'approved' &&
                                classes.disabled,
                              classes.fullwidthInput
                            )}
                            inputProps={{
                              onInput: this.props.onBonusChange,
                              className:
                                submittedDeal.status === 'approved'
                                  ? classes.disabled
                                  : undefined,
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                    </Grid>
                  )}

                  {submittedDeal &&
                  submittedDeal.netAgentCommission &&
                  submittedDeal.status === 'approved' ? (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <FormControl
                          className={classnames(
                            submittedDeal &&
                              submittedDeal.status === 'approved' &&
                              classes.disabled
                          )}
                          disabled={
                            submittedDeal && submittedDeal.status === 'approved'
                          }
                          fullWidth
                        >
                          <InputLabel
                            htmlFor="netAgentCommission"
                            className={classes.disabled}
                          >
                            Net Agent Commission
                          </InputLabel>
                          <Input
                            id="netAgentCommission"
                            value={
                              submittedDeal && submittedDeal.netAgentCommission
                                ? padStringToDecimalString(
                                    Number(
                                      submittedDeal.netAgentCommission
                                    ).toLocaleString()
                                  )
                                : null
                            }
                            className={classnames(
                              classes.disabled,
                              classes.finalTotalInputClass
                            )}
                            inputProps={{
                              className: classes.disabled,
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}

                  {(this.props.userRole === admin ||
                    this.props.userRole === superAdmin) &&
                  submittedDeal &&
                  submittedDeal.status === 'approved' ? (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <FormControl
                          className={classnames(classes.disabled)}
                          disabled
                          fullWidth
                        >
                          <InputLabel
                            htmlFor="netCompanyCommission"
                            className={classes.disabled}
                          >
                            Net Company Commission
                          </InputLabel>
                          <Input
                            id="netCompanyCommission"
                            value={
                              submittedDeal
                                ? submittedDeal.netCompanyCommission
                                  ? padStringToDecimalString(
                                      Number(
                                        submittedDeal.netCompanyCommission
                                      ).toLocaleString()
                                    )
                                  : 0
                                : null
                            }
                            className={classnames(
                              classes.disabled,
                              classes.finalTotalInputClass
                            )}
                            inputProps={{
                              className: classes.disabled,
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                </Grid>
              </form>
            );
          }}
        </Form>

        {submittingFormToServer ? (
          <div className={classes.formSubmittingWrapper}>
            <Icon type="loading" style={{ color: '#000', fontSize: '4rem' }} />
            <div className={classes.progressBarExplanation}>
              Finishing submission...
            </div>
          </div>
        ) : null}

        {isUploadingFile ? (
          <div className={classes.progressBarWrapper}>
            <CircularProgressbar
              className={classes.progressBar}
              percentage={uplodingFileProgress}
              styles={{
                path: {
                  stroke: `rgba(62, 152, 199, ${uplodingFileProgress / 100})`,
                },
              }}
            />
            <div className={classes.progressBarExplanation}>
              {uplodingFileText || 'Uploading file picture...'}
            </div>
          </div>
        ) : null}

        <Lightbox
          images={this.state.currentLightboxItem}
          isOpen={this.state.lightboxIsOpen}
          onClose={this.closeLightbox}
          onClickPrev={this.onClickPrev}
          onClickNext={this.onClickNext}
          currentImage={this.state.currentLightBoxIndex}
          backdropClosesModal
          customControls={[this.returnDownloadFileBtn()]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SubmitDealForm);
