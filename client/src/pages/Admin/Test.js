import React, { Component } from 'react'
import Auth from "../../components/auth/auth.js";

export class Test extends Component {
  render() {
    return (
      <div>
        <h1>Made it</h1>
        <Auth capability="update">
          <h1>Admin</h1>
        </Auth>
      </div>
    )
  }
}

export default Test
