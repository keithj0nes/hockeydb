import React from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { login, logout } from '../redux/actions/auth';
import { loginFromCookie } from '../redux/actions/auth';

// import '../../styles/login.scss';


class Login extends React.Component {

  state = {
    // email: '',
    // password: ''
    email: 'admin@hockeydb.com',
    password: 'admin',

    redirectToReferrer: false
  }

  // componentDidMount() {
  //   return this.props.isUserLoggedIn && this.props.history.push('/dashboard');
  // }

  async componentDidMount() {
    const redirectToReferrer = await this.props.loginFromCookie();
    // if(redirectToReferrer)
    // console.log(redirectToReferrer)
    redirectToReferrer && this.setState({redirectToReferrer})
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const loggedIn = await this.props.login(this.state)
    return loggedIn && this.props.history.push('/dashboard');
  };

  handleLogout = () => {
    this.props.logout();
    this.props.history.push('/');
  }



  render() {

    // console.log('YOOOOOOOOO!!!!!!')

    // console.log(this.props)

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
