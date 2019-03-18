import PropTypes from "prop-types";
import React from "react";
import has from "has-value";
import get from "get-value";
import set from "set-value";
import unset from "unset-value";

// Components
import FormContext from "./FormContext";

// Reactstrap
import { Form as ReactstrapForm } from "reactstrap";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHighlightingErrors: false,
      isSubmitting: false
    };

    this.errors = {};
    this.fields = new Map();
    this.fieldsDisabledIfInvalid = new Map();
    this.fieldsRequiredIfNotEmpty = new Map();
    this.fieldsTriggerDisabled = new Map();
    this.touched = {};
    this.setValues(props.values);

    // Nastavime hodnoty
    this.getError = this.getError.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.getField = this.getField.bind(this);
    this.getTouched = this.getTouched.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getValues = this.getValues.bind(this);
    this.hasError = this.hasError.bind(this);
    this.hasField = this.hasField.bind(this);
    this.hasTouched = this.hasTouched.bind(this);
    this.hasValue = this.hasValue.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.removeError = this.removeError.bind(this);
    this.removeField = this.removeField.bind(this);
    this.removeTouched = this.removeTouched.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.setError = this.setError.bind(this);
    this.setField = this.setField.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setValues = this.setValues.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values !== this.props.values) {
      this.setValues(nextProps.values);

      if (0 === Object.keys(nextProps.values).length) {
        this.fields.forEach(field => {
          field.setState({
            error: null,
            touched: false,
            value: null
          });
        });
      } else {
        this.fields.forEach(field => {
          let fieldName = field.state.name;

          if (nextProps.values.hasOwnProperty(fieldName)) {
            field.setState({
              value: nextProps.values[fieldName]
            });
          }
        });
      }
    }
  }

  getError(name) {
    if (!this.hasError(name)) {
      return null;
    }

    return get(this.errors, name);
  }

  getErrors() {
    return this.errors;
  }

  getField(name) {
    if (!this.fields.has(name)) {
      return null;
    }

    return this.fields.get(name);
  }

  getTouched(name) {
    if (!this.hasTouched(name)) {
      return null;
    }

    return get(this.touched, name);
  }

  getValue(name) {
    if (!this.hasValue(name)) {
      return null;
    }

    return get(this.values, name);
  }

  getValues() {
    return this.values;
  }

  hasError(name) {
    return has(this.errors, name);
  }

  hasField(name) {
    return this.fields.has(name);
  }

  hasTouched(name) {
    return has(this.touched, name);
  }

  hasValue(name) {
    return has(this.values, name);
  }

  removeError(name) {
    unset(this.errors, name);
  }

  removeField(name) {
    this.fields.delete(name);
  }

  removeTouched(name) {
    unset(this.touched, name);
  }

  removeValue(name) {
    unset(this.values, name);
  }

  setError(name, error) {
    this.handleChangeError(name, error);
  }

  setErrors(errors) {
    this.errors = {};
    Object.keys(errors).forEach(key => {
      let error = errors[key];

      set(this.errors, key, error);
    });
  }

  setField(name, field) {
    this.fields.set(name, field);

    // Disabled if not valid
    if (field.props.disabledIfInvalid.length > 0) {
      this.fieldsDisabledIfInvalid.set(name, field.props.disabledIfInvalid);

      field.props.disabledIfInvalid.forEach(fieldToCheck => {
        if (!this.fieldsTriggerDisabled.has(fieldToCheck)) {
          this.fieldsTriggerDisabled.set(fieldToCheck, []);
        }

        this.fieldsTriggerDisabled.get(fieldToCheck).push(name);
      });
    }

    // Required if not empty
    if (field.props.requiredIfNotEmpty.length > 0) {
      this.fieldsRequiredIfNotEmpty.set(name, field.props.requiredIfNotEmpty);
    }

    if ("checkbox" === field.state.type && !has(this.values, name)) {
      set(this.values, name, false);
    }
    if ("multicheckbox" === field.state.type && !has(this.values, name)) {
      set(this.values, name, []);
    }

    // Default value
    if (has(this.values, name)) {
      field.setState({
        value: get(this.values, name)
      });
    }
  }

  setTouched(name, value) {
    set(this.touched, name, value);
  }

  setValue(name, value) {
    this.handleChangeValue(name, value);
  }

  setValues(values) {
    this.values = {};
    Object.keys(values).forEach(key => {
      let value = values[key];

      set(this.values, key, value);
    });
  }

  handleOnBlur(name, value) {
    const field = this.fields.get(name);

    this.handleChangeValue(name, value);

    // Field - On blur
    if (field.props.hasOwnProperty("onBlur") && typeof field.props.onBlur === "function") {
      field.props.onBlur(this.handleApi);
    }

    // Field - On blur if valid
    if (
      field.props.hasOwnProperty("onBlurIfValid") &&
      typeof field.props.onBlurIfValid === "function" &&
      !get(this.errors, name)
    ) {
      field.props.onBlurIfValid(this.handleApi);
    }

    // Form - On blur
    if (this.props.hasOwnProperty("onBlur") && typeof this.props.onBlur === "function") {
      this.props.onBlur(this.handleApi);
    }
  }

  handleOnChange(name, value) {
    const field = this.fields.get(name);

    this.handleChangeValue(name, value);

    // Field - On change
    if (field.props.hasOwnProperty("onChange") && typeof field.props.onChange === "function") {
      field.props.onChange(this.handleApi);
    }

    // Field - On change if valid
    if (
      field.props.hasOwnProperty("onChangeIfValid") &&
      typeof field.props.onChangeIfValid === "function" &&
      !get(this.errors, name)
    ) {
      field.props.onChangeIfValid(this.handleApi);
    }

    // Form - On change
    if (this.props.hasOwnProperty("onChange") && typeof this.props.onChange === "function") {
      this.props.onChange(this.handleApi);
    }
  }

  async handleOnSubmit(e) {
    e.preventDefault(e);

    await this.setState({
      isSubmitting: true
    });

    await this.fields.forEach((field, name) => {
      this.handleValidate(name);
    });

    if (0 === get(this.errors).keys().length) {
      await this.props.onSubmit(this.handleApi);
      return;
    }

    await this.setState({
      isHighlightingErrors: true,
      isSubmitting: false
    });

    setTimeout(
      function() {
        this.setState({
          isHighlightingErrors: false
        });
      }.bind(this),
      500
    );

    return this;
  }

  handleChangeError(name, error) {
    error = error || null;

    if (!error) {
      unset(this.errors, name);
    } else {
      set(this.errors, name, error);
    }

    if (this.fields.has(name)) {
      this.fields.get(name).setState({
        error: error
      });
    }
  }

  async handleChangeValue(name, value) {
    value = value || null;

    if (!this.fields.has(name)) {
      set(this.values, name, value);
      return false;
    }

    const field = this.fields.get(name);

    // Set value
    set(this.values, name, value);

    // Set touched
    if (null !== value && value.length > 0) {
      set(this.touched, name, true);
    }

    // On normalize
    if (field.props.hasOwnProperty("onNormalize") && typeof field.props.onNormalize === "function") {
      value = field.props.onNormalize(this.handleApi);
    }

    // Default value for specific field types
    if ("checkbox" === field.state.type && true !== value) {
      value = false;
    }
    if ("multicheckbox" === field.state.type && !Array.isArray(value)) {
      value = [];
    }

    // Update value
    set(this.values, name, value);

    // Validation
    if (true === field.props.validateOnChange && true === has(this.touched, name)) {
      this.handleValidate(name);
    }

    // Disabled if not valid
    if (this.fieldsTriggerDisabled.has(name)) {
      await this.fieldsTriggerDisabled.get(name).forEach(nameToDisable => {
        if (this.fieldsDisabledIfInvalid.has(nameToDisable)) {
          let isValid = true;
          this.fieldsDisabledIfInvalid.get(nameToDisable).forEach(nameToCheckValue => {
            if (true === isValid && has(this.errors, nameToCheckValue)) {
              isValid = false;
            }
          });

          if (true === isValid) {
            this.fields.get(nameToDisable).setState({
              disabled: false
            });
          } else {
            unset(this.errors, nameToDisable);
            set(this.values, nameToDisable, "");
            this.fields.get(nameToDisable).setState({
              error: null,
              disabled: true,
              options: [],
              value: ""
            });
          }
        }
      });
    }

    // Required if not empty
    if (this.fieldsRequiredIfNotEmpty.has(name)) {
      const namesToCheck = this.fieldsRequiredIfNotEmpty.get(name);

      // Is some field filled?
      let isRequired = false;
      namesToCheck.forEach(nameToCheck => {
        if (false === isRequired) {
          if (!!get(this.values, nameToCheck)) {
            isRequired = true;
          }
        }
      });

      // Change state of fields
      await this.fieldsRequiredIfNotEmpty.forEach((field, nameToChange) => {
        if (this.fields.has(nameToChange)) {
          const fieldToChange = this.fields.get(nameToChange);

          if (fieldToChange.state.required !== isRequired) {
            if (true === isRequired) {
              fieldToChange.setState({
                required: isRequired,
                validatorsEnabled: isRequired
              });
            } else {
              fieldToChange.setState({
                error: null,
                required: isRequired,
                validatorsEnabled: isRequired
              });
            }
          }
        }
      });
    }

    // Update field state
    field.setState({
      touched: get(this.touched, name),
      value: get(this.values, name)
    });

    return this;
  }

  handleValidate(name, nameToSkip = null, isRecursive = false) {
    let error = null;
    let field = this.fields.get(name);
    let value = get(this.values, name) || "";

    if (false === field.state.validatorsEnabled) {
      return null;
    }

    if ("checkbox" !== field.state.type && "multicheckbox" !== field.state.type) {
      value = value.trim();
    }

    if (field.state.visible) {
      field.props.validators.forEach(validator => {
        if (null === error) {
          error = validator.validate(value, this.values);

          field.props.validateIfChange.forEach(nameToValidate => {
            if (nameToValidate !== nameToSkip && this.fields.has(nameToValidate)) {
              if (has(this.touched, nameToValidate)) {
                this.handleValidate(nameToValidate, name, true);
              }
            }
          });
        }
      });
    }

    this.handleChangeError(name, error);

    if (
      false === isRecursive &&
      this.props.hasOwnProperty("onValidate") &&
      typeof this.props.onValidate === "function"
    ) {
      this.props.onValidate(this.handleApi);
    }

    return this;
  }

  get formClassName() {
    return this.state.isHighlightingErrors ? "invalid-highlight" : null;
  }

  get handleApi() {
    return {
      getError: this.getError,
      getErrors: this.getErrors,
      getTouched: this.getTouched,
      getValue: this.getValue,
      getValues: this.getValues,
      hasError: this.hasError,
      hasTouched: this.hasTouched,
      hasValue: this.hasValue,
      removeError: this.removeError,
      removeTouched: this.removeTouched,
      removeValue: this.removeValue,
      setError: this.setError,
      setErrors: this.setErrors,
      setTouched: this.setTouched,
      setValue: this.setValue,
      setValues: this.setValues
    };
  }

  get formContext() {
    return {
      formApi: {
        getError: this.getError,
        getErrors: this.getErrors,
        getField: this.getField,
        getTouched: this.getTouched,
        getValue: this.getValue,
        getValues: this.getValues,
        hasError: this.hasError,
        hasField: this.hasField,
        hasTouched: this.hasTouched,
        hasValue: this.hasValue,
        isHighlightingErrors: this.state.isHighlightingErrors,
        isSubmitting: this.state.isSubmitting,
        handleOnBlur: this.handleOnBlur,
        handleOnChange: this.handleOnChange,
        removeError: this.removeError,
        removeField: this.removeField,
        removeTouched: this.removeTouched,
        removeValue: this.removeValue,
        setError: this.setError,
        setErrors: this.setErrors,
        setField: this.setField,
        setTouched: this.setTouched,
        setValue: this.setValue,
        setValues: this.setValues
      }
    };
  }

  get content() {
    const { children, component, render } = this.props;

    const props = this.formContext;

    if (component) {
      return React.createElement(component, props, children);
    }
    if (render) {
      return render(props);
    }
    if (typeof children === "function") {
      return children(props);
    }
    return children;
  }

  render() {
    const {
      children,
      component,
      render,
      noValidate,
      onBlur,
      onChange,
      onSubmit,
      onValidate,
      values,
      ...rest
    } = this.props;

    return (
      <FormContext.Provider value={this.formContext}>
        <ReactstrapForm
          {...rest}
          className={this.formClassName}
          noValidate={noValidate}
          onChange={this.onChange}
          onSubmit={this.handleOnSubmit}
        >
          {this.content}
        </ReactstrapForm>
      </FormContext.Provider>
    );
  }
}

Form.defaultProps = {
  noValidate: true,
  onChange: null,
  values: {}
};

Form.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  inline: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  noValidate: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  values: PropTypes.object
};

export default Form;
