import React from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { login, logout } from '../redux/actions/auth';
import { loginFromCookie } from '../redux/actions/auth';

// import '../../styles/login.scss';


class Login extends React.Component {

    state = {
        email: '@hockeydb.com',
        password: '',
        //   email: 'admin@hockeydb.com',
        //   password: 'admin',

        redirectToReferrer: false
    }

    // componentDidMount() {
    //   return this.props.isUserLoggedIn && this.props.history.push('/dashboard');
    // }

    async componentDidMount() {
        const redirectToReferrer = await this.props.loginFromCookie();
        redirectToReferrer && this.setState({redirectToReferrer})
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const loggedIn = await this.props.login({email: this.state.email.toLowerCase(), password: this.state.password})
        return loggedIn && this.props.history.push('/dashboard');
    };

    handleSubmit2 = async (e) => {
        const loggedIn = await this.props.login({email: e.target.name + '@hockeydb.com', password: e.target.name === 'teammanager' ? 'manager' : e.target.name})
        return loggedIn && this.props.history.push('/dashboard');
    }


    render() {

        let { from } = this.props.location.state || { from: { pathname: "dashboard" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (
            <div>
                <div className="form">
                    <form onSubmit={this.handleSubmit}>
                        <h1>Login</h1>
                        <div className='inputs'>
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
                            <input className='btn' type="submit" value="login" />
                        </div>
                    </form>
                </div>

                <button name="admin"       style={{display: 'block', marginLeft: 20, marginTop: 40}} onClick={this.handleSubmit2}>Login as <br /> ADMIN</button>
                <button name="scorekeeper" style={{display: 'block', marginLeft: 20, marginTop: 20}} onClick={this.handleSubmit2}>Login as <br /> SCOREKEEPER</button>
                <button name="teammanager" style={{display: 'block', marginLeft: 20, marginTop: 20}} onClick={this.handleSubmit2}>Login as <br /> TEAM MANAGER</button>

            </div>
        );
    }
}


const mapStateToProps = state => ({
    user: state.user && state.user.user,
    isUserLoggedIn: state.user && state.user.isUserLoggedIn,
})

// const mapStateToProps = state => {
//   console.log(state, 'STATEEE')
//   return {}
//   // user: state && console.log(state, 'STATE!!!f')
// }


const mapDispatchToProps = dispatch => ({
    login: loginData => dispatch(login(loginData)),
    logout: () => dispatch(logout()),
    loginFromCookie: () => dispatch(loginFromCookie()),

})



export default connect(mapStateToProps, mapDispatchToProps)(Login);
