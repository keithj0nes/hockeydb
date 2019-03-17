import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashTeams from '../pages/Dashboard/DashTeams/DashTeams';
import { DashboardSidebarNav } from './';

class DashboardMain extends Component {

    state = {
        isMenuVisible: false
    }

    toggleMenu = () => {
        this.setState({isMenuVisible: !this.state.isMenuVisible})
    }

    render(){
        console.log(this.state)
        return (
            <div>
                <h3>Main dashboard - hello {this.props.user.first_name}</h3>
                <p>{this.props.season.name}</p>
                <button onClick={this.toggleMenu}>Toggle Side Nav</button>
                <DashboardSidebarNav visible={this.state.isMenuVisible} toggle={this.toggleMenu}/>
                {/* <DashTeams /> */}
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

