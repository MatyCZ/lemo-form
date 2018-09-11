// PropTypes
import PropTypes from "prop-types";

// React
import React from "react";

// Reactstrap
import { FormText } from "reactstrap";

class FieldText extends React.Component {
    render() {
        const text = this.props.text;

        if (!text) {
            return "";
        }

        return (
            <FormText>
                {text}
            </FormText>
        );
    }
}

FieldText.propTypes = {
    text: PropTypes.string,
};

export default FieldText;
