import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './popover.scss';

export const Popover = ({children, isVisible, setIsVisible, closest, row}) => {

    const listener = e => {
        if(!e.target.closest(closest)) {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        if(isVisible) {
            window.addEventListener('click', listener, true)
        } else {
            window.removeEventListener('click', listener, true);
        }
        return () => window.removeEventListener('click', listener, true);

    }, [ isVisible ]);

    if(!isVisible) return null;

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
    closest: PropTypes.string.isRequired,       // determines what div wont cause item to close
    row: PropTypes.bool
}