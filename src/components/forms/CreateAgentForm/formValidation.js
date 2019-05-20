import * as emailValidator from 'email-validator';

const validator = values => {
  return {
    firstName: !values.firstName ? 'This value is required' : null,
    lastName: !values.lastName ? 'This value is required' : null,
    realEstateLicenseNumber: !values.realEstateLicenseNumber
      ? 'This value is required'
      : null,
    agentType: !values.agentType ? 'This value is required' : null,
    branch: !values.branch ? 'This value is required' : null,
    state: !values.state ? 'This value is required' : null,
    officeNumber:
      values.officeNumber && values.officeNumber.length < 14
        ? 'If provided, this value must be a full tel number with area code'
        : null,
    mobileNumber:
      !values.mobileNumber ||
      (values.mobileNumber && values.mobileNumber.length < 14)
        ? 'This value is required and must be a full tel number with area code'
        : null,
    email:
      !values.email || !emailValidator.validate(values.email)
        ? 'This value is required and must be a valid email'
        : null,
  };
};

export const temporaryPasswordValidator = value => ({
  error:
    !value || value.length < 8
      ? 'This value is required and must be at least 8 characters long'
      : null,
});

export default validator;
