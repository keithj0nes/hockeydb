import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// TODO:
// figure out why unable to tab through list items
// codepn for reference
// https://codepen.io/jamus/pen/qBZoVxd

const Dropdown = ({ options, onChange, value, name }) => {
    // const selectedValue = options.find(opt => opt.value === value);
    // const [selected, setSelected] = useState(selectedValue || options[0]);
    const [selected, setSelected] = useState();

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const selectedValue = options.find(opt => opt.value === value);
        setSelected(selectedValue || options[0]);
    }, [value]);


    const handleChange = (option) => {
        // setSelected(option);
        setIsOpen(!isOpen);
        onChange({ target: { name, value: option.value } });
    };


    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu, then close the menu
            if (isOpen && ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mouseup', checkIfClickedOutside);

        // Cleanup the event listener
        return () => document.removeEventListener('mouseup', checkIfClickedOutside);
    }, [isOpen]);

    return (
        <div className="relative bg-red-100">
            <span className="inline-block w-full rounded-md shadow-sm">
                <button
                    id={name}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                    <div className="flex items-center space-x-3">
                        {/* <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100" /> */}
                        <span className="block truncate">{selected?.name || 'SELECT HERE'}</span>
                    </div>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                        </svg>
                    </span>
                </button>
            </span>


            {/* <div className={isOpen ? 'block absolute mt-1 w-full rounded-md bg-white shadow-lg' : 'hidden'} ref={ref}> */}

            {isOpen && (
                <div className="block absolute mt-1 w-full rounded-md bg-white shadow-lg z-50" ref={ref}>
                    <ul
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                        // role="listbox"
                        className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                    >
                        {options.map(option => (
                            <li
                                key={option.value}
                                role="option"
                                tabIndex="-1"
                                aria-selected={selected?.value === option.value}
                                onClick={() => handleChange(option)}
                                className={classNames('cursor-pointer select-none relative py-2 pl-4 pr-9 hover:bg-gray-100', {
                                    'text-black font-bold': selected?.value === option.value,
                                    'text-gray-700': selected?.value !== option.value,
                                })}
                            >
                                <span>{option.name}</span>

                                {selected?.value === option.value && (
                                    // <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-db-secondary">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                )}

                            </li>

                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default Dropdown;

Dropdown.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
};
