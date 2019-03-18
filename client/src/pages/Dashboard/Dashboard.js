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

                {/* {this.props.user.role === 'team_manager' 
                    ?
                        <TeamManagerDashboard />
                    : */}
                        <DashboardMain {...this.props}/>
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