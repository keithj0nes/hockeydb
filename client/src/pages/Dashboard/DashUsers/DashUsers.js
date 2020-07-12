import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsers } from 'redux/actions/users';
import { Button, SlideOut, Pagination, DashPageHeader, DashSelect, DashCheckbox } from '../../../components';
import DashTable from '../DashTable';

import './dashusers.scss';

const DashUsers = props => {

    const [ showPermissions, setShowPermissions ] = useState(false);
    const [ isFilterVisible, setIsFilterVisible ] = useState(false);

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

    const filterUI = () => {
        const myOptions = [
            {id: 1, name: 'haha'},
            {id: 2, name: 'hihi'},
            {id: 3, name: 'hehe'},
            {id: 4, name: 'hoho'},
            {id: 5, name: 'huhu'},
        ]

        return (
            <>
                <div className="popover-header">
                    <h2>Filter Options</h2>
                    <p>Clear X</p>
                </div>

                <div className="popover-section">
                    <h5>Role</h5>

                    <DashSelect 
                        name='optionzz' 
                        listOfSelects={[{name: 'All', value: ''}, ...myOptions]} 
                        // onChange={this.handleChange} 
                        // defaultValue={this.state.filters.division || ''} 
                        useKey="id" />
                </div>

                <div className="popover-section">
                    <h5>Status</h5>
                    <div className="popover-checkbox-container">
                        <DashCheckbox name="status" title="Active" />
                        <DashCheckbox name="status" title="Inactiveed place" />
                        <DashCheckbox name="status" title="Inactive" />
                        <DashCheckbox name="status" title="Inactivew" />

                    </div>
                </div>

                <div className="popover-section">
                    <h5>Permissions</h5>
                    <div className="popover-checkbox-container">
                        <DashCheckbox name="permissions" title="Default" />
                        <DashCheckbox name="permissions" title="Modified" />
                    </div>
                </div>
            </>
        )
    }

    const pageHeaderInfo = {
        title: 'Users',
        searchPlaceholder: 'Search by name or role',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            { 
                iconName: 'ADD_USER',
                title: 'Add User',
                onClick: () => console.log('clickedddd ADD_USER')
            },
            { 
                iconName: 'FILTER',
                title: 'Filter Users',
                // onClick: () => console.log('clickedddd FILTER'),
                onClick: (val) => setIsFilterVisible( val !== undefined ? val : !isFilterVisible),
                isPopoverVisible: isFilterVisible,
                popoverUI: filterUI()
            }
        ]
    }

    return (
        <div style={{position: 'relative'}}>

            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />


            {/* <div className="page-header">
                <div className="page-header-title-container">
                    <h1>changin</h1> 
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
            </div> */}



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