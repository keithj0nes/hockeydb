import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HeadManager from 'components/HeadManager';
import { loginFromCookie } from '../../redux/actions/auth';
import { history } from '../../helpers';
import Home from '../Guest/Home/Home';
import Dashboard from '../Dashboard/Dashboard';
import Dashboard2 from '../Dashboard/Dashboard2';
import Players from '../Guest/Players/Players';
import Games from '../Guest/Games/Games';
import Schedule from '../Guest/Schedule/Schedule';
import Teams from '../Guest/Teams/Teams';
import SingleTeam from '../Guest/SingleTeam/SingleTeam';
import Boxscore from '../Guest/Boxscore/Boxscore';
import Standings from '../Guest/Standings/Standings';
import Inquiry from '../Guest/Inquiry/Inquiry';
import Registration from '../Guest/Registration/Registration';
import { Modal, Header, Login, Invite, ResetPassword } from '../../components';
import PlayerStats from '../Guest/PlayerStats/PlayerStats';
import Register from '../Dashboard/Register';

import 'antd/dist/antd.css';
import '../../assets/styles/ant-overrides.scss';
import '../../assets/styles/layout.scss';
import '../../assets/styles/_spacing.scss';
import '../../assets/styles/_form.scss';
import '../../assets/styles/drawer.scss';

import './App.scss';


const App = ({ isUserLoggedIn, loginFromCookie }) => {
    useEffect(() => {
        async function _loginFromCookie() {
            await loginFromCookie();
        }
        _loginFromCookie();
    }, [loginFromCookie]);

    return (
        <Router history={history}>
            <HeadManager />
            <div className="site-body">
                <Header />
                <div className="site-container">
                    <Route exact path="/" component={Home} />
                    <Route path="/schedule" component={Schedule} />
                    <Route path="/standings" component={Standings} />
                    <Route path="/teams" component={Teams} exact />
                    <Route path="/teams/:id" component={SingleTeam} />
                    <Route path="/boxscore/:id" component={Boxscore} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                    <Route path="/invite" component={Invite} />
                    <Route path="/players" component={Players} />
                    <Route path="/games" component={Games} />
                    <Route path="/inquiry" component={Inquiry} />
                    {/* <Route path="/registration" component={Registration} /> */}
                    <PrivateRoute path="/registration" authenticated={isUserLoggedIn} component={Registration} />
                    <Route path="/stats" component={PlayerStats} />
                </div>
                <PrivateRoute path="/dashboard/old" authenticated={isUserLoggedIn} component={Dashboard} />
                <PrivateRoute path="/dashboard" authenticated={isUserLoggedIn} component={Dashboard2} />
                <PrivateRoute path="/register" authenticated={isUserLoggedIn} component={Register} />
                <Modal />
            </div>
        </Router>
    );
};


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (rest.authenticated
            ? <Component {...props} />
            : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location },
                }}
                />
            ))}
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object,
};


const mapStateToProps = state => ({
    isUserLoggedIn: state.user && state.user.isUserLoggedIn,
});

const mapDispatchToProps = dispatch => ({
    loginFromCookie: () => dispatch(loginFromCookie()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);


App.propTypes = {
    isUserLoggedIn: PropTypes.bool,
    loginFromCookie: PropTypes.func,
};
