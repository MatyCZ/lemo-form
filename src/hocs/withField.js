// HOC
import withFormApi from './withForm';

// React
import React from 'react';

const buildFieldApi = (formApi, name) => ({
    set: (field) => formApi.set(name, field),
    remove: () => formApi.remove(name),
    getValue: () => formApi.getValue(name),
    setValue: (value) => formApi.setValue(name, value),
    getTouched: () => formApi.getTouched(name),
    setTouched: (value) => formApi.setTouched(name, value),
    getError: () => formApi.getError(name),
    setError: (value) => formApi.setError(name, value),
});

const buildFieldState = (formApi, name) => {
    return {
        disabled: false,
        error: formApi.getError(name),
        touched: formApi.getTouched(name),
        required: false,
        visible: true,
        value: formApi.getValue(name),
    };
};

const withField = Component =>
    withFormApi(
        class extends React.PureComponent {
            constructor(props) {
                super(props);

                const {
                    formApi,
                    name,
                } = props;

                this.fieldApi = buildFieldApi(formApi, name);
                this.fieldState = buildFieldState(formApi, name);

                // Rebuild state when name changes
                this.fieldStateUpdate = () => {
                    console.log(this);
                    this.setState(buildFieldState(formApi, name));
                };
            }

            render() {
                const {
                    ...rest
                } = this.props;
                return (
                    <Component
                        fieldApi={this.fieldApi}
                        fieldState={this.fieldState}
                        fieldStateUpdate={this.fieldStateUpdate}
                        {...rest}
                    />
                );
            }
        }
    );

const withFieldApi = field => Component =>
    withFormApi(({ formApi, ...props }) => (
        <Component fieldApi={buildFieldApi(formApi, field)} {...props} />
    ));

const withFieldState = field => Component =>
    withFormApi(({ formApi, ...props }) => (
        <Component fieldState={buildFieldState(formApi, field)} {...props} />
    ));

export { withField, withFieldApi, withFieldState };
