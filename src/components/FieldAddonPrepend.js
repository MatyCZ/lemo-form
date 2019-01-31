// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// PropTypes
import PropTypes from "prop-types";

// React
import React from "react";

// Reactstrap
import { InputGroupAddon, InputGroupText } from "reactstrap";

class FieldAddonPrepend extends React.Component {
  render() {
    const { icon, text } = this.props;

    if (!icon && !text) {
      return "";
    }

    let content = text;
    if (icon) {
      content = <FontAwesomeIcon icon={icon} fixedWidth />;
    }

    return (
      <InputGroupAddon addonType="prepend">
        <InputGroupText>{content}</InputGroupText>
      </InputGroupAddon>
    );
  }
}

FieldAddonPrepend.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  text: PropTypes.string
};

export default FieldAddonPrepend;
