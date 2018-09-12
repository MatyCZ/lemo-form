// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// PropTypes
import PropTypes from 'prop-types';

// React
import React from 'react';

// Reactstrap
import { InputGroupAddon, InputGroupText } from 'reactstrap';

class FieldAddonAppend extends React.Component {
  render() {
    const { icon, text } = this.props;

    if (!icon && !text) {
      return '';
    }

    let content = text;
    if (icon) {
      content = <FontAwesomeIcon icon={icon} fixedWidth />;
    }

    return (
      <InputGroupAddon addonType="append">
        <InputGroupText>{content}</InputGroupText>
      </InputGroupAddon>
    );
  }
}

FieldAddonAppend.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  text: PropTypes.string
};

export default FieldAddonAppend;
