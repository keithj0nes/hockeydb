import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';
// use this to read variable colors to change in the buttons
// import vars from 'assets/styles/_variables.scss';

// opa (opacity) is for the site.com/styleguide page to perminaently be in the 'hover' state

const Button = ({ title, onClick, opa, style, type }) => {
    const _style = {
        opacity: opa && 0.8,
        ...style, // props.style
    };

    return (
        <button type="button" className={`btn ${type}`} style={_style} onClick={onClick} disabled={type === 'disabled'}>{title}</button>
    );
};

export default Button;

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['admin', 'cancel', 'disabled', 'danger', 'success', 'outline']),
    opa: PropTypes.bool,
    style: PropTypes.object,
};
