import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsers } from '../../../redux/actions/users';
import { Button } from '../../../components';
import DashTable from '../DashTable';

const DashUsers = props => {

    useEffect(() => {
        props.getUsers();
    }, [])
    
    return (
        <>
            <div className="dashboard-filter-header">
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button title="Add User" onClick={() => console.log('add user clicked')} />
                    </div>
                </div>
            </div>


            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    { props.users && props.users.length <= 0 ? (
                        <div>
                            {props.location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
                        </div>
                    ) : (
                        <DashTable 
                            data={props.users}
                            sections={{ 
                                'full_name': { as: 'name', flex: 'two' },
                                'email': 'three', 
                                'admin_type': { as: 'role', flex: 'one' },
                                'is_suspended': { as: 'status', flex: 'one' },
                                'last_login': {as: 'last login', flex: 'one'}
                            }}
                            tableType='users'
                            minWidth={550}
                            // onEdit={this.handleEditSeason}
                            // onDelete={this.handleDeleteSeason}
                            // onHide={this.handleHideSeason}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        users: state.users.users || []
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: filter => dispatch(getUsers(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashUsers);