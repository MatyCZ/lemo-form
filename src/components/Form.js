// Components
import FormContext from './FormContext';

// Lemo
import { DataMap } from 'lemo-object';

// PropTypes
import PropTypes from 'prop-types';

// React
import React from 'react';

// Reactstrap
import { Form as ReactstrapForm } from 'reactstrap';

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

    if (props.onInit) {
      props.onInit(this);
    }

    this.get = this.get.bind(this);
    this.getError = this.getError.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.getTouched = this.getTouched.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getValues = this.getValues.bind(this);
    this.has = this.has.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.remove = this.remove.bind(this);
    this.set = this.set.bind(this);
    this.setError = this.setError.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.values !== this.props.values) {
          this.values = new DataMap(nextProps.values);

          if (0 === Object.keys(nextProps.values).length) {
              this.fields.forEach((field) => {
                  field.setState({
                      error: null,
                      touched: false,
                      value: ""
                  });
              });
          } else {
              this.fields.forEach((field) => {
                  let fieldName = field.props.name;

                  if (nextProps.values.hasOwnProperty(fieldName)) {
                      field.setState({
                          value: nextProps.values[fieldName]
                      });
                  }
              });
          }
      }
  }

  set(name, field) {
    this.fields.set(name, field);

    // Disabled if not valid
    if (field.props.disabledIfInvalid.length > 0) {
      this.fieldsDisabledIfInvalid.set(name, field.props.disabledIfInvalid);

      field.props.disabledIfInvalid.forEach((fieldToCheck) => {
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

    // Default value
    if (this.values.has(name)) {
      field.setState({
        value: this.values.get(name)
      });
    }
  }

  get(name) {
    return this.fields.get(name);
  }

  has(name) {
    return this.fields.has(name);
  }

  remove(name) {
    this.fields.delete(name);
  }

  setError(name, error) {
    if (null === error) {
      this.errors.delete(name);
    } else {
      this.errors.set(name, error);
    }

    this.fields.get(name).setState({
      error: error
    });
  }

  setTouched(name, value) {
    this.touched.set(name, value);
  }

  setValue(name, value) {
    value = value || null;

    this.values.set(name, value);

    if (this.fields.has(name)) {
      this.handleChange(name, value);
    }
  }

  getValue(name) {
    if (!this.values.has(name)) {
      return null;
    }

    return this.values.get(name);
  }

  getError(name) {
    if (!this.errors.has(name)) {
      return null;
    }

    return this.errors.get(name);
  }

  getErrors() {
    return this.errors;
  }

  getTouched(name) {
    if (!this.touched.has(name)) {
      return null;
    }

    return this.touched.get(name);
  }

  getValues() {
    return this.values;
  }

  async handleChange(name, value) {
    const field = this.fields.get(name);

    // On normalize
    if (
        field.props.hasOwnProperty('onNormalize') &&
        typeof field.props.onNormalize === 'function'
    ) {
        value = field.props.onNormalize(
            value,
            field.state.value
        );

        this.values.set(name, value);
    }

    if (value === field.state.value) {
      return false;
    }

    // Touched
    this.touched.set(name, true);

    // Validation
    if (true === field.props.validateOnChange) {
      const error = this.handleValidate(name, value);

      if (!error) {
        this.errors.delete(name);
      } else {
        this.errors.set(name, error);
      }
    }

    // On blur
    if (
      field.props.hasOwnProperty('onBlur') &&
      typeof field.props.onBlur === 'function'
    ) {
      field.props.onBlur(name, value, this.values.object);
    }

    // On blur if valid
    if (
      field.props.hasOwnProperty('onBlurIfValid') &&
      typeof field.props.onBlurIfValid === 'function' &&
      !this.errors.get(name)
    ) {
      field.props.onBlurIfValid(name, value, this.values.object);
    }

    // On change
    if (
      field.props.hasOwnProperty('onChange') &&
      typeof field.props.onChange === 'function'
    ) {
      field.props.onChange(name, value, this.values.object);
    }

    // On change if valid
    if (
      field.props.hasOwnProperty('onChangeIfValid') &&
      typeof field.props.onChangeIfValid === 'function' &&
      !this.errors.get(name)
    ) {
      field.props.onChangeIfValid(name, value, this.values.object);
    }

    // Disabled if not valid
    if (this.fieldsTriggerDisabled.has(name)) {
      await this.fieldsTriggerDisabled.get(name).forEach((nameToDisable) => {
        if (this.fieldsDisabledIfInvalid.has(nameToDisable)) {
          let isValid = true;
          this.fieldsDisabledIfInvalid
            .get(nameToDisable)
            .forEach((nameToCheckValue) => {
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
            this.values.set(nameToDisable, '');
            this.fields.get(nameToDisable).setState({
              error: null,
              disabled: true,
              options: [],
              value: ''
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
      namesToCheck.forEach((nameToCheck) => {
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

    if (
      this.props.hasOwnProperty('onChange') &&
      typeof this.props.onChange === 'function'
    ) {
      this.props.onChange(this.values.object, name, value);
    }

    field.updateState();
  }

  async handleSubmit(e) {
    e.preventDefault(e);

    await this.setState({
      isSubmitting: true
    });

    await this.fields.forEach((field, name) => {
      let error = this.handleValidate(name, this.values.get(name));

      this.setError(name, error);
    });

    if (this.errors.empty()) {
      await this.props.onSubmit(this.values.object);
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
  }

  handleValidate(name, value = null, validateWithSkip = null) {
    let error = null;
    let field = this.fields.get(name);

    if (false === field.state.validatorsEnabled) {
      return null;
    }
    if (field.state.visible) {
      value = value || '';

      field.props.validators.forEach((validator) => {
        if (null === error) {
          error = validator.validate(value.trim(), this.getValues());

          field.props.validateIfChange.forEach((nameToValidate) => {
            if (
              nameToValidate !== validateWithSkip &&
              this.fields.has(nameToValidate)
            ) {
              if (this.touched.has(nameToValidate)) {
                let fieldError = this.handleValidate(
                  nameToValidate,
                  this.values.get(nameToValidate),
                  name
                );

                this.setError(nameToValidate, fieldError);
              }
            }
          });
        }
      });
    }

    return error;
  }

  get formClassName() {
    return this.state.isHighlightingErrors ? 'invalid-highlight' : null;
  }

  get formContext() {
    return {
      formApi: {
        get: this.get,
        getError: this.getError,
        getErrors: this.getErrors,
        getTouched: this.getTouched,
        getValue: this.getValue,
        getValues: this.getValues,
        has: this.has,
        isSubmitting: this.state.isSubmitting,
        remove: this.remove,
        set: this.set,
        setError: this.setError,
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
    if (typeof children === 'function') {
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
      onChange,
      onInit,
      onSubmit,
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
          onSubmit={this.handleSubmit}
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
  onInit: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default Form;
