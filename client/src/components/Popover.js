import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './popover.scss';

export const Popover = ({ children, isVisible, setIsVisible, closest, row, fullWidth }) => {
    const listener = e => {
        if (!e.target.closest(closest)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            window.addEventListener('click', listener, true);
        } else {
            window.removeEventListener('click', listener, true);
        }
        return () => window.removeEventListener('click', listener, true);
    }, [isVisible]);

    if (!isVisible) return null;

    const closePopover = () => {
        setIsVisible(false);
    };

    return (
        <div className={`popover ${row ? 'row' : ''} ${fullWidth ? 'full-width' : ''}`}>
            { typeof children === 'function' ? children(closePopover) : children }
        </div>
    );
};

Popover.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    isVisible: PropTypes.bool.isRequired,
    setIsVisible: PropTypes.func.isRequired,
    closest: PropTypes.string.isRequired, // determines what div wont cause item to close
    row: PropTypes.bool,
    fullWidth: PropTypes.bool,
};
