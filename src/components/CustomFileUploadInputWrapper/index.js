import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { Field } from 'react-form';
import { FormMessage } from '../CustomTextFieldWrapper/styledComponents';
import Tooltip from 'material-ui/Tooltip';
import classnames from 'classnames';

const Message = ({ color, message }) => (
  <div>
    <FormMessage color={color}>{message}</FormMessage>
  </div>
);

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  input: {
    width: '0.1px',
    height: '0.1px',
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1',
  },
  helperText: {
    textAlign: 'center',
  },
  info: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  disabled: {
    //pointerEvents: 'none',
    opacity: '.6',
    pointerEvents: 'none',
  },
});

@observer
class CustomFileUploadInputWrapper extends React.Component {
  shouldComponentUpdate() {
    return true;
  }
  renderLabelText = shouldBefullText => {
    const { multiple, label, customState } = this.props;
    if (!customState) return label;
    if (multiple) {
      if (!customState.length) return label;
      if (shouldBefullText) {
        return customState.map(item => item.name).join(', ');
      }
      if (customState.length > 1) return `${customState[0].name},...`;
      return customState[0].name;
    }
    return customState.name;
  };

  renderLabelComponent = () => {
    const { disabled, classes } = this.props;
    const tooltipIncludedComp = (
      <Tooltip
        id={this.props.id}
        title={this.renderLabelText(true)}
        enterDelay={300}
        leaveDelay={100}
      >
        <label
          htmlFor={this.props.id}
          disabled={disabled}
          className={classnames(
            this.props.btnClassName,
            disabled && classes.disabled
          )}
        >
          {this.renderLabelText()}
        </label>
      </Tooltip>
    );

    const withoutTooltipComp = (
      <label
        htmlFor={this.props.id}
        disabled={disabled}
        className={classnames(
          this.props.btnClassName,
          disabled && classes.disabled
        )}
      >
        {this.renderLabelText()}
      </label>
    );

    if (
      this.props.multiple &&
      this.props.customState &&
      this.props.customState.length > 1
    ) {
      return tooltipIncludedComp;
    }
    return withoutTooltipComp;
  };

  isAcceptedFileExtension = (
    filesObject,
    acceptedFileExtensions,
    hasMultiple
  ) => {
    let ok = true;

    if (hasMultiple) {
      const fileArray = Object.keys(filesObject).map(key => filesObject[key]);

      fileArray.forEach(file => {
        const filePartsArray = file.name.split('.');
        const extension = filePartsArray.pop();

        if (!extension) {
          ok = false;
          return;
        }

        if (!acceptedFileExtensions.includes(extension.toLowerCase()))
          ok = false;
      });
    } else {
      const filePartsArray = filesObject[0].name.split('.');
      const extension = filePartsArray.pop();

      if (!extension) {
        ok = false;
      } else if (!acceptedFileExtensions.includes(extension.toLowerCase())) {
        ok = false;
      }
    }

    return ok;
  };

  render() {
    //const { props } = this;

    return (
      <Field {...this.props}>
        {fieldApi => {
          const {
            onInput,
            classes,
            label,
            id,
            disabled,
            fullWidth,
            required,
            multiple,
            field,
            onBlur,
            onChange,
            btnClassName,
            customOnChange,
            customState,
            helperInfo,
            acceptedFileExtensions,
            input,
            getInput,
            validate,
            submits,
            ...rest
          } = this.props;

          const {
            value,
            error,
            warning,
            success,
            setError,
            setValue,
            setTouched,
            touched,
          } = fieldApi;

          return (
            <FormControl
              className={classes.formControl}
              error={(error && touched) || (error && submits)}
              fullWidth={fullWidth}
              required={required}
            >
              {this.renderLabelComponent()}
              <input
                disabled={disabled}
                className={classes.input}
                type="file"
                id={id}
                multiple={multiple}
                ref={input => getInput && getInput(input)}
                onChange={e => {
                  const { files } = e.target;
                  if (multiple) {
                    if (!files[0]) return;
                    if (
                      !this.isAcceptedFileExtension(
                        files,
                        acceptedFileExtensions,
                        true
                      )
                    ) {
                      setError(
                        `Files must be one of the following types: ${acceptedFileExtensions.join(
                          ', '
                        )}`
                      );
                      if (!touched) setTouched();
                      setTimeout(() => {
                        if (!error) setError();
                      }, 8000);
                      return;
                    }
                    setValue(files[0]);
                    if (customOnChange) {
                      customOnChange(files);
                    }
                  } else {
                    const file = files[0];
                    if (!file) return;
                    if (
                      !this.isAcceptedFileExtension(
                        files,
                        acceptedFileExtensions
                      )
                    ) {
                      setError(
                        `Files must be one of the following types: ${acceptedFileExtensions.join(
                          ', '
                        )}`
                      );
                      if (!touched) setTouched();
                      setTimeout(() => {
                        if (!error) setError();
                      }, 6000);
                      return;
                    }
                    setValue(file);
                    if (customOnChange) {
                      customOnChange(file);
                    }
                    if (error) {
                      setError();
                    }
                  }
                  if (onChange) {
                    onChange(multiple ? e.target.files : e.target.files[0], e);
                  }
                }}
                onBlur={event => {
                  if (event.target.files[0]) setTouched();
                  if (onBlur) {
                    onBlur(event);
                  }
                }}
                {...rest}
              />
              {(error && touched) || (error && submits) ? (
                <FormHelperText
                  id={`${id}-error-text`}
                  classes={{ root: classes.helperText }}
                >
                  {error}
                </FormHelperText>
              ) : null}
              {helperInfo ? (
                <FormHelperText
                  classes={{ root: `${classes.helperText} ${classes.info}` }}
                  id={`${id}-info-text`}
                >
                  {helperInfo}
                </FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      </Field>
    );
  }
}

export default withStyles(styles)(CustomFileUploadInputWrapper);

/*

{error && touched ? <Message color="#ef5350" message={error} /> : null}
        {!error && warning && touched ? (
          <Message color="orange" message={warning} />
        ) : null}
        {!error && !warning && success ? (
          <Message color="green" message={success} />
        ) : null}

*/
