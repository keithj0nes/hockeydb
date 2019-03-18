import React from "react";
import { connect } from "react-redux";
import { login, logout } from '../../redux/actions/auth';
// import '../../styles/login.scss';


class Login extends React.Component {

  state = {
    // email: '',
    // password: ''
    email: 'test@test.test',
    password: 'test'
  }

  componentDidMount() {
    return this.props.isUserLoggedIn && this.props.history.push('/dashboard');
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
  logout: () => dispatch(logout())
})



export default connect(mapStateToProps, mapDispatchToProps)(Login);
