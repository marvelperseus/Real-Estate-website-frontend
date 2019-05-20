import React from 'react';
import InputMask from 'react-input-mask';

class Input extends React.Component {
  state = {
    value: this.props.defaultValue || '',
  };

  onChange = event => {
    this.setState({
      value: event.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  beforeOfficeNumberMaskedValueChange = (newState, oldState, userInput) => {
    let { value } = newState;
    let { selection } = newState;
    let cursorPosition = selection ? selection.start : null;

    if (
      value.endsWith('x') &&
      userInput !== 'x' &&
      !this.state.value.endsWith('x')
    ) {
      if (cursorPosition === value.length) {
        cursorPosition--;
        selection = { start: cursorPosition, end: cursorPosition };
      }
      value = value.slice(0, -2);
    }

    return {
      value,
      selection,
    };
  };

  beforeMaskedValueChange = () => {
    if (this.props.beforeMaskedValueChange)
      return this.props.beforeMaskedValueChange;
    if (this.props.officePhoneNumber)
      return this.beforeOfficeNumberMaskedValueChange;
    return undefined;
  };

  render() {
    const { props } = this;
    const { beforeMaskedValueChange, officePhoneNumber, ...restProps } = props;

    return (
      <InputMask
        value={this.state.value}
        beforeMaskedValueChange={this.beforeMaskedValueChange()}
        {...restProps}
        onChange={this.onChange}
      />
    );
  }
}

export default Input;
