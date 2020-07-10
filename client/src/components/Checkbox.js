import React, {useState} from 'react';
import './checkbox.scss';

export const Checkbox = () => {

    return (
        <h2>Checkbox Not styled</h2>
    )
}

export const DashCheckbox = ({title, name}) => {

    const [isChecked, setIsChecked] = useState(false);

    const handleFocus = () => {
        document.getElementById(title).focus();
        setIsChecked(!isChecked)
    }

    return (
        <div className="checkbox-container">
            {/* <input type="checkbox" id={title} checked={isChecked} onChange={() => setIsChecked(!isChecked)} /> */}
            <input type="checkbox" id={title} checked={isChecked} readOnly />
                <div className="styled-checkbox" onClick={handleFocus} ></div>
                <label htmlFor={title} onClick={() => setIsChecked(!isChecked)}>
            {title}</label>
        </div>
    )
}

DashCheckbox.defaultProps = {
    title: 'NO TITLE GIVEN'
}