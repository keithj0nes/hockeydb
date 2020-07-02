import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Popover } from 'components';
import './profilepic.scss';

const ProfilePic = ({user}) => {

    const [ isDropDownVisibile, setIsDropDownVisible ] = useState(false);

    return (

        <div id="propiccont" style={{position: 'relative'}}>

            <div style={{height: 40, width: 40, background: 'green', borderRadius: 5}} onClick={() => setIsDropDownVisible(!isDropDownVisibile)}></div>
            <p className="hide-mobile">{user.first_name} {user.last_name}</p>            

            <Popover isVisible={isDropDownVisibile} setIsVisible={setIsDropDownVisible} closest="#propiccont">
                <ul>
                    <li>View Profile</li>
                    <li>Edit Profile</li>
                    <li>Notifications</li>
                    <li>Account Settings</li>
                    <li>Log Out</li>
                </ul>
            </Popover>

        </div>
    )
}


const mapStateToProps = state => {
    console.log(state, 'STAATTE')
    return {
        user: state.user.user,
        currentSeason: state.seasons.currentSeason,
        navSliderVisible: state.misc.navSliderVisible
    }
}

const mapDispatchToProps = dispatch => ({
    // toggleNavSlider: () => dispatch(toggleNavSlider()),
    // logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePic);
