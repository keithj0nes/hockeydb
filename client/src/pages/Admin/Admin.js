import React, { Component } from 'react'
import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
import One from './Test';

// Auth
import Auth from "../../components/auth/auth.js";
import Login from "../../components/auth/Login.js";
import LoginContext from "../../components/auth/context.js";

export class Admin extends Component {
  render() {
    return (
      <div>
        {/* <BrowserRouter> */}
        <LoginContext>
          <Login />
          <hr />
          <Auth>
            <One />
          </Auth>
        </LoginContext>
        {/* </BrowserRouter> */}
      </div>
    )
  }
}

export default Admin
