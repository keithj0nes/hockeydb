/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import './button.scss';
// use this to read variable colors to change in the buttons
// import vars from 'assets/styles/_variables.scss';

const Button = ({ title, onClick, style, type, htmlType, name, disabled, loading }) => {
    const _style = {
        opacity: loading && 0.8,
        ...style, // props.style
        pointerEvents: loading && 'none',
    };

    return (
        <button
            type={htmlType}
            name={name}
            className={`btn ${type}`}
            style={_style}
            onClick={onClick}
            disabled={disabled || type === 'disabled' || loading}
        >
            {loading && (<span style={{ position: 'relative' }}><LoadingOutlined style={{ position: 'absolute', right: 10, fontSize: 20 }} /></span>)}
            <span>{title}</span>
        </button>
    );
};

export default Button;

Button.defaultProps = {
    htmlType: 'button',
    loading: false,
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func, // .isRequired,
    type: PropTypes.oneOf(['admin', 'cancel', 'disabled', 'danger', 'success', 'outline', 'link']),
    style: PropTypes.object,
    htmlType: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
};
