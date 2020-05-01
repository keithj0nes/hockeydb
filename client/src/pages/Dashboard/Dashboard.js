import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import { toggleNavSlider } from '../../redux/actions/misc';
import { logout } from '../../redux/actions/auth'
import { DashboardSidebarNav, DashboardNav, HamburgerIcon } from '../../components';
import DashSeasons from './DashSeasons/DashSeasons';
import DashDivisions from './DashDivisions/DashDivisions';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashNews from './DashNews/DashNews';
import DashNewsCreate from './DashNews/DashNewsCreate';
import DashLocations from './DashLocations/DashLocations';


import '../../assets/styles/dashboard.scss';

const navLinks = [
    {name: 'Profile', to: '/dashboard/profile' },
    {name: 'Notifications', to: '/dashboard/notifications' },
    {name: 'Settings', to: '/dashboard/settings' },
    // {name: 'Logout', to: '/dashboard/logout' },
]

class Dashboard extends Component {

    state = {
        showProfile: false
        // showProfile: true
    }

    handleLogout = () => {
        this.toggleShowProfile();
        this.props.logout();
        this.props.history.push('/');
    }

    toggleShowProfile = () => {
        this.setState({showProfile: !this.state.showProfile})
    }

    render() {
        const { match } = this.props;
        return (
            <>

                <div style={{height: '100%', width: '100%', zIndex: 1100, position: 'absolute', display: this.state.showProfile ? 'block' : 'none'}} onClick={this.toggleShowProfile}></div>
                <div className="dashboard-container">



                    <DashboardSidebarNav {...this.props} >
                        <DashboardNav {...this.props} />
                    </DashboardSidebarNav>

                    <div className="nav-container-filler"></div>

                    <div className="dashboard-content">
                        <div className="dashboard-header">
                            <HamburgerIcon onClick={this.props.toggleNavSlider} />
                            <div style={{textAlign: 'center'}} className="hide-desktop">
                                <p style={{textAlign: 'center', fontSize:13}}>CURRENT SEASON</p>
                                <p style={{textAlign: 'center'}}>{this.props.currentSeason && this.props.currentSeason.name}</p>
                            </div>

                            <div className="hide-mobile">
                                <p style={{textAlign: 'center'}}>{this.props.user && `${this.props.user.first_name} ${this.props.user.last_name}`}</p>

                            </div>

                            <div className="dashboard-header-img" onClick={this.toggleShowProfile}></div>

                                {/* profile slide down */}

                            <div className={`dashboard-settings-container ${this.state.showProfile && 'slide-down'}`}>

                                {/* <p style={{position: 'absolute', top: 10, right: 10}} onClick={this.toggleShowProfile}>CLOSE!!!</p> */}

                                <div className="profile-image">
                                    <h4 className="name">{this.props.user.first_name} {this.props.user.last_name}</h4>
                                    <p className="admin-type">{this.props.user.admin_type}</p>
                                </div>

                                <div className="profile-links-container">

                                    <ul>
                                        {navLinks.map(link => {
                                            return (
                                                <li key={link.to}> <NavLink to={link.to} activeClassName="selected" onClick={this.toggleShowProfile}>{link.name}</NavLink> </li>
                                            )
                                        })}

                                        {/* <li><a onClick={this.handleLogout}>Logout</a></li> */}
                                        {/* <li onClick={this.handleLogout}>Logout</li> */}
                                        <li>
                                            <p onClick={this.handleLogout}>
                                            Logout
                                            </p> 
                                        </li>


                                    </ul>

                                </div>
                            </div>




                        </div>

                        <Route path={`${match.path}/seasons`}   component={DashSeasons} />
                        <Route path={`${match.path}/divisions`} component={DashDivisions} />
                        <Route path={`${match.path}/teams`}     component={DashTeams} />
                        <Route path={`${match.path}/players`}   component={DashPlayers} />
                        <Route path={`${match.path}/games`}     component={DashGames} />
                        <Route path={`${match.path}/news`}      component={DashNews} exact />
                        <Route path={`${match.path}/news/:id`}  component={DashNewsCreate} />
                        <Route path={`${match.path}/locations`} component={DashLocations} />
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        currentSeason: state.seasons.currentSeason
    }
}

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider()),
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);