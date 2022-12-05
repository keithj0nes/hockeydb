/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';

const Button = ({ onClick, children, type, ...props }) => (
    <button
        type={type}
        className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
);

export default Button;

Button.defaultProps = {
    children: 'hiiiii',
    onClick: () => console.warn('Add onClick to <Button> component'),
    type: 'button',
};

Button.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
    type: PropTypes.string,
};
