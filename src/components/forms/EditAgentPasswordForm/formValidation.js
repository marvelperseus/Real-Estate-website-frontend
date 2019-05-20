const validator = values => {
  return {
    password:
      !values.password || values.password.length < 8
        ? 'This value is required and must be at least 8 characters long!'
        : null,
    passwordConfirmation:
      !values.passwordConfirmation ||
      values.passwordConfirmation !== values.password
        ? 'This value is required and must match your new password!'
        : null,
  };
};

export default validator;
