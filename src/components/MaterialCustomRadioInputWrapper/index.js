import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormControlLabel,
} from 'material-ui/Form';
import { Field } from 'react-form';
import classnames from 'classnames';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: 0,
    width: 200,
  },
  disabled: {
    cursor: 'not-allowed',
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  horzontalRadioBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
});

const MaterialCustomRadioInputWrapper = props => (
  <Field validate={props.validate} field={props.field} {...props}>
    {fieldApi => {
      const {
        onInput,
        classes,
        label,
        id,
        disabled,
        fullWidth,
        required,
        multiline,
        field,
        onBlur,
        onChange,
        radioInputItems,
        horizontal,
        className,
        multiple,
        name,
        validate,
        ...rest
      } = props;

      const {
        value,
        error,
        warning,
        success,
        setValue,
        setTouched,
        touched,
      } = fieldApi;

      const renderRadioInputItems = radioInputItems =>
        radioInputItems.map(item => (
          <FormControlLabel
            key={item.label}
            value={item.value || item.label}
            disabled={item.disabled}
            classes={{ root: classnames(disabled && classes.disabled) }}
            control={<Radio />}
            label={item.label}
          />
        ));

      return (
        <div className={classes.root}>
          <FormControl
            component="fieldset"
            error={error && touched}
            fullWidth={fullWidth}
            required={required}
            className={
              disabled
                ? `${classes.formControl} ${classes.disabled} ${className}`
                : `${classes.formControl} ${className}`
            }
            disabled={disabled}
          >
            <FormLabel
              component="legend"
              className={classnames(
                horizontal ? classes.textAlignCenter : undefined
              )}
            >
              {label}
            </FormLabel>
            <RadioGroup
              aria-label={label}
              name={`${id}1`}
              className={classnames(
                classes.group,
                horizontal && classes.horzontalRadioBtns
              )}
              value={value || null}
              onChange={event => {
                setValue(event.target.value);
                if (onInput) {
                  onInput(event);
                }
              }}
              onBlur={event => {
                if (event.target.value || touched) setTouched();
              }}
              {...rest}
            >
              {renderRadioInputItems(radioInputItems)}
            </RadioGroup>
            {error && touched ? (
              <FormHelperText
                classes={horizontal ? { root: classes.textAlignCenter } : null}
              >
                {error}
              </FormHelperText>
            ) : null}
          </FormControl>
        </div>
      );
    }}
  </Field>
);

export default withStyles(styles)(observer(MaterialCustomRadioInputWrapper));

/*

{error && touched ? <Message color="#ef5350" message={error} /> : null}
        {!error && warning && touched ? (
          <Message color="orange" message={warning} />
        ) : null}
        {!error && !warning && success ? (
          <Message color="green" message={success} />
        ) : null}

*/
