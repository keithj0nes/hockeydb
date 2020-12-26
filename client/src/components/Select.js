import React from 'react';
import PropTypes from 'prop-types';
import './select.scss';

export const Select = ({ name, defaultValue, hiddenValue, listOfSelects, onChange, title, useKey }) => (
    <div className="custom-select">
        <label htmlFor="">{title}</label>
        <select className="custom-select" name={name} value={defaultValue} onChange={onChange}>
            {!!hiddenValue && <option value="" hidden>{hiddenValue}</option>}
            {listOfSelects && listOfSelects.map((item, ind) => (
                <option key={item[useKey] || item.value} value={item[useKey] || item.value}>{item.name}</option>
            ))}
        </select>
        <span className="arrow" style={title && { top: 30 }} />
    </div>
);

export const DashSelect = ({ name, defaultValue, hiddenValue, listOfSelects, onChange, title, useKey }) => (
    <div className="dash-select">
        <label htmlFor="">{title}</label>
        <select className="dash-select" name={name} defaultValue={defaultValue} onChange={onChange}>
            {!!hiddenValue && <option value="" hidden>{hiddenValue}</option>}
            {listOfSelects && listOfSelects.map((item) => (
                <option key={item[useKey] || item.value} value={item[useKey] || item.value}>{item.name}</option>
            ))}
        </select>
        <span className="arrow" style={title && { top: 37 }} />
    </div>
);

Select.propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    hiddenValue: PropTypes.string,
    listOfSelects: PropTypes.array,
    onChange: PropTypes.func,
    title: PropTypes.string,
    useKey: PropTypes.string,
};

DashSelect.propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    hiddenValue: PropTypes.string,
    listOfSelects: PropTypes.array,
    onChange: PropTypes.func,
    title: PropTypes.string,
    useKey: PropTypes.string,
};
