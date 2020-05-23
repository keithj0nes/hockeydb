import React from 'react';
import { connect } from 'react-redux';

const If = props => {
    return !!props.condition ? props.children : null;
};

const TierAuth1 = props => {
    return <If condition={props.tiers.includes(props.tier)}>{props.children}</If>
}

const Auth1 = props => {
    return <If condition={props.roles.includes(props.admin_type)}>{props.children}</If>
}

const mapStateToProps = state => {
    // console.log(state, 'STATEE')
    return {
        admin_type: state.user.user.admin_type,
        tier: state.site_level
    }
}


// export const TierAuth = connect(mapStateToProps)(TierAuth1);
// export const Auth = connect(mapStateToProps)(Auth1);

export default {
    Tier: connect(mapStateToProps)(TierAuth1),
    User: connect(mapStateToProps)(Auth1)
}


export const starterList = ['STARTER', 'BASIC', 'PRO'];
export const basicList =   ['BASIC', 'PRO'];
export const proList =     ['PRO'];


export const accessPlayer =          ['super', 'admin', 'manager', 'player'];
export const accessManager =         ['super', 'admin', 'manager'];
export const accessScorekeeper =     ['super', 'admin', 'scorekeeper'];
export const accessONLYScorekeeper = ['scorekeeper'];
export const accessAdmin =           ['super', 'admin'];


// class Auth extends React.Component {
//     render() {
//         console.log(this.props.roles, 'ROLE')
//         return (
//             <If condition={this.props.roles.includes('admin')}>{this.props.children}</If>
//         );
//     }
// }

// const Auth = props => {
//     console.log(props.admin_type, 'admin_type')
//     return <If condition={props.roles.includes(props.admin_type)}>{props.children}</If>
// }

// const mapStateToProps = state => {
//     console.log(state, 'STATEE')
//     return {
//         admin_type: state.user.user.admin_type
//     }
// }

// export default connect(mapStateToProps)(Auth);




// const TierAuth = props => {
//     return <If condition={props.tiers.includes(props.tier)}>{props.children}</If>
// }


// const mapStateToProps2 = state => {
//     // console.log(state, 'STATEE')
//     return {
//         tier: state.site_level
//     }
// }

// export connect(mapStateToProps2)(TierAuth);