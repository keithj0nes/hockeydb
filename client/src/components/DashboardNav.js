import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from 'redux/actions/auth'
import { Button } from './';
import { history } from '../helpers';

import { ICONS } from 'assets/ICONS';

import { Icon } from 'components';


// import { ReactComponent as Home } from 'assets/icons/home.svg';
// import { ReactComponent as Seasons } from 'assets/icons/seasons.svg';
// import { ReactComponent as Divisions } from 'assets/icons/divisions.svg';
// import { ReactComponent as Teams } from 'assets/icons/teams.svg';
// import { ReactComponent as Players } from 'assets/icons/players.svg';
// import { ReactComponent as Games } from 'assets/icons/games.svg';
// import { ReactComponent as News } from 'assets/icons/news.svg';

// import { ReactComponent as LeagueLogo } from 'assets/icons/league_logo.svg';

import logo from 'assets/images/logo.png';

import './dashboardnav.scss';

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


// const navLinks1 = {
//     admin: [
//         { name: 'Home',       to: '',             svg: <Home alt="home icon" />           },
//         { name: 'News',       to: '/news',        svg: <News alt="news icon" />           },
//         { name: 'Seasons',    to: '/seasons',     svg: <Seasons alt="season icon" />      },
//         { name: 'Divisions',  to: '/divisions',   svg: <Divisions alt="divisions icon" /> },
//         { name: 'Teams',      to: '/teams',       svg: <Teams alt="teams icon" />         },
//         { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
//         { name: 'Locations',  to: '/locations',   svg: <Players alt="players icon" />     },
//         { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         },
//         { name: 'Users',      to: '/users',       svg: <Players alt="players icon" />     },
//     ],
//     scorekeeper: [
//         { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
//         { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         }
//     ],
//     manager: [
//         { name: 'My Teams',   to: '/myteams',     svg: <Teams alt="teams icon" />         },
//     ],
//     player: []
// }

// const dashLinks = {
//     admin: [
//         { name: 'Dashboard',  to: '',             svg: <Home alt="home icon" />           },
//         { name: 'Seasons',    to: '/seasons',     svg: <Seasons alt="season icon" />      },
//         { name: 'Divisions',  to: '/divisions',   svg: <Divisions alt="divisions icon" /> },
//         { name: 'Teams',      to: '/teams',       svg: <Teams alt="teams icon" />         },
//         { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
//         { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         },
//         { name: 'Locations',  to: '/locations',   svg: <Players alt="players icon" />     },
//         { name: 'Users',      to: '/users',       svg: <Players alt="players icon" />     },
//         { name: 'News',       to: '/news',        svg: <News alt="news icon" />           },

//         { name: 'Messages',   to: '/messages',    svg: <Players alt="players icon" />     },
//         { name: 'Pages',      to: '/pages',       svg: <Players alt="players icon" />     },
//         { name: 'Payments',   to: '/payments',    svg: <News alt="news icon" />           },
//         { name: 'Settings',    to: '/settings',   svg: <News alt="news icon" />           },
//     ],
//     scorekeeper: [
//         { name: 'Players',    to: '/players',     svg: <Players alt="players icon" />     },
//         { name: 'Games',      to: '/games',       svg: <Games alt="games icon" />         }
//     ],
//     manager: [
//         { name: 'My Teams',   to: '/myteams',     svg: <Teams alt="teams icon" />         },
//     ],
//     player: []
// }

const dashLinks = {
    admin: [
        { name: 'Dashboard',  to: '',            icon: ICONS.DASHBOARD },
        { name: 'Seasons',    to: '/seasons',    icon: ICONS.SEASONS   },
        { name: 'Divisions',  to: '/divisions',  icon: ICONS.DIVISIONS },
        { name: 'Teams',      to: '/teams',      icon: ICONS.TEAMS     },
        // { name: 'Players',    to: '/players',    icon: 'players'   },
        { name: 'Games',      to: '/games',      icon: ICONS.GAMES     },
        { name: 'Locations',  to: '/locations',  icon: ICONS.LOCATIONS },
        { name: 'Users',      to: '/users',      icon: ICONS.USERS     },
        { name: 'News',       to: '/news',       icon: ICONS.NEWS      },
        { name: 'Messages',   to: '/messages',   icon: ICONS.MESSAGES  },
        { name: 'Pages',      to: '/pages',      icon: ICONS.PAGES     },
        { name: 'Payments',   to: '/payments',   icon: ICONS.PAYMENTS  },
        { name: 'Settings',   to: '/settings',   icon: ICONS.SETTINGS  },
    ],
    scorekeeper: [
        { name: 'Players',    to: '/players',    icon: ICONS.USERS     },
        { name: 'Games',      to: '/games',      icon: ICONS.GAMES     }
    ],
    manager: [
        { name: 'My Teams',   to: '/myteams',    icon: ICONS.TEAMS     },
    ],
    player: []
}




class DashboardNav extends Component {

    // this componentDidMount checks to make sure the URL matches a path the logged in 
    // user can access otherwise it redirects to the first page in the navLinks array
    componentDidMount() {
        const hasAccess = dashLinks[this.props.admin_type].filter(navLink =>  {
            return this.props.location.pathname.includes(navLink.to)
        })

        if(hasAccess.length <= 0) {
            console.log('Not allowed at this route, redirecting to', `/dashboard${dashLinks[this.props.admin_type][0].to}`)
            return history.push(`/dashboard${dashLinks[this.props.admin_type][0].to}`)
        }
    }

    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { match } = this.props;



        return (

            <div className='dashboard-nav-a'>

                {/* might not need this div? test before deleting */}
                <div style={{ height: '100%', display: 'flex', overflow: 'scroll', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        {/* <div className="dashboard-nav-header">
                            <img src={logo} alt="Logo" />
                            <h2>HockeyDB</h2>
                            <p style={{fontSize: 13, paddingBottom: 10}}>Current Season: {this.props.currentSeason && this.props.currentSeason.name}</p>
                        </div> */}

                        <div className="dashboard-nav-header">
                            <img src={logo} alt="Logo" />

                            <div>
                                <h2>HockeyDB</h2>
                                {/* <p>Current Season: {this.props.currentSeason && this.props.currentSeason.name}</p> */}
                                <p>{this.props.currentSeason && this.props.currentSeason.name}</p>

                                {/* <p>CURRENT SEASON</p>
                                <p>{this.props.currentSeason && this.props.currentSeason.name}</p> */}

                            </div>
                        </div>

                        <h3>Navigation</h3>
                        <ul>
                            {dashLinks[this.props.admin_type].map(link => (
                                <li key={link.to}>
                                    <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                        <div className="nav-icon-container">
                                            {/* {link.svg} */}
                                            <Icon name={link.icon}/>
                                        </div>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}

                        </ul>
                    </div>

                    <div style={{ margin: '40px 0 10px', textAlign: 'center' }}>
                        <Button title={'Logout'} onClick={this.handleLogout} />
                        <br/>

                        <Button title={'Back to Site'} onClick={() => this.props.history.push('/')} />
                                <br/>
                                <br/>
                        <a className="powered-by" href="#a">Powered by Playmaker Leagues</a>

                    </div>
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



// old dash nav

// return (
//     <div className='dashboard-nav'>
//         <div style={{ height: '100%', display: 'flex', overflow: 'scroll', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <div>
//                 <div className="dashboard-nav-header">
//                     <div><LeagueLogo /></div>
//                     <h2>HockeyDB</h2>
//                 </div>
//                 <p style={{textAlign: 'center', fontSize: 13}}>CURRENT SEASON</p>
//                 <p style={{textAlign: 'center', paddingBottom: 10}}>{this.props.currentSeason && this.props.currentSeason.name}</p>
//                 <ul>
//                     {navLinks1[this.props.admin_type].map(link => (
//                         <li key={link.to}>
//                             <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>
//                                 <div className="nav-icon-container">
//                                     {link.svg}
//                                 </div>
//                                 {link.name}
//                             </NavLink>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <div style={{ margin: '40px 0 30px', textAlign: 'center' }}>
//                 <Button title={'Logout'} onClick={this.handleLogout} />
//                 <Button title={'Back to Site'} onClick={() => this.props.history.push('/')} />
//             </div>
//         </div>
//     </div>
// )