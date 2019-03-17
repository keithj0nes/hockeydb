import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/auth';
import { DashboardMain } from '../../components';


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
<<<<<<< HEAD
                {/* <MainDashboard /> */}
                <DashboardMain />
=======
                        <DashboardMain />
>>>>>>> 04f1f2657192a9b90d88a6582a7981c40b6bc260
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