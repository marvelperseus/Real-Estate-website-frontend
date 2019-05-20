import React, { Component } from 'react';
import { Form } from 'react-form';
import uuid from 'uuid/v4';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import withSizes from 'react-sizes';
import Typography from 'material-ui/Typography';
import 'react-circular-progressbar/dist/styles.css';
import { Icon } from 'antd';
import validators, { temporaryPasswordValidator } from './formValidation';
import MaterialCustomTextFieldWrapper from '../../MaterialCustomTextFieldWrapper';
import MaterialCustomSelectInputWrapper from '../../MaterialCustomSelectInputWrapper';
import CustomInputMask from '../../CustomInputMask';
import { states } from '../../../utils/constants';
import { admin, superAdmin } from '../../../constants/userTypes';

const CustomTextField = MaterialCustomTextFieldWrapper;
const MaterialCustomSelectInput = MaterialCustomSelectInputWrapper;

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
    textAlign: 'center',
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

const branchSelectItems = [{ label: 'New York City' }];
const roleSelectItems = [
  { label: 'Admin', value: admin },
  { label: 'Super-Admin', value: superAdmin },
];
const stateSelectItems = states.map(state => ({ label: state }));

@withSizes(mapSizesToProps)
class CreateAgentForm extends Component {
  firstTimeRender = true;

  render() {
    const {
      classes,
      formSubmitedSuccessfully,
      isUploadingImage,
      submittedAdmin,
      isViewType,
      isEditingAdmin,
      onSubmit,
      submittingFormToServer,
    } = this.props;

    let finalDefaultValues;

    if (submittedAdmin) {
      const { firstName, lastName, email, admin, role } = submittedAdmin;

      const { branch, state, mobileNumber, officeNumber } = admin;

      finalDefaultValues = {
        firstName,
        lastName,
        mobileNumber,
        officeNumber,
        email,
        branch,
        state,
        role,
      };
    }

    return (
      <div className={classes.root}>
        <Form
          defaultValues={finalDefaultValues || undefined}
          preValidate={this.preValidate}
          validateOnMount
          onSubmit={values => {
            if (onSubmit) {
              onSubmit(values);
            }
          }}
          onSubmitFailure={this.props.onSubmitFailure}
          validate={validators}
          getApi={this.props.getFormApi}
        >
          {formApi => {
            if (this.firstTimeRender && !formApi.getValue('firstName')) {
              this.firstTimeRender = false;
              formApi.setValue('firstName', '');
            }
            return (
              <form
                onSubmit={formApi.submitForm}
                id="form1"
                style={{
                  display:
                    formSubmitedSuccessfully || submittingFormToServer
                      ? 'none'
                      : undefined,
                }}
              >
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="firstName"
                        id={uuid()}
                        label="First Name"
                        fullWidth
                        required
                        disabled={isViewType && !isEditingAdmin}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="lastName"
                        id={uuid()}
                        label="Last Name"
                        fullWidth
                        required
                        disabled={isViewType && !isEditingAdmin}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="branch"
                        id={uuid()}
                        required
                        fullWidth
                        label="Branch"
                        name="branch"
                        selectInputItems={branchSelectItems}
                        disabled={isViewType && !isEditingAdmin}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="state"
                        id={uuid()}
                        required
                        fullWidth
                        label="State"
                        name="state"
                        selectInputItems={stateSelectItems}
                        disabled={isViewType && !isEditingAdmin}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="role"
                        id={uuid()}
                        required
                        fullWidth
                        label="Role"
                        name="role"
                        selectInputItems={roleSelectItems}
                        disabled={isViewType && !isEditingAdmin}
                      />
                    </div>
                  </Grid>

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
                          validate={temporaryPasswordValidator}
                        />
                      </div>
                    </Grid>
                  )}

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Contact Information
                    </Typography>
                  </div>

                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomInputMask
                        mask="(999) 999-9999 \x999"
                        placeholder="Office Number"
                        maskChar={null}
                        officePhoneNumber
                        disabled={isViewType && !isEditingAdmin}
                        defaultValue={
                          isViewType && submittedAdmin
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
                            required
                            type="tel"
                            isInputMasked
                            requiresDefaultOnChange
                            disabledStyle={isViewType && !isEditingAdmin}
                            mask="(999) 999-9999 \x999"
                            {...props}
                          />
                        )}
                      </CustomInputMask>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomInputMask
                        mask="(999) 999-9999"
                        maskChar={null}
                        placeholder="Phone Number"
                        disabled={isViewType && !isEditingAdmin}
                        defaultValue={
                          isViewType && submittedAdmin
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
                            disabledStyle={isViewType && !isEditingAdmin}
                            mask="(999) 999-9999"
                            {...props}
                          />
                        )}
                      </CustomInputMask>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="email"
                        id={uuid()}
                        label="Email"
                        fullWidth
                        required
                        type="email"
                        disabled={isViewType && !isEditingAdmin}
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
      </div>
    );
  }
}

export default withStyles(styles)(CreateAgentForm);
