import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/auth'
import { Button } from './';


import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as Seasons } from '../assets/icons/seasons.svg';
import { ReactComponent as Divisions } from '../assets/icons/divisions.svg';
import { ReactComponent as Teams } from '../assets/icons/teams.svg';
import { ReactComponent as Players } from '../assets/icons/players.svg';
import { ReactComponent as Games } from '../assets/icons/games.svg';
import { ReactComponent as News } from '../assets/icons/news.svg';

import { ReactComponent as LeagueLogo } from '../assets/icons/league_logo.svg';

class DashboardNav extends Component {

    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }


    render() {
        const { match } = this.props;
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div className="dashboard-nav-header">
                        <div><LeagueLogo /></div>
                        <h2>HockeyDB</h2>
                    </div>

                    <ul>
                        <li>
                            <NavLink to={`${match.url}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>

                                <div className="nav-icon-container">
                                    <Home alt="home icon" />
                                </div>
                                Home

                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/blogs`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <News alt="news icon" />
                                </div>
                                News
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/seasons`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Seasons alt="season icon" />
                                </div>
                                Seasons
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/divisions`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Divisions alt="divisions icon" />
                                </div>
                                Divisions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/teams`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Teams alt="teams icon" />
                                </div>
                                Teams
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/players`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Players alt="players icon" />
                                </div>
                                Players
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/locations`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Players alt="players icon" />
                                </div>
                                Locations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${match.url}/games`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                <div className="nav-icon-container">
                                    <Games alt="games icon" />
                                </div>
                                Games
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: 30, textAlign: 'center' }}>
                    <Button title={'Logout'} onClick={this.handleLogout} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav)