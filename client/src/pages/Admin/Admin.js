import React, { Component } from 'react'
// import { BrowserRouter } from 'react-router-dom';
import One from './Test';

// Auth
import Auth from "../../components/auth/Auth.js";
import Login from "../../components/auth/Login.js";
import LoginContext from "../../components/auth/Context.js";

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
