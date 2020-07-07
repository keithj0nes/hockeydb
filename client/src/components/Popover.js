import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './popover.scss';

export const Popover = ({children, isVisible, setIsVisible, closest, row}) => {
    if(!isVisible) return null;

    const listener = e => {
        if(!e.target.closest(closest)) {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        if(isVisible) {
            window.addEventListener('click', listener)
        } else {
            window.removeEventListener('click', listener);
        }
        return () => window.removeEventListener('click', listener);

    }, [ isVisible ])

    return (
        <div className={`popover ${row && 'row'}`}>
            {children}
        </div>
    )
}

Popover.propTypes = {
    children: PropTypes.element.isRequired,
    isVisible: PropTypes.bool.isRequired,
    setIsVisible: PropTypes.func.isRequired,
    closest: PropTypes.string.isRequired,       // determines what div wont cause item to dclose
    row: PropTypes.bool
}
