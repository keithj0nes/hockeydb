import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleNavSlider } from '../redux/actions/misc';

import DashSeasons from '../pages/Dashboard/DashSeasons/DashSeasons';
import DashDivisions from '../pages/Dashboard/DashDivisions/DashDivisions';
import DashTeams from '../pages/Dashboard/DashTeams/DashTeams';
import DashPlayers from '../pages/Dashboard/DashPlayers/DashPlayers';
import DashGames from '../pages/Dashboard/DashGames/DashGames';

import { DashboardSidebarNav } from './';

import '../style/dashboard.scss';

class DashboardMain extends Component {

    render(){
        const { match } = this.props;
        return (
            <div className="dashboard-container">
                <DashboardSidebarNav {...this.props} />

                <div className="dashboard-content">
                
                    <h3>Main dashboard - hello {this.props.user.first_name}</h3>
                    <p>{this.props.season.name}</p>
                    <button className={"hide-desktop"} onClick={this.props.toggleNavSlider}>Toggle Side Nav</button>

                    <Route path={`${match.path}/seasons`}   component={DashSeasons} />                    
                    <Route path={`${match.path}/divisions`} component={DashDivisions} />
                    <Route path={`${match.path}/teams`}     component={DashTeams} />                    
                    <Route path={`${match.path}/players`}   component={DashPlayers} />                    
                    <Route path={`${match.path}/games`}     component={DashGames} />

                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    // console.log(state, 'state in dashboardMain component')

    return {
        user: state.user.user,
        season: state.season
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleNavSlider: () => dispatch(toggleNavSlider())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardMain);

