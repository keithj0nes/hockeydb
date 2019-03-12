import React from "react";
import { connect } from "react-redux";
import { login, logout } from '../../redux/actions/actions';
// import '../../styles/login.scss';


const If = props => {
  return !!props.condition ? props.children : null;
};

class Login extends React.Component {


  state = {
    // email: 'seramurt@gmail.com',
    // password: 'tann09'
    email: 'test@test.test',
    password: 'test'
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state)


  };

  logout = (e, logoutMethodFromProvider) => {
    logoutMethodFromProvider();
  };

  render() {
    return (
      <div>
        <If condition={this.props.isUserLoggedIn}>
          <h1>Welcome {this.props.user.first_name}</h1>
          <button className='logout-btn' onClick={this.props.logout}>
            Log Out
          </button>
        </If>
        <If condition={!this.props.isUserLoggedIn}>
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
        </If>

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
