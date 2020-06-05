import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsers } from '../../../redux/actions/users';
import { Button } from '../../../components';
import SlideOut from '../../../components/SlideOut';
import DashTable from '../DashTable';

import './dashusers.scss';

const DashUsers = props => {

    const [ showPermissions, setShowPermissions ] = useState(false);

    useEffect(() => {
        props.getUsers();
    }, [])

    return (
        <div style={{position: 'relative'}}>
            <div className="dashboard-filter-header">
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button title="Add User" onClick={() => console.log('add user clicked')} />
                        <Button title="Show Permissions" onClick={() => setShowPermissions(!showPermissions)} />

                    </div>
                </div>
            </div>

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    <DashTable 
                        data={props.users}
                        sections={{ 
                            'full_name':     { as: 'name', flex: 'two' },
                            'email': 'three', 
                            'admin_type':    { as: 'role', flex: 'one' },
                            'is_suspendedd': { as: 'status', flex: 'one' },
                            'last_loginn':   { as: 'last login', flex: 'one' }
                        }}
                        tableType='users'
                        minWidth={800}
                        isLoading={props.isLoading}
                        // onEdit={this.handleEditSeason}
                        // onDelete={this.handleDeleteSeason}
                        // onHide={this.handleHideSeason}
                        emptyTableText={props.location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
                    />
                </div>
            </div>

            <SlideOut isVisible={showPermissions} onClose={() => setShowPermissions(!showPermissions)} slideFrom="right">
                <div className="permissions-container">
                    <h2>Permissions</h2>
                    <ul>
                        <li>create season: true</li>
                        <li>create divisions: true</li>
                        <li>create teams: true</li>
                        <li>create locations: true</li>
                        <li>create games: false</li>
                    </ul>
                    <Button title="Hide Permissions" onClick={() => setShowPermissions(!showPermissions)} />

                </div>
            </SlideOut>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        users: state.users.users,
        isLoading: state.users.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: filter => dispatch(getUsers(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashUsers);