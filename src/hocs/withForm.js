// Components
import FormContext from '../components/FormContext';

// React
import React from 'react';

const withForm = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ form }) => <Component formApi={form} ref={ref} {...props} />}
    </FormContext.Consumer>
  ));

export default withForm;
