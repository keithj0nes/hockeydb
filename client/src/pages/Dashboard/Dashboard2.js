/* eslint-disable no-multi-spaces */
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from 'assets/images/logo.png';
import { ICONS } from 'assets/ICONS';
import { HamburgerIcon, ProfilePic, Icon } from '../../components';
import DashSeasons2 from './DashSeasons/DashSeasons2';
import DashDivisions2 from './DashDivisions/DashDivisions2';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashGamesDetails from './DashGames/DashGamesDetails';
import DashNews2 from './DashNews/DashNews2';
import DashNewsCreate2 from './DashNews/DashNewsCreate2';
import DashLocations2 from './DashLocations/DashLocations2';
import DashUsers2 from './DashUsers/DashUsers2';
import DashHome from './DashHome/DashHome';
import { Site_Name_Full } from '../../assets/resourceStrings';

import '../../assets/styles/dashboard.scss';

const { Content, Footer, Sider } = Layout;

const dashLinks = {
    admin: [
        { name: 'Dashboard',  to: '',            icon: ICONS.DASHBOARD, component: DashHome,                       exact: true,  hideFromNavigation: false },
        { name: 'Seasons',    to: '/seasons',    icon: ICONS.SEASONS,   component: DashSeasons2,                   exact: false, hideFromNavigation: false },
        { name: 'Divisions',  to: '/divisions',  icon: ICONS.DIVISIONS, component: DashDivisions2,                 exact: false, hideFromNavigation: false },
        { name: 'Teams',      to: '/teams',      icon: ICONS.TEAMS,     component: DashTeams,                      exact: false, hideFromNavigation: false },
        // { name: 'Players',    to: '/players',    icon: 'players', component: DashPlayers,                 exact: false, hideFromNavigation: false },
        { name: 'Games',      to: '/games',      icon: ICONS.GAMES,     component: DashGames,                      exact: true,  hideFromNavigation: false },
        { name: 'Games Dets', to: '/games/:id',  icon: null,            component: DashGamesDetails,               exact: true,  hideFromNavigation: true  },
        { name: 'Locations',  to: '/locations',  icon: ICONS.LOCATIONS, component: DashLocations2,                 exact: false, hideFromNavigation: false },
        { name: 'Users',      to: '/users',      icon: ICONS.USERS,     component: DashUsers2,                     exact: false, hideFromNavigation: false },
        { name: 'Announcements', to: '/announcements', icon: ICONS.NEWS, component: DashNews2,                     exact: true,  hideFromNavigation: false },
        { name: 'Announcements Detailss', to: '/announcements/:id', icon: null, component: DashNewsCreate2,        exact: true,  hideFromNavigation: true  },
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
        { name: 'Players',    to: '/players',    icon: ICONS.USERS,     component: DashPlayers,                   exact: false, hideFromNavigation: false },
    ],
    player: [
        { name: 'Players',    to: '/players',    icon: ICONS.USERS,     component: DashPlayers,                   exact: false, hideFromNavigation: false },
    ],
};


const Dashboard = (props) => {
    const { match, admin_type, currentSeason } = props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const hasAccess = dashLinks[props.admin_type || 'player'].filter(navLink => props.location.pathname.includes(navLink.to));

        if (hasAccess.length <= 0) {
            console.log('Not allowed at this route, redirecting to', `/dashboard${dashLinks[props.admin_type || 'player'][0].to}`);
            // this timeout to ensures redirect happens
            setTimeout(() => props.history.push(`/dashboard${dashLinks[props.admin_type || 'player'][0].to}`), 200);
        }
    }, []);

    const DashboardMenu = (
        <div className="dashboard-nav-menu">
            <div>
                <div className="dashboard-nav-header2">
                    <img src={logo} alt={`${Site_Name_Full} Logo`} className="m-r-s" />
                    <div>
                        <h2>{Site_Name_Full}</h2>
                        <p>{currentSeason?.name || 'No season selected'}</p>
                    </div>
                </div>
                <h3>Navigation</h3>
                <Menu defaultSelectedKeys={['1']} className="menu">
                    {dashLinks[admin_type || 'player'].map(link => (
                        !link.hideFromNavigation && (
                            <Menu.Item key={link.to}>
                                <NavLink to={`${match.url}${link.to}`} exact={link.to === ''} activeClassName="selected2">
                                    <div className="icon-container">
                                        <Icon name={link.icon} />
                                    </div>
                                    {link.name}
                                </NavLink>
                            </Menu.Item>
                        )
                    ))}
                </Menu>
            </div>

            <div className="text-center p-b-xs p-t-xl">
                <a className="powered-by" href="#a">Powered by Playmaker Leagues</a>
            </div>
        </div>
    );

    return (
        <Layout className="dashboard-container">
            <Sider
                width={260}
                trigger={null}
                breakpoint="md"
                collapsedWidth="0"
            >
                {DashboardMenu}
            </Sider>

            {/* MOBILE SLIDEOUT */}
            <Drawer
                width="80%"
                placement="left"
                onClick={() => setVisible(false)}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                {DashboardMenu}
            </Drawer>
            <Layout>

                {/* MOBILE HEADER */}
                <div className="dashboard-header hide-desktop">
                    <HamburgerIcon onClick={() => setVisible(!visible)} />
                    <img src={logo} alt="Logo" className="header-logo" />
                    <ProfilePic />
                </div>

                <Content>
                    {dashLinks[admin_type || 'player'].map(page => (
                        <Route
                            key={page.to}
                            path={`${match.path}${page.to}`}
                            component={page.component}
                            exact={page.exact}
                        />
                    ))}
                </Content>

                <Footer className="text-center">
                    {Site_Name_Full} ©{new Date().getFullYear()} <br />
                    All rights reserved
                </Footer>
            </Layout>
        </Layout>
    );
};

const mapStateToProps = state => ({
    admin_type: state.user.user.admin_type,
    navSliderVisible: state.misc.navSliderVisible,
    currentSeason: state.seasons.currentSeason,
});

export default connect(mapStateToProps)(Dashboard);

Dashboard.propTypes = {
    match: PropTypes.object,
    admin_type: PropTypes.string,
    currentSeason: PropTypes.object,
};
