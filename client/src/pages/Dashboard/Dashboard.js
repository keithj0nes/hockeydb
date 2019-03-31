import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/auth';


import { Route } from 'react-router-dom';
// import { connect } from 'react-redux';
import { toggleNavSlider } from '../../redux/actions/misc';

import DashSeasons from './DashSeasons/DashSeasons';
import DashDivisions from './DashDivisions/DashDivisions';
import DashTeams from './DashTeams/DashTeams';
import DashPlayers from './DashPlayers/DashPlayers';
import DashGames from './DashGames/DashGames';
import DashBlogs from './DashBlogs/DashBlogs';
import DashLocations from './DashLocations/DashLocations';

import { DashboardSidebarNav, DashboardNav } from '../../components';

import '../../assets/styles/dashboard.scss';

class Dashboard extends Component {


    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { match } = this.props;

        return (
            <div className="dashboard-container">


                <DashboardSidebarNav {...this.props} >
                    <DashboardNav {...this.props} />
                </DashboardSidebarNav>

                <div className="dashboard-content">

                    <div className="dashboard-header">
                        <p>{this.props.season.name}</p>
                        <p>{this.props.user.first_name}</p>
                        <button className={"hide-desktop"} onClick={this.props.toggleNavSlider}>Toggle Side Nav</button>
                    </div>

                    <Route path={`${match.path}/seasons`} component={DashSeasons} />
                    <Route path={`${match.path}/divisions`} component={DashDivisions} />
                    <Route path={`${match.path}/teams`} component={DashTeams} />
                    <Route path={`${match.path}/players`} component={DashPlayers} />
                    <Route path={`${match.path}/games`} component={DashGames} />
                    <Route path={`${match.path}/blogs`} component={DashBlogs} />
                    <Route path={`${match.path}/locations`} component={DashLocations} />

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

const mapDispatchToProps = dispatch => ({
    // logout: () => dispatch(logout())
    toggleNavSlider: () => dispatch(toggleNavSlider())

})
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

// export default connect(null, mapDispatchToProps)(Dashboard);




// const mapDispatchToProps = dispatch => {
//     return {
//         toggleNavSlider: () => dispatch(toggleNavSlider())
//     }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardMain);

