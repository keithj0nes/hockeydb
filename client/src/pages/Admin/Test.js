import React, { Component } from 'react'
import Auth from "../../components/Auth.js";

export class Test extends Component {
  render() {
    return (
      <div>
        <h1>Made it</h1>
        <Auth roles={['super']}>
          <h1> Super Admin</h1>
        </Auth>
        <Auth roles={['super', 'admin']}>
          <h1>Admin </h1>
        </Auth>
        <Auth roles={['super', 'admin', 'scorekeeper']}>
          <h1>ScreKepper </h1>
        </Auth>
      </div>
    )
  }
}

export default Test
