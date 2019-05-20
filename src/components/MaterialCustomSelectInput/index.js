import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  disabled: {
    cursor: 'not-allowed',
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit,
    marginLeft: 0,
  },
  fullWidth: {
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  input: {
    textAlign: 'left',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const MaterialCustomSelectInput = props => {
  const {
    error,
    touched,
    required,
    disabled,
    classes,
    className,
    label,
    id,
    value,
    multiple,
    onInput,
    name,
    onBlur,
    placeholder,
    selectInputItems,
    SelectDisplayProps,
    fullWidth,
    native,
    ...rest
  } = props;

  const renderSelectInputItems = selectInputItems => (
    selectInputItems.map(item => (
      <MenuItem key={item.label} value={item.value || item.label}>{item.label}</MenuItem>
    ))
  );

  return (
    <FormControl
      error={error}
      required={required}
      className={disabled ?
        `${classes.formControl} ${classes.disabled} ${className}` :
        `${classes.formControl} ${className}`}
    >
      {label && <InputLabel htmlFor={`${id}-error`}>{label}</InputLabel>}
      <Select
        SelectDisplayProps={SelectDisplayProps || { style: { backgroundColor: 'inherit' } }}
        onClose={event => event.target.blur()}
        placeholder={placeholder}
        native={native}
        value={multiple ? value || [] : value || ''}
        onChange={event => {
          if (onInput) {
            onInput(event);
          }
        }}
        input={<Input name={name} id={`${id}-helper`} className={classes.input} />}
        onBlur={event => {
          if (onBlur) {
            onBlur(event);
          }
        }}
        multiple={multiple}
        renderValue={!multiple ? null : selected => (
          <div className={classes.chips}>
            {selected.map(value => <Chip key={value} label={value} className={classes.chip} />)}
          </div>
        )}
        {...rest}
      >
        {renderSelectInputItems(selectInputItems)}
      </Select>
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};

export default withStyles(styles)(observer(MaterialCustomSelectInput));
