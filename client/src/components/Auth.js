import React from 'react';


const If = props => {
  // console.log(props.condition, '✅', props.children);

  return !!props.condition ? props.children : null;
};

class Auth extends React.Component {
  render() {
    console.log(this.props.roles, 'ROLE')
    return (
      <If condition={this.props.roles}>{this.props.children}</If>
    );
  }
}

export default Auth;