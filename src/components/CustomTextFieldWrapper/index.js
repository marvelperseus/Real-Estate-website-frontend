import React from 'react';
import { observer } from 'mobx-react';
import { Field } from 'react-form';
import { Input, InputWrapper, FormMessage } from './styledComponents';

// Define a custom message component
const Message = ({ color, message }) => (
  <div>
    <FormMessage color={color}>{message}</FormMessage>
  </div>
);

const numbersOnlyRegex = /^\d+$/;

class CustomTextFieldWrapper extends React.Component {
  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <Field
        validate={this.props.validate}
        field={this.props.field}
        {...this.props}
      >
        {fieldApi => {
          const {
            onInput,
            field,
            onBlur,
            onChange,
            numbersOnly,
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

          return (
            <InputWrapper>
              <Input
                value={value || ''}
                onChange={e => {
                  const newValue = e.target.value;
                  if (
                    numbersOnly &&
                    newValue &&
                    !numbersOnlyRegex.test(newValue)
                  ) {
                    return;
                  }
                  setValue(newValue);
                  if (onChange) {
                    onChange(newValue, e);
                  }
                }}
                onBlur={event => {
                  if (event.target.value || touched) setTouched();
                }}
                {...rest}
              />
              {error && touched ? (
                <Message color="#ef5350" message={error} />
              ) : null}
              {!error && warning && touched ? (
                <Message color="orange" message={warning} />
              ) : null}
              {!error && !warning && success ? (
                <Message color="green" message={success} />
              ) : null}
            </InputWrapper>
          );
        }}
      </Field>
    );
  }
}

/*
const CustomTextFieldWrapper = props => (
  <Field validate={props.validate} field={props.field}>
    {fieldApi => {
      const {
        onInput,
        field,
        onBlur,
        onChange,
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

      return (
        <InputWrapper>
          <Input
            value={value || ''}
            onChange={e => {
              console.log(value)
              setValue(e.target.value);
              if (onChange) {
                onChange(e.target.value, e);
              }
            }}
            onBlur={event => {
              if (event.target.value || touched) setTouched();
            }}
            {...rest}
          />
          {error && touched ? <Message color="#ef5350" message={error} /> : null}
          {!error && warning && touched ? (
            <Message color="orange" message={warning} />
          ) : null}
          {!error && !warning && success ? (
            <Message color="green" message={success} />
          ) : null}
        </InputWrapper>
      );
    }}
  </Field>
);
*/

export default observer(CustomTextFieldWrapper);
