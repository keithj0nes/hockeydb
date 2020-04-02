import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { toggleNavSlider } from '../../redux/actions/misc';
import { DashboardSidebarNav, DashboardNav, HamburgerIcon } from '../../components';
import DashSeasons from './DashSeasons/DashSeasons';
import DashDivisions from './DashDivisions/DashDivisions';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashNews from './DashNews/DashNews';
import DashLocations from './DashLocations/DashLocations';

import '../../assets/styles/dashboard.scss';

class Dashboard extends Component {

    render() {
        const { match } = this.props;
        return (
            <div className="dashboard-container">

                <DashboardSidebarNav {...this.props} >
                    <DashboardNav {...this.props} />
                </DashboardSidebarNav>

                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <p>{this.props.user.first_name}</p>
                        <HamburgerIcon onClick={this.props.toggleNavSlider} />
                    </div>

                    <Route path={`${match.path}/seasons`}   component={DashSeasons} />
                    <Route path={`${match.path}/divisions`} component={DashDivisions} />
                    <Route path={`${match.path}/teams`}     component={DashTeams} />
                    <Route path={`${match.path}/players`}   component={DashPlayers} />
                    <Route path={`${match.path}/games`}     component={DashGames} />
                    <Route path={`${match.path}/news`}      component={DashNews} />
                    <Route path={`${match.path}/locations`} component={DashLocations} />
                </div>
            </div>
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
    toggleNavSlider: () => dispatch(toggleNavSlider())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);