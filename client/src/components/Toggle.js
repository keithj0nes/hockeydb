import React from 'react';
import PropTypes from 'prop-types';
// import { nanoid } from 'nanoid';

const Toggle = ({ noText, yesText, checked, onChange, name, disabled, label }) => (
    <div className="inline-block relative">
        <label htmlFor={name} className={`flex items-center custom-checkbox ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
            {label}

            <div className="flex items-center custom-checkbox relative ml-5">
                <input type="checkbox" disabled={disabled} name={name} checked={checked} onChange={onChange} id={name} className="sr-only disabled:opacity-30" />
                <span className="z-10 ml-0 mt-0.5 text-sm font-medium absolute left-2 text-gray-200 top-0.5 uppercase pointer-events-none">
                    {yesText || <svg style={{ marginTop: 2, marginLeft: 4 }} className="transition duration-200 opacity-1 w-4 h-4 text-purple pointer-events-none" viewBox="0 0 172 172"><g fill="none" strokeWidth="none" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><path d="M0 172V0h172v172z" /><path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" strokeWidth="1" /></g></svg>}
                </span>
                <div className="relative">
                    <div className="toggle-bg2 transition duration-200 bg-gray-200 border-2 border-gray-200 h-7 w-16 rounded-full" />
                </div>
                <span className="mr-0 mt-0.5 z-10 text-sm font-medium absolute right-2 top-0.5 uppercase pointer-events-none">
                    {noText || <svg style={{ marginTop: 2, marginRight: 6 }} className="mt-2 ml-2 transition duration-200 opacity-1 w-4 h-4 text-purple pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
                </span>
            </div>
        </label>
    </div>
);

export default Toggle;

Toggle.propTypes = {
    noText: PropTypes.string,
    yesText: PropTypes.string,
    // id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
};
