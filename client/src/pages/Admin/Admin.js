import React, { Component } from 'react'
import One from './Test';

// Auth
import Auth from "../../components/auth/Auth.js";
import Login from "../../components/auth/Login.js";

export class Admin extends Component {
  render() {
    console.log(this.props, 'pr')
    return (
      <div>
        <Login {...this.props}/>
        <hr />
        <Auth>
          <One />
        </Auth>
      </div>
    )
  }
}


export default Admin
