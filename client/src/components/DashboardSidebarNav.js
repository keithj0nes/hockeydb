import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleNavSlider } from '../redux/actions/misc';
import { NavLink } from 'react-router-dom';
import '../assets/styles/dashboardsidebarnav.scss';

import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as Seasons } from '../assets/icons/seasons.svg';
import { ReactComponent as Divisions } from '../assets/icons/divisions.svg';
import { ReactComponent as Teams } from '../assets/icons/teams.svg';
import { ReactComponent as Players } from '../assets/icons/players.svg';
import { ReactComponent as Games } from '../assets/icons/games.svg';
import { ReactComponent as News } from '../assets/icons/news.svg';

import { ReactComponent as LeagueLogo } from '../assets/icons/league_logo.svg';



class DashboardSidebarNav extends Component {

    render() {
        const { match, navSliderVisible } = this.props;
        let visibility = navSliderVisible ? "show" : "hide";

        // console.log(this.props, 'match!')

        return (
            <div className={`dashboard-nav-container dashboard-nav-container-${visibility}`}>

                <div className={`dashboard-nav-background fade-in-${visibility}`}>
                </div>

                <div className={`dashboard-nav-sliding-container dashboard-nav-${visibility}`}>




                    <div className={"dashboard-nav"}>
                        <div className={"hide-desktop close"} onClick={this.props.toggleNavSlider}>&times;</div>

                        <div className="dashboard-nav-header">
                            <div><LeagueLogo /></div>
                            <h2>HockeyDB</h2>
                        </div>


                        <ul>
                            <li>
                                <NavLink to={`${match.url}`} exact activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                
                                    <div className="nav-icon-container">
                                        <Home alt="home icon"/>
                                        {/* <img src={Home} alt=""/>  */}
                                    </div>
                                    Home
                                
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/blogs`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <News alt="news icon"/>
                                    </div>
                                    News
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/seasons`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <Seasons alt="season icon"/>
                                    </div>
                                    Seasons
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/divisions`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <Divisions alt="divisions icon"/>
                                    </div>
                                    Divisions
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/teams`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <Teams alt="teams icon"/>
                                    </div>
                                    Teams
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/players`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <Players alt="players icon"/>
                                    </div>
                                    Players
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`${match.url}/games`} activeClassName="selected" onClick={this.props.toggleNavSlider}>
                                    <div className="nav-icon-container">
                                        <Games alt="games icon"/>
                                    </div>
                                    Games
                                </NavLink>
                            </li>

                        </ul>
                    </div>

                    <div className={"dashboard-nav-close"} onClick={this.props.toggleNavSlider}>

                    </div>


                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    navSliderVisible: state.misc.navSliderVisible
})

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebarNav);