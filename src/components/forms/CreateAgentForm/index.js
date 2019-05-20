import React, { Component } from 'react';
import { Form } from 'react-form';
import uuid from 'uuid/v4';
import AvatarEditor from 'react-avatar-editor';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import withSizes from 'react-sizes';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import CircularProgressbar from 'react-circular-progressbar';
import { Input as AntDInput, Icon } from 'antd';
import 'react-circular-progressbar/dist/styles.css';
import Slider from '../../CustomSlider';
import validators, { temporaryPasswordValidator } from './formValidation';
import CustomFileUploadInputBtn from '../../CustomFileUploadInputWrapper';
import MaterialCustomTextFieldWrapper from '../../MaterialCustomTextFieldWrapper';
import MaterialCustomRadioInputWrapper from '../../MaterialCustomRadioInputWrapper';
import MaterialCustomSelectInputWrapper from '../../MaterialCustomSelectInputWrapper';
import CustomInputMask from '../../CustomInputMask';
import { states } from '../../../utils/constants';
import { admin, superAdmin } from '../../../constants/userTypes';

const { TextArea } = AntDInput;

const CustomTextField = MaterialCustomTextFieldWrapper;
const MaterialCustomRadioInput = MaterialCustomRadioInputWrapper;
const MaterialCustomSelectInput = MaterialCustomSelectInputWrapper;

const acceptedFileExtensions = ['jpg', 'jpeg'];

const mapSizesToProps = ({ width }) => ({
  smViewport: width < 600,
  mdViewport: width < 960,
  lgViewport: width < 1280,
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '30px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '30px 0',
    },
    backgroundColor: '#fff',
  },
  formRoot: {
    maxWidth: '100%',
  },
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  uploadBtnClassName: {
    display: 'inline-block',
    marginTop: '20px',
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
  },
  profileItemsWrapper: {
    //display: 'inline-block',
    width: '100%',
    textAlign: 'center',
    marginBottom: '30px',
  },
  sliderWrapper: {
    width: '100%',
  },
  formSubheading: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '82px',
  },
  h3: {
    fontWeight: theme.typography.fontWeightMedium,
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
  sliderRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'rgba(0,0,0,.6)',
    marginTop: '15px',
    fontFamily: theme.typography.fontFamily,
  },
  sliderInput: {
    appearance: 'none',
    width: '30%',
    height: '3px',
    background: '#d3d3d3',
    outline: 'none',
    opacity: '0.7',
    transition: 'opacity .2s',
    borderRadius: '50px',
    cursor: 'grab',
    '&:hover': {
      opacity: '1',
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
  },
  sliderLabel: {
    marginBottom: '5px',
    marginRight: 'none',
  },
  radioInputWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  confirmImgBtn: {
    marginLeft: '5px',
    backgroundColor: '#096DF0',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#0950f0',
    },
  },
  setImageWrapper: {
    height: 350,
    width: 350,
    maxWidth: '100%',
    maxHeight: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '20px',
  },
  setImage: {
    height: '100%',
    maxWidth: '100%',
    width: 'auto',
    objectFit: 'contain',
  },
  progressBarWrapper: {
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
  profileDescription: {
    backgroundColor: 'rgba(0,0,0,.07)',
    borderRadius: '5px 5px 0 0',
  },
  formSubmittingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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

const areaOfFocusSelectItems = [
  { label: 'Residential Rentals' },
  { label: 'Residential Sales' },
  { label: 'Commercial Rentals' },
  { label: 'Commercial Sales' },
];

const branchSelectItems = [{ label: 'New York City' }];
const stateSelectItems = states.map(state => ({ label: state }));

@withSizes(mapSizesToProps)
class CreateAgentForm extends Component {
  firstTimeRender = true;

  render() {
    const {
      classes,
      setImageFile,
      imageFile,
      lgViewport,
      setImageScale,
      imageScale,
      adjustedImageScale,
      clearImageFile,
      getFileUploadInput,
      getProfilePicEditor,
      imageFileConfirmed,
      confirmImageFile,
      confirmedImageDataURL,
      loadingSetImg,
      setFinishedLoadingImg,
      uplodingImageProgress,
      formSubmitedSuccessfully,
      isUploadingImage,
      isViewType,
      submittedAgent,
      isEditingAgent,
      currentUserRole,
      onSubmit,
      submittingFormToServer,
      formSubmissionBegun,
    } = this.props;

    let finalDefaultValues;

    if (submittedAgent) {
      console.log("submitted agent seware>>>>>>>> ", submittedAgent);
      const { firstName, lastName, email, agent } = submittedAgent;

      const {
        branch,
        state,
        mobileNumber,
        officeNumber,
        areaOfFocus,
        realEstateLicenseNumber,
        agentType,
        ACHAccountNumber,
        ACHAccountBankRoutingNumber,
        title,
        twitter,
        facebook,
        instagram,
        profileDescription,
        speciality,
        education,
      } = agent;

      finalDefaultValues = {
        firstName,
        lastName,
        mobileNumber,
        officeNumber,
        areaOfFocus,
        realEstateLicenseNumber,
        email,
        agentType,
        branch,
        state,
        ACHAccountNumber,
        ACHAccountBankRoutingNumber,
        title,
        facebook: facebook ? facebook.split('/').pop() : undefined,
        twitter: twitter ? twitter.split('/').pop() : undefined,
        instagram: instagram ? instagram.split('/').pop() : undefined,
        profileDescription,
        speciality,
        education,
      };
    }

    const isAdmin =
      currentUserRole &&
      (currentUserRole === admin || currentUserRole === superAdmin);

    return (
      <div className={classes.root}>
        <Form
          defaultValues={finalDefaultValues || undefined}
          preValidate={this.preValidate}
          onSubmit={onSubmit}
          validateOnMount
          onSubmitFailure={this.props.onSubmitFailure}
          validate={validators}
          getApi={this.props.getFormApi}
        >
          {formApi => {
            if (this.firstTimeRender) {
              this.firstTimeRender = false;
              if (isAdmin && !formApi.getValue('firstName')) {
                formApi.setValue('firstName', '');
              }
            }
            return (
              <form
                onSubmit={formApi.submitForm}
                id="form1"
                className={classes.formRoot}
                style={{
                  display:
                    formSubmitedSuccessfully || submittingFormToServer
                      ? 'none'
                      : undefined,
                }}
              >
                <Grid container spacing={8}>
                  {isAdmin &&
                    !isViewType && (
                      <div className={classes.profileItemsWrapper}>
                        {(imageFile && !imageFileConfirmed) || loadingSetImg ? (
                          <AvatarEditor
                            ref={getProfilePicEditor}
                            image={imageFile || null}
                            width={lgViewport ? 200 : 250}
                            height={lgViewport ? 200 : 250}
                            border={50}
                            color={[0, 0, 0, 0.3]}
                            scale={adjustedImageScale || 1.2}
                            rotate={0}
                            style={{
                              maxWidth: '100%',
                              boxShadow:
                                '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                          />
                        ) : null}
                        {(imageFile && !imageFileConfirmed) || loadingSetImg ? (
                          <div className={classes.sliderWrapper}>
                            <Slider
                              value={imageScale}
                              min={0}
                              max={100}
                              onChange={value => setImageScale(value)}
                              label="Scale:"
                              rootClassName={classes.sliderRoot}
                              labelClassName={classes.sliderLabel}
                              inputClassName={classes.sliderInput}
                            />
                          </div>
                        ) : null}
                        <div
                          className={classes.setImageWrapper}
                          style={{
                            display:
                              !imageFile ||
                              !confirmedImageDataURL ||
                              loadingSetImg
                                ? 'none'
                                : undefined,
                          }}
                        >
                          <img
                            className={classes.setImage}
                            src={confirmedImageDataURL}
                            onLoad={setFinishedLoadingImg}
                            alt="profile pic"
                          />
                        </div>
                        <div>
                          {!imageFileConfirmed || loadingSetImg ? (
                            <CustomFileUploadInputBtn
                              field="profilePicture"
                              id={uuid()}
                              label="Upload Agent's Profile Picture"
                              btnClassName={classes.uploadBtnClassName}
                              required
                              customOnChange={setImageFile}
                              customState={imageFile}
                              helperInfo="Agent's Profile (JPEG/JPG file)"
                              acceptedFileExtensions={acceptedFileExtensions}
                              getInput={getFileUploadInput}
                              accept=".jpg, .jpeg"
                            />
                          ) : null}
                          <div>
                            {imageFile ? (
                              <Button
                                classes={{ root: classes.removePaymentBtn }}
                                variant="raised"
                                color="secondary"
                                onClick={() => clearImageFile()}
                                type="button"
                              >
                                Clear File
                              </Button>
                            ) : null}
                            {(imageFile && !imageFileConfirmed) ||
                            loadingSetImg ? (
                              <Button
                                classes={{ root: classes.confirmImgBtn }}
                                variant="raised"
                                color="primary"
                                onClick={() => confirmImageFile()}
                                type="button"
                              >
                                Confirm File{' '}
                                {loadingSetImg ? (
                                  <Icon
                                    type="loading"
                                    style={{ color: '#fff' }}
                                  />
                                ) : null}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="firstName"
                          id={uuid()}
                          label="First Name"
                          fullWidth
                          required
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}
                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="lastName"
                          id={uuid()}
                          label="Last Name"
                          fullWidth
                          required
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12} md={isAdmin ? 6 : 12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="areaOfFocus"
                        id={uuid()}
                        fullWidth
                        label="Area of Focus"
                        name="areaOfFocus"
                        multiple
                        selectInputItems={areaOfFocusSelectItems}
                        disabled={isViewType && !isEditingAgent}
                      />
                    </div>
                  </Grid>

                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="realEstateLicenseNumber"
                          id={uuid()}
                          label="Real Estate License#"
                          fullWidth
                          required
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}

                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <MaterialCustomSelectInput
                          field="branch"
                          id={uuid()}
                          required
                          fullWidth
                          label="Branch"
                          name="branch"
                          selectInputItems={branchSelectItems}
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}

                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <MaterialCustomSelectInput
                          field="state"
                          id={uuid()}
                          required
                          fullWidth
                          label="State"
                          name="state"
                          selectInputItems={stateSelectItems}
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}

                  {isAdmin && (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="title"
                          id={uuid()}
                          label="Title"
                          fullWidth
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}
                  
                  {!isAdmin && (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="speciality"
                          id={uuid()}
                          label="Speciality"
                          fullWidth
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}
                  
                  {!isAdmin && (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="education"
                          id={uuid()}
                          label="Education"
                          fullWidth
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}

                  {!isViewType && (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="temporaryPassword"
                          id={uuid()}
                          label="Temporary Password"
                          fullWidth
                          required
                          type="password"
                          disabled={isViewType && !isEditingAgent}
                          validate={temporaryPasswordValidator}
                        />
                      </div>
                    </Grid>
                  )}

                  {isAdmin && (
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
                          this.props.isManagement
                            ? radioInputManagementItems
                            : radioInputAgentItems
                        }
                        horizontal
                        disabled={isViewType && !isEditingAgent}
                      />
                    </div>
                  )}

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Contact Information
                    </Typography>
                  </div>

                  {isAdmin && (
                    <Grid item xs={12} md={6}>
                      <div className={classes.formControlWrapper}>
                        <CustomInputMask
                          mask="(999) 999-9999 \x999"
                          placeholder="Office Number"
                          maskChar={null}
                          officePhoneNumber
                          disabled={isViewType && !isEditingAgent}
                          defaultValue={
                            isViewType && submittedAgent
                              ? finalDefaultValues.officeNumber
                              : undefined
                          }
                        >
                          {props => (
                            <CustomTextField
                              field="officeNumber"
                              id={uuid()}
                              label="Office Number"
                              fullWidth
                              type="tel"
                              isInputMasked
                              requiresDefaultOnChange
                              mask="(999) 999-9999 \x999"
                              disabledStyle={isViewType && !isEditingAgent}
                              {...props}
                            />
                          )}
                        </CustomInputMask>
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12} md={isAdmin ? 6 : 12}>
                    <div className={classes.formControlWrapper}>
                      <CustomInputMask
                        mask="(999) 999-9999"
                        maskChar={null}
                        placeholder="Phone Number"
                        disabled={isViewType && !isEditingAgent}
                        defaultValue={
                          isViewType && submittedAgent
                            ? finalDefaultValues.mobileNumber
                            : undefined
                        }
                      >
                        {props => (
                          <CustomTextField
                            field="mobileNumber"
                            id={uuid()}
                            label="Mobile Number"
                            fullWidth
                            required
                            type="tel"
                            isInputMasked
                            requiresDefaultOnChange
                            mask="(999) 999-9999"
                            disabledStyle={isViewType && !isEditingAgent}
                            {...props}
                          />
                        )}
                      </CustomInputMask>
                    </div>
                  </Grid>
                  {isAdmin && (
                    <Grid item xs={12}>
                      <div className={classes.formControlWrapper}>
                        <CustomTextField
                          field="email"
                          id={uuid()}
                          label="Email"
                          fullWidth
                          required
                          type="email"
                          disabled={isViewType && !isEditingAgent}
                        />
                      </div>
                    </Grid>
                  )}

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Other Information
                    </Typography>
                  </div>

                  <Grid item xs={12} md={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="ACHAccountNumber"
                        id={uuid()}
                        label="ACH Account Number"
                        fullWidth
                        disabled={isViewType && !isEditingAgent}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="ACHAccountBankRoutingNumber"
                        id={uuid()}
                        label="ACH Account's Bank Routing Number"
                        fullWidth
                        disabled={isViewType && !isEditingAgent}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="facebook"
                        id={uuid()}
                        label="Facebook URL"
                        fullWidth
                        disabled={isViewType && !isEditingAgent}
                        customPrefix="www.facebook.com/"
                        shrink
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="twitter"
                        id={uuid()}
                        label="Twitter URL"
                        fullWidth
                        disabled={isViewType && !isEditingAgent}
                        customPrefix="www.twitter.com/"
                        shrink
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="instagram"
                        id={uuid()}
                        label="Instagram URL"
                        fullWidth
                        disabled={isViewType && !isEditingAgent}
                        customPrefix="www.instagram.com/"
                        shrink
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        inputRootClassName={classes.profileDescription}
                        field="profileDescription"
                        id={uuid()}
                        label="Profile Description"
                        fullWidth
                        multiline
                        rows={4}
                        rowsMax={12}
                        shrink
                        disabled={isViewType && !isEditingAgent}
                      />
                    </div>
                  </Grid>
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

        {uplodingImageProgress &&
        !submittingFormToServer /*&& isUploadingImage */ ? (
          <div className={classes.progressBarWrapper}>
            <CircularProgressbar
              className={classes.progressBar}
              percentage={uplodingImageProgress}
              styles={{
                path: {
                  stroke: `rgba(62, 152, 199, ${uplodingImageProgress / 100})`,
                },
              }}
            />
            <div className={classes.progressBarExplanation}>
              Uploading profile picture...
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(CreateAgentForm);
