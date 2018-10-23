// Components
import FieldAddonAppend from "./FieldAddonAppend";
import FieldAddonPrepend from "./FieldAddonPrepend";
import FieldFeedback from "./FieldFeedback";
import FieldLabel from "./FieldLabel";
import FieldText from "./FieldText";

// HOC
import withFormApi from "../hocs/withFormApi";

// PropTypes
import PropTypes from "prop-types";

// React
import React from "react";

// Reactstrap
import { FormGroup, Input, InputGroup } from "reactstrap";

class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: props.disabled,
      error: props.formApi.getError(props.name),
      options: props.options,
      required: props.required,
      validatorsEnabled: props.validatorsEnabled,
      value: props.formApi.getValue(props.name),
      visible: props.visible
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { formApi } = this.props;

    formApi.setField(this.props.name, this);
  }

  componentWillUnmount() {
    const { formApi } = this.props;

    formApi.removeField(this.props.name);
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

    if ("file" === this.props.type) {
      formApi.setValue(e.target.name + "Metadata", e.target.files[0]);
    }

    formApi.handleOnBlur(e.target.name, e.target.value);
  }

  handleChange(e) {
    const { formApi } = this.props;

    if ("file" === this.props.type) {
      formApi.setValue(e.target.name + "Metadata", e.target.files[0]);
    }

    formApi.handleOnChange(e.target.name, e.target.value);
  }

  render() {
    const {
      addonAppendIcon,
      addonAppendText,
      addonPrependIcon,
      addonPrependText,
      disabledIfEmptyOptions,
      label,
      name,
      optionsEmpty,
      text,
      type
    } = this.props;

    const { error, options, required, visible } = this.state;

    let { disabled, value } = this.state;

    if (!visible) {
      return "";
    }

    let field = null;
    switch (type) {
      case "select":
        if (true === disabledIfEmptyOptions && 0 === options.length) {
          disabled = true;
        }

        if (0 === options.length) {
          value = "";
        }

        field = (
          <Input
            disabled={disabled}
            invalid={!!error}
            name={name}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            required={required}
            type={type}
            value={value || ""}
          >
            {optionsEmpty && <option value="">-</option>}
            {this.renderOptions()}
          </Input>
        );
        break;
      default:
        field = (
          <Input
            disabled={disabled}
            invalid={!!error}
            name={name}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            required={required}
            type={type}
            value={!value && value !== 0 ? "" : value}
          />
        );
    }

    return (
      <FormGroup>
        <FieldLabel name={name} required={required} text={label} />
        <InputGroup>
          <FieldAddonPrepend icon={addonPrependIcon} text={addonPrependText} />
          {field}
          <FieldAddonAppend icon={addonAppendIcon} text={addonAppendText} />
          <FieldFeedback error={error} />
        </InputGroup>
        <FieldText text={text} />
      </FormGroup>
    );
  }

  renderOptions() {
    const { options, optionsKey, optionsValue } = this.props;

    return options.map(option => (
      <option key={option[optionsKey]} value={option[optionsKey]}>
        {option[optionsValue]}
      </option>
    ));
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
  value: "",
  visible: true
};

Field.propTypes = {
  addonAppendIcon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  addonAppendText: PropTypes.string,
  addonPrependIcon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  addonPrependText: PropTypes.string,
  disabled: PropTypes.bool,
  disabledIfEmptyOptions: PropTypes.bool,
  disabledIfInvalid: PropTypes.array,
  error: PropTypes.string,
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
  required: PropTypes.bool,
  requiredIfNotEmpty: PropTypes.array,
  ref: PropTypes.func,
  text: PropTypes.string,
  touched: PropTypes.bool,
  type: PropTypes.string,
  validateIfChange: PropTypes.array,
  validateOnChange: PropTypes.bool,
  validators: PropTypes.array,
  validatorsEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default withFormApi(Field);
