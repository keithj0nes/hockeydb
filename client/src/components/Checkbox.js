import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './checkbox.scss';
// import { Checkbox as Checkbox2 } from 'antd';


export const Checkbox = () => (
    <h2>Checkbox Not styled</h2>
);

// DashCheckbox needs to be reqorked - will not uncheck if filter box is closed and opened again

export const DashCheckbox = ({ title, name, defaultValue, onChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    const prev = useRef();
    // console.log(prev.current)

    useEffect(() => {
        if (prev.current === undefined) {
            prev.current = isChecked;
        }
    }, [isChecked]);

    useEffect(() => {
        // console.log({isChecked, prev: prev.current})

        if (defaultValue) {
            setIsChecked(true);
        } else if (prev.current !== isChecked) {
            onChange({ target: { name, type: 'checkbox', checked: isChecked } });
            prev.current = isChecked;
        }
    }, [defaultValue, isChecked, onChange, name]);

    const handleFocus = e => {
        // console.log(e.target.value, 'EEEEE')
        document.getElementById(title).focus();
        setIsChecked(!isChecked);
    };

    return (
        <div className="checkbox-container">
            {/* <input type="checkbox" id={title} checked={isChecked} onChange={() => setIsChecked(!isChecked)} /> */}
            <input type="checkbox" id={title} checked={isChecked} name={name} readOnly onChange={() => {}} />
            {/* <div className="styled-checkbox" onClick={handleFocus} ></div>
                <label htmlFor={title} onClick={() => setIsChecked(!isChecked)}> */}
            <div className="styled-checkbox" onClick={handleFocus} />
            <label htmlFor={title} onClick={handleFocus}>
                {title}
            </label>
        </div>

    // <Checkbox2
    //     checked={isChecked}
    //     // onChange={this.onChange}
    //     // defaultChecked={defaultValue}
    //     onChange={handleFocus}
    // >
    //     {title}
    // </Checkbox2>
    );
};

DashCheckbox.defaultProps = {
    title: 'NO TITLE GIVEN',
};

DashCheckbox.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    defaultValue: PropTypes.bool,
    onChange: PropTypes.func,
};
