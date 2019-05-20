import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

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
  textAlignLeft: {
    textAlign: 'left',
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '0 10px',
    width: '100%',
    flexWrap: 'wrap',
  },
});
var returnValue = [];

const MaterialCustomCheckboxInputWrapper = props => (
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
          <Grid
            item
            key={item.label}
            sm={4}
            xs={12}
            className={classes.textAlignLeft}
          >
            <FormControlLabel
              key={item.label}
              value={item.value || item.label}
              disabled={item.disabled}
              classes={{ root: classnames(disabled && classes.disabled) }}
              control={
                <Checkbox
                  checked={value && value.indexOf(item.label) > -1}
                  onChange={event => {
                    if (value) {
                      returnValue = [];
                      value.map(item => {
                        returnValue.push(item);
                      });
                    }
                    if (event.target.checked) {
                      returnValue.push(event.target.value);
                    } else {
                      let i = returnValue.indexOf(event.target.value);
                      if (i > -1) {
                        returnValue.splice(i, 1);
                      }
                    }
                    setValue(returnValue);

                    if (onInput) {
                      onInput(event);
                    }
                  }}
                  onBlur={event => {
                    if (event.target.value || touched) setTouched();
                  }}
                  {...rest}
                />
              }
              label={item.label}
            />
          </Grid>
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
            {/* <RadioGroup
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
            > */}
            <Grid className={classes.subContainer}>
              {renderRadioInputItems(radioInputItems)}
            </Grid>
            {/* </RadioGroup> */}
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

export default withStyles(styles)(observer(MaterialCustomCheckboxInputWrapper));

/*

{error && touched ? <Message color="#ef5350" message={error} /> : null}
        {!error && warning && touched ? (
          <Message color="orange" message={warning} />
        ) : null}
        {!error && !warning && success ? (
          <Message color="green" message={success} />
        ) : null}

*/
