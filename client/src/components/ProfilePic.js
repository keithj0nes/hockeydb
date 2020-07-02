import React, { useState, useEffect } from 'react';
import './profilepic.scss';

export const ProfilePic = () => {

    const [ isDropDownVisibile, setIsDropDownVisible ] = useState(false);



    return (

        <div id="propiccont" style={{position: 'relative'}}>

            <div style={{height: 40, width: 40, background: 'green', borderRadius: 5}} onClick={() => setIsDropDownVisible(!isDropDownVisibile)}></div>
            <Popover isVisible={isDropDownVisibile} setIsVisible={setIsDropDownVisible} closest="#propiccont"/>

        </div>
    )
}


const Popover = ({isVisible, setIsVisible, closest}) => {

    if(!isVisible) return null;


    const listener = e => {
        // console.log(e.target.closest(closest))
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
        <div className="popover">
            <ul>
                <li>View Profile</li>
                <li>Edit Profile</li>
                <li>Notifications</li>
                <li>Account Settings</li>
                <li>Log Out</li>
            </ul>
        </div>
    )

}