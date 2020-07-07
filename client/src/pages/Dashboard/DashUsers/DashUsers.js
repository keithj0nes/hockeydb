import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsers } from 'redux/actions/users';
import { Button, SlideOut, ProfilePic, Pagination, Icon } from '../../../components';
import DashTable from '../DashTable';
import { ICONS } from 'assets/ICONS';

import './dashusers.scss';

const DashUsers = props => {

    const [ showPermissions, setShowPermissions ] = useState(false);

    useEffect(() => {
        props.getUsers();
    }, [])

//     totalPages: PropTypes.number.isRequired,
//     currentPage: PropTypes.number.isRequired,
//     neighbors: PropTypes.number,
//     onPageChange: PropTypes.func

const stuff = {
    totalPages: 12,
    currentPage: 1,
    neighbors: 1,
    limit: 30,
    onPageChange: () => console.log('changed!')
}

    return (
        <div style={{position: 'relative'}}>


            <div className="page-header">

                <div className="page-header-title-container">

                    <h1>Users</h1> 

                    <input type="text" className="page-header-search hide-mobile" placeholder="Search by name or role" />

                    <div className="icons-container">
                        <div className="icon-housing" title="Add User">
                            <Icon name={ICONS.ADD_USER} size={20}/>
                        </div>
                        <div className="icon-housing" title="Filter">
                            <Icon name={ICONS.FILTER} size={20} />
                        </div>
                        <div className="hide-mobile">
                            <div className="profile-housing">

                                <ProfilePic />
                            </div>
                        </div>
                    </div>
                </div>

                <input type="text" className="page-header-search hide-desktop" placeholder="Search by name or role" />
                
            </div>



            <div className="dashboard-filter-header">
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button title="Add User" onClick={() => console.log('add user clicked')} />
                        {/* <Button title="Show Permissions" onClick={() => setShowPermissions(!showPermissions)} /> */}

                    </div>
                </div>
            </div>

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    <DashTable 
                        data={props.users}
                        sections={{ 
                            'full_name':     { as: 'name',       flex: 'two' },
                            'email': 'three', 
                            'admin_type':    { as: 'role',       flex: 'one' },
                            'is_suspendedd': { as: 'status',     flex: 'one' },
                            'last_loginn':   { as: 'last login', flex: 'one' }
                        }}
                        tableType='users'
                        minWidth={800}
                        // onEdit={this.handleEditSeason}
                        // onDelete={this.handleDeleteSeason}
                        // onHide={this.handleHideSeason}
                        isLoading={props.isLoading}
                        emptyTableText={props.location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
                        popoverData={(
                            <ul>
                                <li>View Profile</li>
                                <li>Active Status</li>
                                <li onClick={() => setShowPermissions(!showPermissions)}>Edit Permissions</li>
                                <li>Resend Invite</li>
                            </ul> 
                        )}
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

            <Pagination {...stuff} />
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