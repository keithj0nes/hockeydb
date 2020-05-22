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

// import Auth, { accessPlayer, accessManager, accessScorekeeper } from '../components/Auth';

// const navLinks = [
//     { name: 'Home',       to: '',            svg: <Home alt="home icon" />            },
//     { name: 'News',       to: '/news',        svg: <News alt="news icon" />           },
//     { name: 'Seasons',    to: '/seasons',     svg: <Seasons alt="season icon" />      },
//     { name: 'Divisions',  to: '/divisions',   svg: <Divisions alt="divisions icon" /> },
//     { name: 'Teams',      to: '/teams',       svg: <Teams alt="teams icon" />         },
//     { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
//     { name: 'Locations',  to: '/locations',   svg: <Players alt="players icon" />     },
//     { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         }
// ]


const navLinks1 = {
    admin: [
        { name: 'Home',       to: '',            svg: <Home alt="home icon" />            },
        { name: 'News',       to: '/news',        svg: <News alt="news icon" />           },
        { name: 'Seasons',    to: '/seasons',     svg: <Seasons alt="season icon" />      },
        { name: 'Divisions',  to: '/divisions',   svg: <Divisions alt="divisions icon" /> },
        { name: 'Teams',      to: '/teams',       svg: <Teams alt="teams icon" />         },
        { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
        { name: 'Locations',  to: '/locations',   svg: <Players alt="players icon" />     },
        { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         }
    ],
    scorekeeper: [
        { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
        { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         }
    ],
    manager: [
        { name: 'Teams',      to: '/teams',       svg: <Teams alt="teams icon" />         },
    ],
    player: []
}




class DashboardNav extends Component {

    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }


    render() {
        const { match } = this.props;

        return (
            <div style={{ height: '100%', display: 'flex', overflow: 'scroll', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div className="dashboard-nav-header">
                        <div><LeagueLogo /></div>
                        <h2>HockeyDB</h2>
                    </div>

                    <p style={{textAlign: 'center', fontSize: 13}}>CURRENT SEASON</p>
                    <p style={{textAlign: 'center', paddingBottom: 10}}>{this.props.currentSeason && this.props.currentSeason.name}</p>

                    <ul>
                        {/* {navLinks.map(link => (
                            <li key={link.to}>
                                <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        {link.svg}
                                    </div>
                                    {link.name}
                                </NavLink>
                            </li>
                        ))} */}

                        {navLinks1[this.props.admin_type].map(link => (
                            <li key={link.to}>
                                <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        {link.svg}
                                    </div>
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginBottom: 30, textAlign: 'center' }}>
                    <Button title={'Logout'} onClick={this.handleLogout} />
                    <Button title={'Back to Site'} onClick={() => this.props.history.push('/')} />

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        admin_type: state.user.user.admin_type,
        currentSeason: state.seasons.currentSeason
    }
}
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav)