// PropTypes
import PropTypes from 'prop-types';

// React
import React from 'react';

// Reactstrap
import { Label } from 'reactstrap';

const defaultProps = {
  required: false
};

const propTypes = {
  name: PropTypes.string,
  required: PropTypes.bool,
  text: PropTypes.string
};

class FieldLabel extends React.Component {
  render() {
    const { name, required, text } = this.props;

    if (!text) {
      return '';
    }

    if (!required) {
      return <Label for={name}>{text}</Label>;
    }

    return (
      <Label for={name}>
        {text} <em className="required">*</em>
      </Label>
    );
  }
}

FieldLabel.defaultProps = defaultProps;
FieldLabel.propTypes = propTypes;

export default FieldLabel;
