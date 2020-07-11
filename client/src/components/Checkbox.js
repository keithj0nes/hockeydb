import React, { useState, useEffect, useRef } from 'react';
import './checkbox.scss';

export const Checkbox = () => {

    return (
        <h2>Checkbox Not styled</h2>
    )
}

export const DashCheckbox = ({title, name, defaultValue, onChange}) => {

    const [isChecked, setIsChecked] = useState(false);

    const prev = useRef();
    // create a ref that gets the first 

    useEffect(() => {
        prev.current = isChecked;
    }, [])

    useEffect(() => {
        console.log('usefeefct **', defaultValue)
        // console.log(prev.current, isChecked, 'PREV CURRENT')
        if(defaultValue) {
            setIsChecked(true)
        } else if (prev.current !== isChecked) {
            onChange({target: {name, type: 'checkbox', checked: isChecked}})
            prev.current = isChecked;
        }
    }, [defaultValue, isChecked])

    const handleFocus = e => {
        // console.log(e.target.value, 'EEEEE')
        document.getElementById(title).focus();
        setIsChecked(!isChecked)
    }

    return (
        <div className="checkbox-container">
            {/* <input type="checkbox" id={title} checked={isChecked} onChange={() => setIsChecked(!isChecked)} /> */}
            <input type="checkbox" id={title} checked={isChecked} name={name} readOnly onChange={() => {}}/>
                {/* <div className="styled-checkbox" onClick={handleFocus} ></div>
                <label htmlFor={title} onClick={() => setIsChecked(!isChecked)}> */}
                <div className="styled-checkbox" onClick={handleFocus} ></div>
                <label htmlFor={title} onClick={handleFocus}>
            {title}</label>
        </div>
    )
}

DashCheckbox.defaultProps = {
    title: 'NO TITLE GIVEN'
}