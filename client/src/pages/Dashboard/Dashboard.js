/* eslint-disable no-multi-spaces */
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { toggleNavSlider } from '../../redux/actions/misc';
import { DashboardNav, HamburgerIcon, ProfilePic, SnackBar, SlideOut } from '../../components';
import DashSeasons from './DashSeasons/DashSeasons';
import DashSeasons2 from './DashSeasons/DashSeasons2';
import DashDivisions from './DashDivisions/DashDivisions';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashGamesDetails from './DashGames/DashGamesDetails';
import DashNews from './DashNews/DashNews';
import DashNewsCreate from './DashNews/DashNewsCreate';
import DashLocations from './DashLocations/DashLocations';
import DashUsers from './DashUsers/DashUsers';
import DashHome from './DashHome/DashHome';

import logo from 'assets/images/logo.png';
import { ICONS } from 'assets/ICONS';

import '../../assets/styles/dashboard.scss';


// should store dashLinks in Dashboard.js and pass to DashboardNav component as props
const dashboardPageList = {
    admin: [
        { name: 'Dashboard',  to: '',            icon: ICONS.DASHBOARD, component: DashHome,                      exact: true,  hideFromNavigation: false },
        { name: 'Seasons',    to: '/seasons',    icon: ICONS.SEASONS,   component: DashSeasons,                   exact: false, hideFromNavigation: false },
        { name: 'Seasons2',    to: '/seasons2',    icon: ICONS.SEASONS,   component: DashSeasons2,                   exact: false, hideFromNavigation: false },

        { name: 'Divisions',  to: '/divisions',  icon: ICONS.DIVISIONS, component: DashDivisions,                 exact: false, hideFromNavigation: false },
        { name: 'Teams',      to: '/teams',      icon: ICONS.TEAMS,     component: DashTeams,                     exact: false, hideFromNavigation: false },
        // { name: 'Players',    to: '/players',    icon: 'players', component: DashPlayers,                 exact: false, hideFromNavigation: false },
        { name: 'Games',      to: '/games',      icon: ICONS.GAMES,     component: DashGames,                     exact: true,  hideFromNavigation: false },
        { name: 'Games Dets', to: '/games/:id',  icon: null,            component: DashGamesDetails,              exact: true,  hideFromNavigation: true  },
        { name: 'Locations',  to: '/locations',  icon: ICONS.LOCATIONS, component: DashLocations,                 exact: false, hideFromNavigation: false },
        { name: 'Users',      to: '/users',      icon: ICONS.USERS,     component: DashUsers,                     exact: false, hideFromNavigation: false },
        { name: 'News',       to: '/news',       icon: ICONS.NEWS,      component: DashNews,                      exact: true,  hideFromNavigation: false },
        { name: 'News Dets',  to: '/news/:id',   icon: null,            component: DashNewsCreate,                exact: true,  hideFromNavigation: true  },
        { name: 'Messages',   to: '/messages',   icon: ICONS.MESSAGES,  component: () => <h1>MESSAGES PAGE</h1>,  exact: false, hideFromNavigation: false },
        { name: 'Pages',      to: '/pages',      icon: ICONS.PAGES,     component: () => <h1>PAGES PAGE</h1>,     exact: false, hideFromNavigation: false },
        { name: 'Payments',   to: '/payments',   icon: ICONS.PAYMENTS,  component: () => <h1>PAYMENTS PAGE</h1>,  exact: false, hideFromNavigation: false },
        { name: 'Settings',   to: '/settings',   icon: ICONS.SETTINGS,  component: () => <h1>SETTINGS PAGE</h1>,  exact: false, hideFromNavigation: false },
    ],
    scorekeeper: [
        { name: 'Players',    to: '/players',    icon: ICONS.USERS,     component: DashPlayers,                   exact: false, hideFromNavigation: false },
        { name: 'Games',      to: '/games',      icon: ICONS.GAMES,     component: DashGames,                     exact: true,  hideFromNavigation: false },
        { name: 'Games Dets', to: '/games/:id',  icon: null,            component: DashGamesDetails,              exact: true,  hideFromNavigation: true  },
    ],
    manager: [
        { name: 'My Teams',   to: '/myteams',    icon: ICONS.TEAMS,     component: () => <h1>MY TEAMS PAGE</h1>,  exact: false, hideFromNavigation: false },
    ],
    player: []
}

const Dashboard = (props) => {
    const { match } = props;
    return (
        <div className="dashboard-container">

            <SlideOut isVisible={props.navSliderVisible} onClose={props.toggleNavSlider} sticky>
                <DashboardNav {...props} dashLinks={dashboardPageList} />
            </SlideOut>

            <div className="dashboard-content">

                {/* <SnackBar /> */}
                {/* <Notification /> */}

                <div className="dashboard-header hide-desktop">
                    <HamburgerIcon onClick={props.toggleNavSlider} />
                    <img src={logo} alt="Logo" className="header-logo"/>
                    <ProfilePic />
                </div>

                {dashboardPageList[props.admin_type].map(page => {
                    return (
                        <Route 
                            key={page.to}
                            path={`${match.path}${page.to}`}
                            component={page.component}
                            exact={page.exact}
                        />
                    )
                })}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        admin_type: state.user.user.admin_type,
        currentSeason: state.seasons.currentSeason,
        navSliderVisible: state.misc.navSliderVisible
    }
}

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
