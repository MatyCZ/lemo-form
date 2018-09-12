// PropTypes
import PropTypes from 'prop-types';

// React
import React from 'react';

// Reactstrap
import { FormFeedback } from 'reactstrap';

class FieldFeedback extends React.Component {
  render() {
    const error = this.props.error;

    if (!error) {
      return '';
    }

    return <FormFeedback>{error}</FormFeedback>;
  }
}

FieldFeedback.propTypes = {
  error: PropTypes.string
};

export default FieldFeedback;
