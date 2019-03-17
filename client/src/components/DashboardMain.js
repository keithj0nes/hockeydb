import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashTeams from '../pages/Dashboard/DashTeams/DashTeams';

class DashboardMain extends Component {

    render(){
        return (
            <div>
                <h3>Main dashboard - hello {this.props.user.first_name}</h3>
                <p>{this.props.season.name}</p>
                <DashTeams />
            </div>
        )
    }
}


const mapStateToProps = state => {
    console.log(state, 'state!')

    return {
        user: state.user.user,
        season: state.season
    }
}
export default connect(mapStateToProps)(DashboardMain);

