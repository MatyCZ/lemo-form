import PropTypes from "prop-types";
import React from "react";
import { CustomInput, FormGroup, Input, InputGroup } from "reactstrap";

// Components
import FieldAddonAppend from "./FieldAddonAppend";
import FieldAddonPrepend from "./FieldAddonPrepend";
import FieldFeedback from "./FieldFeedback";
import FieldLabel from "./FieldLabel";
import FieldText from "./FieldText";

// HOC
import withFormApi from "../hocs/withFormApi";

class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: props.disabled,
      error: props.error,
      label: props.label,
      name: props.name,
      options: props.options,
      required: props.required,
      validatorsEnabled: props.validatorsEnabled,
      value: props.value,
      text: props.text,
      type: props.type,
      visible: props.visible
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { formApi } = this.props;

    formApi.setField(this.state.name, this);
  }

  componentWillUnmount() {
    const { formApi } = this.props;

    formApi.removeField(this.state.name);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error
      });
    }
    if (nextProps.label !== this.props.label) {
      this.setState({
        label: nextProps.label
      });
    }
    if (nextProps.options !== this.props.options) {
      this.setState({
        options: nextProps.options
      });
    }
    if (nextProps.required !== this.props.required) {
      this.setState({
        required: nextProps.required
      });
    }
    if (nextProps.text !== this.props.text) {
      this.setState({
        text: nextProps.text
      });
    }
    if (nextProps.validatorsEnabled !== this.props.validatorsEnabled) {
      this.setState({
        validatorsEnabled: nextProps.validatorsEnabled
      });
    }
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        visible: nextProps.visible
      });
    }
  }

  handleBlur(e) {
    const { formApi } = this.props;

    if ("file" === this.state.type) {
      formApi.setValue(e.target.name + "Metadata", e.target.files[0]);
    }

    formApi.handleOnBlur(e.target.name, e.target.value);
  }

  handleChange(e) {
    const { formApi } = this.props;
    let name = e.target.name;
    let value = e.target.value;

    switch (this.state.type) {
      case "checkbox":
        value = e.target.checked;
        break;
      case "file":
        formApi.setValue(name + "Metadata", e.target.files[0]);
        break;
      case "multicheckbox":
        let values = formApi.getValue(name);
        let isChecked = e.target.checked;

        if (!Array.isArray(values)) {
          values = [];
        }

        if (isChecked) {
          values.push(value);
        } else {
          const index = values.indexOf(value);
          if (index > -1) {
            values.splice(index, 1);
          }
        }

        value = values;
        break;
      default:
        value = e.target.value;
    }

    formApi.handleOnChange(name, value);
  }

  render() {
    const { addonAppendIcon, addonAppendText, addonPrependIcon, addonPrependText } = this.props;
    const { error, label, name, required, text, type, visible } = this.state;

    if (!visible) {
      return "";
    }

    // Vyrenderujeme si konkretni element
    let input = null;
    switch (type) {
      case "checkbox":
        input = this.renderCheckbox();
        break;
      case "multicheckbox":
        input = this.renderMultiCheckbox();
        break;
      case "select":
        input = this.renderSelect();
        break;
      default:
        input = this.renderInput();
    }

    return (
      <FormGroup>
        <FieldLabel name={name} required={required} text={label} />
        <InputGroup>
          <FieldAddonPrepend icon={addonPrependIcon} text={addonPrependText} />
          {input}
          <FieldAddonAppend icon={addonAppendIcon} text={addonAppendText} />
          <FieldFeedback error={error} />
        </InputGroup>
        <FieldText text={text} />
      </FormGroup>
    );
  }

  renderInput() {
    let { children, className, innerRef, invalid, plaintext, size, tag, valid } = this.props;
    let { disabled, error, name, required, type, value } = this.state;

    return (
      <Input
        children={children}
        className={className}
        disabled={disabled}
        innerRef={innerRef}
        invalid={invalid || !!error}
        name={name}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        plaintext={plaintext}
        required={required}
        size={size}
        tag={tag}
        type={type}
        valid={valid}
        value={!value && value !== 0 ? "" : value}
      />
    );
  }

  renderCheckbox() {
    let { children, className, innerRef, invalid, plaintext, size, tag, valid } = this.props;
    let { disabled, error, label, name, required, value } = this.state;

    value = 1 === value || true === value;

    return (
      <div>
        <CustomInput
          checked={!!value}
          children={children}
          className={className}
          disabled={disabled}
          id={name}
          innerRef={innerRef}
          invalid={invalid || !!error}
          label={label}
          name={name}
          onChange={this.handleChange}
          plaintext={plaintext}
          required={required}
          size={size}
          tag={tag}
          valid={valid}
          value={value}
          type="checkbox"
        />
      </div>
    );
  }

  renderMultiCheckbox() {
    let { className, innerRef, invalid, optionsKey, optionsValue, plaintext, size, tag, valid } = this.props;
    let { disabled, error, name, options, required, value } = this.state;

    if (0 === options.length) {
      return null;
    }

    const values = value || [];

    return (
      <div>
        {options.map((option, index) => (
          <CustomInput
            checked={values.includes(option[optionsKey])}
            className={className}
            disabled={disabled}
            id={name + "-" + option[optionsKey]}
            innerRef={innerRef}
            invalid={invalid || !!error}
            key={index}
            label={option[optionsValue]}
            name={name}
            onChange={this.handleChange}
            plaintext={plaintext}
            required={required}
            size={size}
            tag={tag}
            valid={valid}
            value={option[optionsKey]}
            type="checkbox"
          />
        ))}
      </div>
    );
  }

  renderSelect() {
    let {
      children,
      className,
      disabledIfEmptyOptions,
      innerRef,
      invalid,
      optionsKey,
      optionsValue,
      optionsEmpty,
      plaintext,
      size,
      tag,
      valid
    } = this.props;
    let { disabled, error, name, options, required, type, value } = this.state;

    if (true === disabledIfEmptyOptions && 0 === options.length) {
      disabled = true;
    }

    if (0 === options.length) {
      value = "";
    }

    return (
      <Input
        children={children}
        className={className}
        disabled={disabled}
        innerRef={innerRef}
        invalid={invalid || !!error}
        name={name}
        options={options}
        onChange={this.handleChange}
        plaintext={plaintext}
        required={required}
        size={size}
        tag={tag}
        type={type}
        valid={valid}
        value={value || ""}
      >
        {optionsEmpty && <option value="">-</option>}
        {options.map(option => (
          <option key={option[optionsKey]} value={option[optionsKey]}>
            {option[optionsValue]}
          </option>
        ))}
      </Input>
    );
  }
}

Field.defaultProps = {
  addonAppendIcon: null,
  addonAppendText: null,
  addonPrependIcon: null,
  addonPrependText: null,
  disabled: false,
  disabledIfEmptyOptions: true,
  disabledIfInvalid: [],
  error: null,
  options: [],
  optionsEmpty: true,
  required: false,
  requiredIfNotEmpty: [],
  text: null,
  touched: false,
  type: "text",
  validateIfChange: [],
  validateOnChange: true,
  validators: [],
  validatorsEnabled: true,
  value: null,
  visible: true
};

Field.propTypes = {
  addon: PropTypes.bool,
  addonAppendIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  addonAppendText: PropTypes.string,
  addonPrependIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  addonPrependText: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledIfEmptyOptions: PropTypes.bool,
  disabledIfInvalid: PropTypes.array,
  error: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onBlurIfValid: PropTypes.func,
  onChange: PropTypes.func,
  onChangeIfValid: PropTypes.func,
  onNormalize: PropTypes.func,
  onValidate: PropTypes.func,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  optionsEmpty: PropTypes.bool,
  optionsKey: PropTypes.string,
  optionsValue: PropTypes.string,
  plaintext: PropTypes.bool,
  required: PropTypes.bool,
  requiredIfNotEmpty: PropTypes.array,
  size: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  text: PropTypes.string,
  touched: PropTypes.bool,
  type: PropTypes.string,
  valid: PropTypes.bool,
  validateIfChange: PropTypes.array,
  validateOnChange: PropTypes.bool,
  validators: PropTypes.array,
  validatorsEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default withFormApi(Field);
