import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { ReactComponent as LeagueLogo } from '../assets/icons/league_logo.svg';
import { Button } from './';

import './header.scss';

const navLinks = [
    { name: 'News',       to: '' },
    { name: 'Schedule',   to: 'schedule' },
    { name: 'Teams',      to: 'teams' },
    { name: 'Standings',  to: 'standings' },
    { name: 'Scoreboard', to: 'scoreboard' },
    { name: 'Stats',      to: 'stats' },
    { name: 'Contact',    to: 'contact' }
]

class Header extends Component {

    render() {
        const { match, location } = this.props;
        if(location.pathname.includes('/dashboard')) return null;
        return (
            <header>
                <div className="site-container">

                <div className="logo">
                    <LeagueLogo />
                </div>

                <nav>
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={() => console.log(`link pressed to ${link.to}`)}>
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>


                <div className="login">
                    <Button 
                        title="Player Register"
                        onClick={() => console.log('clicekd player register')}
                    />

                    <Button 
                        title="Login"
                        onClick={() => console.log('clicekd login')}
                        cancel
                        style={{minWidth: 'auto', color: '#FFFFFF'}}
                    />
                </div>
                </div>
            </header>
        )
    }
}

export default withRouter(Header);