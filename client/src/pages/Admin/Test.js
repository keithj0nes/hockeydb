import React, { Component } from 'react'
import Auth from "../../components/auth/auth.js";

export class Test extends Component {
  render() {
    return (
      <div>
        <h1>Made it</h1>
        <Auth role='Super Administrator'>
          <h1> Super Admin</h1>
        </Auth>
        <Auth role='Administrator'>
          <h1>Admin </h1>
        </Auth>
        <Auth role='Scorekeeper'>
          <h1>ScreKepper </h1>
        </Auth>
      </div>
    )
  }
}

export default Test
