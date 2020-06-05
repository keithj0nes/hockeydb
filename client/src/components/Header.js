import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { ReactComponent as LeagueLogo } from '../assets/icons/league_logo.svg';
import { Button } from './';
import SlideOut from './SlideOut';
import HeadManager from './HeadManager';

import './header.scss';

const navLinks = [
    { name: 'Home',       to: '' },
    { name: 'Schedule',   to: 'schedule' },
    { name: 'Teams',      to: 'teams' },
    { name: 'Standings',  to: 'standings' },
    // { name: 'Scoreboard', to: 'scoreboard' },
    { name: 'Stats',      to: 'stats' },
    { name: 'Contact',    to: 'contact', subLinks: [
                                            { name: 'general inquiry',     to: 'inquiry' }, 
                                            { name: 'league staff',        to: 'schedule2' }, 
                                            { name: 'player registration', to: 'schedule222' }
                                        ] 
    }
]

class Header extends Component {

    state = {
        mobileSliderVisible: false
    }
    
    
    toggleMobileSlider = () => {
        this.setState({mobileSliderVisible: !this.state.mobileSliderVisible})
    }

    linkTo = path => {
        this.props.history.push(path);
    }



    render() {
        const { match, location } = this.props;
        if(location.pathname.includes('/dashboard')) return null;

        const { mobileSliderVisible } = this.state;
        let visibility = mobileSliderVisible ? "show" : "hide";

        return (
            <header>
                <HeadManager/> 

            {/* DESKTOP HEADER */}

                <div className="hide-mobile">
                    <div className="site-container">

                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div className="logo">
                                <LeagueLogo />
                            </div>

                            <nav>
                                <ul>
                                    {navLinks.map(link => (
                                        <li key={link.to}>
                                            <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={() => console.log(`link pressed to ${link.to}`)}>
                                                {link.name}
                                                {link.subLinks && (<div className="arrow" />)}
                                            </NavLink>

                                            {link.subLinks && (

                                                <ul className={'sub-links'}>
                                                    {link.subLinks.map(subLink => {
                                                        return (
                                                            <li key={subLink.to}>
                                                                <NavLink to={`${match.url}${subLink.to}`} exact activeClassName="selected" onClick={() => console.log(`link pressed to ${link.to}`)}>
                                                                    {subLink.name}
                                                                </NavLink> 

                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        <div className="login">

                            {/* {!this.props.isUserLoggedIn && (

                                <Button 
                                    title="Player Register"
                                    onClick={() => console.log('clicekd player register')}
                                    style={{textTransform: 'uppercase'}}
                                />
                            )} */}

                            <Button 
                                title={this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                                onClick={() => this.linkTo(this.props.isUserLoggedIn ? '/dashboard' : '/login')}
                                cancel
                                style={{minWidth: 'auto', textTransform: 'uppercase', color: '#FFFFFF', paddingRight: 10}}
                            />
                        </div>
                    </div>
                </div>


            {/* MOBILE HEADER */}
                <div className="hide-desktop">
                    <div className="hamburger-menu" onClick={this.toggleMobileSlider}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>

                    <div className="logo">
                        <LeagueLogo />
                    </div>


                    <Button 
                        title={this.props.isUserLoggedIn ? 'Dashboard' : 'Login'}
                        onClick={() => this.linkTo(this.props.isUserLoggedIn ? '/dashboard' : '/login')}
                        cancel
                        style={{minWidth: 'auto', textTransform: 'uppercase', color: '#FFFFFF', padding: '10px 0 10px 10px'}}
                    />


                    <SlideOut isVisible={this.state.mobileSliderVisible} onClose={this.toggleMobileSlider}>
                        <VisitorSlideOutNav match={this.props.match} toggleMobileSlider={this.toggleMobileSlider} />
                    </SlideOut>
                </div>



            </header>
        )
    }
}

const mapStateToProps = state => {
    // console.log(state, 'state in header!')
    return {
        isUserLoggedIn: state.user.isUserLoggedIn
    }
}
export default withRouter(connect(mapStateToProps)(Header));



const VisitorSlideOutNav = ({match, toggleMobileSlider}) => {
    return (
        <>
            <div className={"visitor-nav"}>

            <div className={"close"} onClick={toggleMobileSlider}>&times;</div>

                <div className="logo">
                    <div><LeagueLogo /></div>
                    <h2>HockeyDB</h2>
                </div>

                <nav>
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={toggleMobileSlider}>
                                    <div style={{height: 30, width: 30, background: 'white'}}/>{link.name}

                                    {link.subLinks && (<div className="arrow" />)}
                                </NavLink> 

                                {link.subLinks && (

                                    <ul className={'sub-links'}>
                                        {link.subLinks.map(subLink => {
                                            return (
                                                <li key={subLink.to}>
                                                    <NavLink to={`${match.url}${subLink.to}`} exact activeClassName="selected" onClick={toggleMobileSlider}>
                                                        <div style={{height: 30, width: 30, background: 'white'}}/>{subLink.name}
                                                    </NavLink> 

                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}