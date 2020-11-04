import React from 'react';
import PropTypes from 'prop-types';

export const HamburgerIcon = ({ onClick }) => (
    <div className="hide-desktop" onClick={onClick}>
        <div className="dashboard-hamburger-icon">
            <div className="bar0" />
            <div className="bar1" />
            <div className="bar2" />
        </div>
    </div>
);

HamburgerIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
};
