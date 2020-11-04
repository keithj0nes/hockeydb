import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login, logout, loginFromCookie } from '../redux/actions/auth';

// import '../../styles/login.scss';

class Login extends React.Component {
    state = {
        email: '@hockeydb.com',
        password: '',
        //   email: 'admin@hockeydb.com',
        //   password: 'admin',
        redirectToReferrer: false,
    }

    async componentDidMount() {
        const redirectToReferrer = await this.props.loginFromCookie();
        redirectToReferrer && this.setState({ redirectToReferrer });
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const loggedIn = await this.props.login({ email: this.state.email.toLowerCase(), password: this.state.password });
        return loggedIn && this.props.history.push('/dashboard');
    };

    handleSubmit2 = async (e) => {
        const loggedIn = await this.props.login({ email: `${e.target.name}@hockeydb.com`, password: e.target.name === 'teammanager' ? 'manager' : e.target.name });
        return loggedIn && this.props.history.push('/dashboard');
    }


    render() {
        const { from } = this.props.location.state || { from: { pathname: 'dashboard' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (
            <div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <h1>Login</h1>
                        <div className="inputs">
                            <input
                                placeholder="email"
                                name="email"
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                            <input
                                placeholder="password"
                                name="password"
                                type="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                            />
                            <input className="btn" type="submit" value="login" />
                        </div>
                    </form>
                </div>

                <button type="button" name="admin" style={{ display: 'block', marginLeft: 20, marginTop: 40 }} onClick={this.handleSubmit2}>Login as <br /> ADMIN</button>
                <button type="button" name="scorekeeper" style={{ display: 'block', marginLeft: 20, marginTop: 20 }} onClick={this.handleSubmit2}>Login as <br /> SCOREKEEPER</button>
                <button type="button" name="teammanager" style={{ display: 'block', marginLeft: 20, marginTop: 20 }} onClick={this.handleSubmit2}>Login as <br /> TEAM MANAGER</button>

            </div>
        );
    }
}


const mapStateToProps = state => ({
    user: state.user && state.user.user,
    isUserLoggedIn: state.user && state.user.isUserLoggedIn,
});


const mapDispatchToProps = dispatch => ({
    login: loginData => dispatch(login(loginData)),
    logout: () => dispatch(logout()),
    loginFromCookie: () => dispatch(loginFromCookie()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

Login.propTypes = {
    loginFromCookie: PropTypes.func,
    login: PropTypes.func.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
};
