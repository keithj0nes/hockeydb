/* eslint-disable object-property-newline */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import logo from 'assets/images/logo.png';
import { Site_Name_Full } from 'assets/resourceStrings';
import SlideOut from './SlideOut';
import { Banner } from '.';

import './header.scss';

const navLinks = [
    { name: 'Home', to: '' },
    { name: 'Schedule', to: 'schedule' },
    { name: 'Teams', to: 'teams' },
    { name: 'Standings', to: 'standings' },
    // { name: 'Scoreboard', to: 'scoreboard' },
    { name: 'Stats', to: 'stats' },
    { name: 'More', to: 'more', subLinks: [
        { name: 'general inquiry', to: 'inquiry' },
        { name: 'league staff', to: 'schedule2' },
        { name: 'player registration', to: 'schedule222' },
    ],
    },
];


const Header = ({ match, location, isUserLoggedIn }) => {
    const [mobileSliderVisible, setMobileSliderVisible] = useState(false);

    const toggleMobileSlider = () => {
        setMobileSliderVisible(!mobileSliderVisible);
    };

    if (location.pathname.includes('/dashboard')) return null;
    return (
        <>
            <header>

                {/* DESKTOP HEADER */}

                <div className="hide-mobile">
                    <div className="site-container">
                        <NavLink to="" style={{ position: 'absolute', top: 0, paddingLeft: 10 }}>
                            <img src={logo} alt="Logo" className="logo" />
                        </NavLink>

                        <nav>
                            <ul>
                                {navLinks.map(link => (
                                    <li key={link.to}>
                                        <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}>
                                            {link.name}
                                            {link.subLinks && (<div className="arrow" />)}
                                        </NavLink>

                                        {link.subLinks && (

                                            <ul className="sub-links box-shadow">
                                                {link.subLinks.map(subLink => (
                                                    <li key={subLink.to}>
                                                        <NavLink to={`${match.url}${subLink.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}>
                                                            {subLink.name}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="login">
                            <NavLink to={isUserLoggedIn ? '/dashboard' : '/login'} style={{ marginRight: 10 }} className="link" exact activeClassName="selected" onClick={() => console.log(`to ${isUserLoggedIn ? '/dashboard' : '/login'}`)}>
                                {isUserLoggedIn ? 'Dashboard' : 'Login'}
                            </NavLink>
                        </div>
                    </div>
                </div>


                {/* MOBILE HEADER */}
                <div className="hide-desktop">
                    <div className="hamburger-menu" onClick={toggleMobileSlider}>
                        <div className="line" />
                        <div className="line" />
                        <div className="line" />
                    </div>

                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>

                    <NavLink to={isUserLoggedIn ? '/dashboard' : '/login'} className="link" style={{ padding: '10px 0' }} exact activeClassName="selected" onClick={() => console.log(`to ${isUserLoggedIn ? '/dashboard' : '/login'}`)}>
                        {isUserLoggedIn ? 'Dashboard' : 'Login'}
                    </NavLink>

                    <SlideOut isVisible={mobileSliderVisible} onClose={toggleMobileSlider}>
                        <VisitorSlideOutNav match={match} toggleMobileSlider={toggleMobileSlider} />
                    </SlideOut>
                </div>

            </header>

            <div className="site-container">
                <Banner />
            </div>
        </>
    );
};


const mapStateToProps = state => ({
    isUserLoggedIn: state.user.isUserLoggedIn,
});

export default withRouter(connect(mapStateToProps)(Header));

Header.propTypes = {
    isUserLoggedIn: PropTypes.bool,
    match: PropTypes.object,
    location: PropTypes.object,
};

const VisitorSlideOutNav = ({ match, toggleMobileSlider }) => (
    <>
        <div className="visitor-nav">

            <div className="close" onClick={toggleMobileSlider}>&times;</div>

            <div className="logo-container">
                <NavLink to="" onClick={toggleMobileSlider}>
                    <img src={logo} alt="Logo" className="logo" />
                </NavLink>

                <h2>{Site_Name_Full}</h2>
            </div>

            <nav>
                <ul>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={toggleMobileSlider}>
                                <div style={{ height: 30, width: 30, background: 'white' }} />{link.name}

                                {link.subLinks && (<div className="arrow" />)}
                            </NavLink>

                            {link.subLinks && (

                                <ul className="sub-links">
                                    {link.subLinks.map(subLink => (
                                        <li key={subLink.to}>
                                            <NavLink to={`${match.url}${subLink.to}`} exact activeClassName="selected" onClick={toggleMobileSlider}>
                                                <div style={{ height: 30, width: 30, background: 'white' }} />{subLink.name}
                                            </NavLink>

                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </>
);

VisitorSlideOutNav.propTypes = {
    match: PropTypes.object,
    toggleMobileSlider: PropTypes.func,
};
