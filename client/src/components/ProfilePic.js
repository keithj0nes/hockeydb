import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, Popover } from 'components';
import { ICONS } from 'assets/ICONS';
import { logout } from 'redux/actions/auth';
import { history } from 'helpers';
import './profilepic.scss';

const ProfilePic = ({user, logout}) => {
    const [ isDropDownVisibile, setIsDropDownVisible ] = useState(false);

    const handleLogout = () => {
        logout();
        history.push('/');
    }

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
                    <li><Link to='/dashboard/profile'> View Profile </Link></li>
                    <li>Notifications</li>
                    <li>Account Settings</li>
                    <li><Link to='/'> Back to site </Link></li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </Popover>

        </div>
    )
}


const mapStateToProps = state => {
    return {
        user: state.user.user,
        currentSeason: state.seasons.currentSeason,
        navSliderVisible: state.misc.navSliderVisible
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePic);
