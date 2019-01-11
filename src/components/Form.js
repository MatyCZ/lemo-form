// Components
import FormContext from "./FormContext";

// Lemo
import { DataMap } from "lemo-object";

// PropTypes
import PropTypes from "prop-types";

// React
import React from "react";

// Reactstrap
import { Form as ReactstrapForm } from "reactstrap";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHighlightingErrors: false,
      isSubmitting: false
    };

    this.errors = new DataMap();
    this.fields = new Map();
    this.fieldsDisabledIfInvalid = new Map();
    this.fieldsRequiredIfNotEmpty = new Map();
    this.fieldsTriggerDisabled = new Map();
    this.touched = new DataMap();
    this.values = new DataMap(props.values);

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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values !== this.props.values) {
      this.values = new DataMap(nextProps.values);

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
    if (!this.errors.has(name)) {
      return null;
    }

    return this.errors.get(name);
  }

  getErrors() {
    return this.errors.object;
  }

  getField(name) {
    if (!this.fields.has(name)) {
      return null;
    }

    return this.fields.get(name);
  }

  getTouched(name) {
    if (!this.touched.has(name)) {
      return null;
    }

    return this.touched.get(name);
  }

  getValue(name) {
    if (!this.values.has(name)) {
      return null;
    }

    return this.values.get(name);
  }

  getValues() {
    return this.values.object;
  }

  hasError(name) {
    return this.errors.has(name);
  }

  hasField(name) {
    return this.fields.has(name);
  }

  hasTouched(name) {
    return this.touched.has(name);
  }

  hasValue(name) {
    return this.values.has(name);
  }

  removeError(name) {
    this.errors.delete(name);
  }

  removeField(name) {
    this.fields.delete(name);
  }

  removeTouched(name) {
    this.touched.delete(name);
  }

  removeValue(name) {
    this.values.delete(name);
  }

  setError(name, error) {
    this.handleChangeError(name, error);
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

    if ("checkbox" === field.state.type) {
      this.values.set(name, false);
    }
    if ("multicheckbox" === field.state.type) {
      this.values.set(name, []);
    }

    // Default value
    if (this.values.has(name)) {
      field.setState({
        value: this.values.get(name)
      });
    }
  }

  setTouched(name, value) {
    this.touched.set(name, value);
  }

  setValue(name, value) {
    this.handleChangeValue(name, value);
  }

  handleOnBlur(name, value) {
    const field = this.fields.get(name);

    this.handleChangeValue(name, value);

    // Field - On blur
    if (
      field.props.hasOwnProperty("onBlur") &&
      typeof field.props.onBlur === "function"
    ) {
      field.props.onBlur(this.handleApi);
    }

    // Field - On blur if valid
    if (
      field.props.hasOwnProperty("onBlurIfValid") &&
      typeof field.props.onBlurIfValid === "function" &&
      !this.errors.get(name)
    ) {
      field.props.onBlurIfValid(this.handleApi);
    }

    // Form - On blur
    if (
      this.props.hasOwnProperty("onBlur") &&
      typeof this.props.onBlur === "function"
    ) {
      this.props.onBlur(this.handleApi);
    }
  }

  handleOnChange(name, value) {
    const field = this.fields.get(name);

    this.handleChangeValue(name, value);

    // Field - On change
    if (
      field.props.hasOwnProperty("onChange") &&
      typeof field.props.onChange === "function"
    ) {
      field.props.onChange(this.handleApi);
    }

    // Field - On change if valid
    if (
      field.props.hasOwnProperty("onChangeIfValid") &&
      typeof field.props.onChangeIfValid === "function" &&
      !this.errors.get(name)
    ) {
      field.props.onChangeIfValid(this.handleApi);
    }

    // Form - On change
    if (
      this.props.hasOwnProperty("onChange") &&
      typeof this.props.onChange === "function"
    ) {
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

    if (this.errors.empty()) {
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
      this.errors.delete(name);
    } else {
      this.errors.set(name, error);
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
      this.values.set(name, value);
      return false;
    }

    const field = this.fields.get(name);

    // On normalize
    if (
      field.props.hasOwnProperty("onNormalize") &&
      typeof field.props.onNormalize === "function"
    ) {
      value = field.props.onNormalize(value, field.state.value);
    }

    // Default value for specific field types
    if ("checkbox" === field.state.type && true !== value) {
      value = false;
    }
    if ("multicheckbox" === field.state.type && !Array.isArray(value)) {
      value = [];
    }

    // Set value
    this.values.set(name, value);

    // Set touched
    this.touched.set(name, true);

    // Validation
    if (true === field.props.validateOnChange) {
      this.handleValidate(name);
    }

    // Disabled if not valid
    if (this.fieldsTriggerDisabled.has(name)) {
      await this.fieldsTriggerDisabled.get(name).forEach(nameToDisable => {
        if (this.fieldsDisabledIfInvalid.has(nameToDisable)) {
          let isValid = true;
          this.fieldsDisabledIfInvalid
            .get(nameToDisable)
            .forEach(nameToCheckValue => {
              if (true === isValid && this.errors.has(nameToCheckValue)) {
                isValid = false;
              }
            });

          if (true === isValid) {
            this.fields.get(nameToDisable).setState({
              disabled: false
            });
          } else {
            this.errors.delete(nameToDisable);
            this.values.set(nameToDisable, "");
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
          if (!!this.values.get(nameToCheck)) {
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
      touched: this.touched.get(name),
      value: this.values.get(name)
    });

    return this;
  }

  handleValidate(name, nameToSkip = null, isRecursive = false) {
    let error = null;
    let field = this.fields.get(name);
    let value = this.values.get(name) || "";

    if (false === field.state.validatorsEnabled) {
      return null;
    }

    if (
      "checkbox" !== field.state.type &&
      "multicheckbox" !== field.state.type
    ) {
      value = value.trim();
    }

    if (field.state.visible) {
      field.props.validators.forEach(validator => {
        if (null === error) {
          error = validator.validate(value, this.values);

          field.props.validateIfChange.forEach(nameToValidate => {
            if (
              nameToValidate !== nameToSkip &&
              this.fields.has(nameToValidate)
            ) {
              if (this.touched.has(nameToValidate)) {
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
      setTouched: this.setTouched,
      setValue: this.setValue
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
        setField: this.setField,
        setTouched: this.setTouched,
        setValue: this.setValue
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
  noValidate: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func,
  values: PropTypes.object
};

export default Form;
