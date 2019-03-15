import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/actions';


class Dashboard extends Component {


    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <h1>Dashboard component</h1>

                {/* {this.props.user.role === 'team_manager' 
                    ?
                        <TeamManagerDashboard />
                    : */}
                {/* <MainDashboard /> */}
                {/* } */}


                <button onClick={this.handleLogout}>Logout</button>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
})

export default connect(null, mapDispatchToProps)(Dashboard);