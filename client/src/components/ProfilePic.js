import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Icon, Popover } from 'components';
import { ICONS } from 'assets/ICONS';
import './profilepic.scss';
// import cm from 'assets/icons/icondropdown_arrow.svg';

const ProfilePic = ({user}) => {

    const [ isDropDownVisibile, setIsDropDownVisible ] = useState(false);

    return (

        <div id="propiccont" className="profile-pic-container">

            <div className="pic-name" onClick={() => setIsDropDownVisible(!isDropDownVisibile)}>

                <div className="pic-image-filler" ></div>
                <p className={`hide-mobile name-icon ${isDropDownVisibile && 'active'}`}>{user.first_name} {user.last_name} 
                    <span>
                        <Icon name={ICONS.CIRCLE_ARROW} />
                    </span> 
                </p>            
            </div>

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
