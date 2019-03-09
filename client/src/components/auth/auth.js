import React from 'react';
import jwt from 'jsonwebtoken';

import { LoginContext } from './context.js';

const If = props => {
  console.log(props.condition, '✅', props.children);

  return !!props.condition ? props.children : null;
};

class Auth extends React.Component {
  render() {
    return (
      <LoginContext.Consumer>
        {context => {
          let user = context.token ? jwt.verify(context.token, 'changeit') : {};
          let okToRender =
            context.loggedIn &&
            (this.props.capability
              ? user.capabilities.includes(this.props.capability)
              : true);
          console.log(this.props.capability, 'here');
          console.log(user.capabilities, 'lol');




          return <If condition={okToRender}>{this.props.children}</If>;
        }}
      </LoginContext.Consumer>
    );
  }
}

export default Auth;
