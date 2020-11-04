import React from 'react';
import PropTypes from 'prop-types';
import './input.scss';

export const Input = ({ name, label, type = 'text', disabled, defaultValue, onChange }) => (
    <div className="custom-input">
        <input name={name} id={name} type={type} placeholder="something" disabled={disabled} onChange={onChange} />
        <label htmlFor={name}>{label}</label>
    </div>
);

export const DashInput = ({ name, label, type = 'text', disabled, defaultValue, onChange }) => (
    <div className="dash-input">
        <label htmlFor={name}>{label}</label>
        <input name={name} id={name} type={type} defaultValue={defaultValue} disabled={disabled} onChange={onChange} />
    </div>
);

Input.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
};

DashInput.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
};
