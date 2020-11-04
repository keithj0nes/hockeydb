/* eslint-disable no-multi-spaces */
import React from 'react';
import { connect } from 'react-redux';

const If = props => (!!props.condition ? props.children : null);

const TierAuth1 = props => <If condition={props.tiers.includes(props.tier)}>{props.children}</If>;

const Auth1 = props => <If condition={props.roles.includes(props.admin_type)}>{props.children}</If>;

const mapStateToProps = state => ({
    admin_type: state.user.user.admin_type,
    tier: state.site_level,
});

// export const TierAuth = connect(mapStateToProps)(TierAuth1);
// export const Auth = connect(mapStateToProps)(Auth1);

export default {
    Tier: connect(mapStateToProps)(TierAuth1),
    User: connect(mapStateToProps)(Auth1),
};


export const starterList = ['ROOKIE', 'AMATEUR', 'PRO'];
export const basicList =   ['AMATEUR', 'PRO'];
export const proList =     ['PRO'];

export const accessPlayer =          ['super', 'admin', 'manager', 'player'];
export const accessManager =         ['super', 'admin', 'manager'];
export const accessScorekeeper =     ['super', 'admin', 'scorekeeper'];
export const accessONLYScorekeeper = ['scorekeeper'];
export const accessAdmin =           ['super', 'admin'];
