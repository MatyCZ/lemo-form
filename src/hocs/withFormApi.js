// Components
import FormContext from "../components/FormContext";

// React
import React from "react";

const withFormApi = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ formApi }) => <Component formApi={formApi} ref={ref} {...props} />}
    </FormContext.Consumer>
  ));

export default withFormApi;
