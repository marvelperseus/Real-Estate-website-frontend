import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { Field } from 'react-form';
import uuid from 'uuid/v4';
import classnames from 'classnames';
import debounce from 'debounce';

const numbersOnlyRegex = /^\d+$/;
const noLettersRegex = /^[^a-zA-Z]+$/;
const noNegativeSignRegex = /^[^-]/;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    marginLeft: 0,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  disabled: {
    cursor: 'not-allowed',
  },
  redErrorText: {
    color: '#f44336',
  },
});

class CustomTextFieldWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: uuid(),
      submittedValue: this.props.submittedValue,
    };
  }

  componentWillUnmount() {
    if (this._fieldApi) this._fieldApi.setError('');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { convertToLocaleString } = nextProps;
    if (
      nextProps.formApi &&
      nextProps.submittedValue !== prevState.submittedValue
    ) {
      const val = convertToLocaleString
        ? Number(nextProps.submittedValue).toLocaleString()
        : nextProps.submittedValue;
      nextProps.formApi.setValue(nextProps.field, val);
      return { submittedValue: nextProps.submittedValue };
    }
    return null;
  }

  returnStartAdornment = () => {
    const { isDollarAmount, isPercentAmount, customPrefix } = this.props;
    if (isDollarAmount) {
      return <InputAdornment position="start">$</InputAdornment>;
    } else if (isPercentAmount) {
      return <InputAdornment position="start">%</InputAdornment>;
    } else if (customPrefix) {
      return <InputAdornment position="start">{customPrefix}</InputAdornment>;
    }
    return null;
  };

  render() {
    const { returnStartAdornment } = this;

    return (
      <Field
        validate={this.props.validate}
        field={this.props.field}
        {...this.props}
      >
        {fieldApi => {
          const {
            onInput,
            classes,
            submittedClasses,
            label,
            id,
            disabled,
            fullWidth,
            required,
            multiline,
            field,
            onBlur,
            onChange,
            inputClassName,
            labelClassName,
            validate,
            numbersOnly,
            noLetters,
            onChangeWithID,
            submittedValue,
            noNegativeSign,
            convertToLocaleString,
            formApi,
            isDollarAmount,
            inputRootClassName,
            isPercentAmount,
            requiresDefaultOnChange,
            isInputMasked,
            beforeUnmount,
            isEditingDeal,
            defaultValue,
            disabledStyle,
            formControlClassName,
            shrink,
            mask,
            ...rest
          } = this.props;

          const {
            value,
            error,
            warning,
            success,
            setValue,
            setTouched,
            touched,
          } = fieldApi;

          this._fieldApi = fieldApi;

          return (
            <FormControl
              className={classnames(
                disabled || disabledStyle ? classes.disabled : null,
                classes.formControl,
                formControlClassName
              )}
              error={error && touched}
              disabled={disabled || disabledStyle}
              fullWidth={fullWidth}
              required={required}
            >
              {label ? (
                <InputLabel
                  htmlFor={id}
                  shrink={shrink}
                  className={
                    disabled || disabledStyle
                      ? `${classes.disabled} ${labelClassName}`
                      : `${labelClassName}`
                  }
                >
                  {label}
                </InputLabel>
              ) : null}
              <Input
                defaultValue={defaultValue}
                inputRef={ref => (this._input = ref)}
                className={disabled || disabledStyle ? classes.disabled : null}
                inputProps={{
                  className:
                    disabled || disabledStyle
                      ? `${classes.disabled} ${inputClassName}`
                      : `${inputClassName}`,
                }}
                value={value || ''}
                classes={
                  inputRootClassName ? { root: inputRootClassName } : null
                }
                id={id}
                onChange={e => {
                  const newValue = e.target.value;
                  if (
                    numbersOnly &&
                    newValue &&
                    !numbersOnlyRegex.test(newValue)
                  ) {
                    return;
                  }

                  if (noLetters && newValue && !noLettersRegex.test(newValue)) {
                    return;
                  }

                  if (
                    noNegativeSign &&
                    newValue &&
                    !noNegativeSignRegex.test(newValue)
                  ) {
                    return;
                  }

                  if (!isInputMasked) {
                    setValue(newValue);
                  }

                  if (isInputMasked) {
                    if (mask && mask.length && newValue.length <= mask.length) {
                      debounce(() => setValue(this._input.value), 100)();
                    }
                  }

                  if (onChange && typeof onChange === 'function') {
                    if (requiresDefaultOnChange || isInputMasked) {
                      onChange(e, setValue);
                    } else {
                      onChange(newValue, setValue, e);
                    }
                  }

                  if (onChangeWithID && typeof onChangeWithID === 'function') {
                    onChangeWithID(this.state.id, newValue, e);
                  }
                }}
                onBlur={event => {
                  if (event.target.value || touched) setTouched();
                  if (onBlur) {
                    onBlur(event);
                  }
                }}
                multiline={multiline}
                startAdornment={returnStartAdornment()}
                {...rest}
              />
              {error && touched ? (
                <FormHelperText
                  classes={{ root: classes.redErrorText }}
                  id={`${id}-error-text`}
                >
                  {error}
                </FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      </Field>
    );
  }
}

export default withStyles(styles)(observer(CustomTextFieldWrapper));

/*

{error && touched ? <Message color="#ef5350" message={error} /> : null}
        {!error && warning && touched ? (
          <Message color="orange" message={warning} />
        ) : null}
        {!error && !warning && success ? (
          <Message color="green" message={success} />
        ) : null}

*/
