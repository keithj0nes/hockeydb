/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';
// use this to read variable colors to change in the buttons
// import vars from 'assets/styles/_variables.scss';

// opa (opacity) is for the site.com/styleguide page to perminaently be in the 'hover' state

const Button = ({ title, onClick, opa, style, type, htmlType, name, disabled }) => {
    const _style = {
        opacity: opa && 0.8,
        ...style, // props.style
    };

    return (
        <button type={htmlType} name={name} className={`btn ${type}`} style={_style} onClick={onClick} disabled={disabled || type === 'disabled'}>{title}</button>
    );
};

export default Button;

Button.defaultProps = {
    htmlType: 'button',
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func, // .isRequired,
    type: PropTypes.oneOf(['admin', 'cancel', 'disabled', 'danger', 'success', 'outline', 'link']),
    opa: PropTypes.bool,
    style: PropTypes.object,
    htmlType: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
};
