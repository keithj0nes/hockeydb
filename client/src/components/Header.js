/* eslint-disable object-property-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import logo from 'assets/images/logo.png';
import { Button } from '.';
import SlideOut from './SlideOut';

import './header.scss';

// const navLinks = [
//     { name: 'Home', to: '' },
//     { name: 'Schedule', to: 'schedule' },
//     { name: 'Teams', to: 'teams' },
//     { name: 'Standings', to: 'standings' },
//     // { name: 'Scoreboard', to: 'scoreboard' },
//     { name: 'Stats', to: 'stats' },
//     { name: 'Contact',
//         to: 'contact',
//         subLinks: [
//             { name: 'general inquiry', to: 'inquiry' },
//             { name: 'league staff', to: 'schedule2' },
//             { name: 'player registration', to: 'schedule222' },
//         ],
//     },
// ];

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

class Header extends Component {
    state = {
        mobileSliderVisible: false,
    }


    toggleMobileSlider = () => {
        this.setState({ mobileSliderVisible: !this.state.mobileSliderVisible });
    }

    linkTo = path => {
        this.props.history.push(path);
    }


    render() {
        const { match, location } = this.props;
        if (location.pathname.includes('/dashboard')) return null;

        const { mobileSliderVisible } = this.state;

        return (
            <header>

                {/* DESKTOP HEADER */}

                <div className="hide-mobile">
                    <div className="site-container">

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', top: 0, paddingLeft: 10 }}>
                                <img src={logo} alt="Logo" className="logo" />
                            </div>

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
                        </div>

                        <div className="login">

                            {/* <Button
                                title={this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                                onClick={() => this.linkTo(this.props.isUserLoggedIn ? '/dashboard' : '/login')}
                                type="cancel"
                                style={{ minWidth: 'auto', textTransform: 'uppercase', color: '#FFFFFF', paddingRight: 10 }}
                            /> */}

                            <NavLink to={this.props.isUserLoggedIn ? '/dashboard' : '/login'} style={{ marginRight: 10 }} className="link" exact activeClassName="selected" onClick={() => console.log(`to ${this.props.isUserLoggedIn ? '/dashboard' : '/login'}`)}>
                                {this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                            </NavLink>
                        </div>
                    </div>
                </div>


                {/* MOBILE HEADER */}
                <div className="hide-desktop">
                    <div className="hamburger-menu" onClick={this.toggleMobileSlider}>
                        <div className="line" />
                        <div className="line" />
                        <div className="line" />
                    </div>

                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>


                    {/* <Button
                        title={this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                        onClick={() => this.linkTo(this.props.isUserLoggedIn ? '/dashboard' : '/login')}
                        type="cancel"
                        style={{ minWidth: 'auto', textTransform: 'uppercase', color: '#FFFFFF', padding: '10px 0 10px 10px' }}
                    /> */}

                    <NavLink to={this.props.isUserLoggedIn ? '/dashboard' : '/login'} className="link" style={{ padding: '10px 0' }} exact activeClassName="selected" onClick={() => console.log(`to ${this.props.isUserLoggedIn ? '/dashboard' : '/login'}`)}>
                        {this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                    </NavLink>


                    <SlideOut isVisible={mobileSliderVisible} onClose={this.toggleMobileSlider}>
                        <VisitorSlideOutNav match={match} toggleMobileSlider={this.toggleMobileSlider} />
                    </SlideOut>
                </div>


            </header>
        );
    }
}

const mapStateToProps = state => ({
    isUserLoggedIn: state.user.isUserLoggedIn,
});

export default withRouter(connect(mapStateToProps)(Header));

Header.propTypes = {
    isUserLoggedIn: PropTypes.bool,
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
};

const VisitorSlideOutNav = ({ match, toggleMobileSlider }) => (
    <>
        <div className="visitor-nav">

            <div className="close" onClick={toggleMobileSlider}>&times;</div>

            <div className="logo-container">
                {/* <div><LeagueLogo /></div> */}
                <img src={logo} alt="Logo" className="logo" />

                <h2>HockeyDB</h2>
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
