import React, { Component } from 'react';
import { Router, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { loginFromCookie } from '../../redux/actions/auth';
import { history } from '../../helpers';
import Home from '../Guest/Home/Home';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../../components/Login';
import Players from '../Guest/Players/Players';
import Games from '../Guest/Games/Games';
import Schedule from '../Guest/Schedule/Schedule';
import Teams from '../Guest/Teams/Teams';
import SingleTeam from '../Guest/SingleTeam/SingleTeam';
import Boxscore from '../Guest/Boxscore/Boxscore';

import { Modal, Header } from '../../components';
import { Styleguide } from '../../components/Styleguide';

import './App.scss';

class App extends Component {

    async componentDidMount() {
        await this.props.loginFromCookie();
    }

    render() {
        return (
            <Router history={history}>
                <div className="site-body">
                    <Header />
                    <div className="site-container">
                        <Route exact path="/"       component={Home} />
                        <Route path='/schedule'     component={Schedule} />
                        <Route path='/teams'        component={Teams} exact />
                        <Route path='/teams/:id'    component={SingleTeam} />
                        <Route path='/boxscore/:id' component={Boxscore} />
                        <Route path='/login'        component={Login} />
                        <Route path='/players'      component={Players} />
                        <Route path='/games'        component={Games} />
                        <Route path='/styleguide'   component={Styleguide} />
                    </div>
                    <PrivateRoute path='/dashboard' authenticated={this.props.isUserLoggedIn} component={Dashboard} />
                    <Modal />
                </div>
            </Router>
        );
    }
}


const PrivateRoute = ({ component: Component, ...rest }) => {
  
    return <Route {...rest} render={(props) =>  {
        return rest.authenticated
            ? <Component {...props} />
            : <Redirect             to={{
                pathname: "/login",
                state: { from: props.location }
            }} />
    }}/>
}

const mapStateToProps = state => ({
    isUserLoggedIn: state.user && state.user.isUserLoggedIn
})

const mapDispatchToProps = dispatch => ({
    loginFromCookie: () => dispatch(loginFromCookie()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
