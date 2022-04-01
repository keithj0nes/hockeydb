import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUsers, createUser, resendInvite } from 'redux/actions/users';
import { toggleModal } from 'redux/actions/misc';
import { Button, SlideOut, DashPageHeader, DashFilter } from '../../../components';
import DashTable from '../DashTable';
import { useQueryParam } from '../../../components/useQueryParams';
// import { setQuery } from 'helpers';
// import { Drawer } from 'antd';
import './dashusers.scss';

const defaultState = {
    isPermissionsVisible: false,
    roles: [
        // list of roles should come from the db like in dashDivisions
        { name: 'View All', value: '' },
        { name: 'Admin', value: 'admin' },
        { name: 'Scorekeeper', value: 'scorekeeper' },
        { name: 'Team Manager', value: 'manager' },
    ],
};

const DashUsers2 = ({ users, getUsers, location, toggleModal, createUser, isLoading, resendInvite }) => {
    const [state, setState] = useState(defaultState);
    const [filters, setFilters] = useQueryParam({ getMethod: getUsers });

    const setFilterDataOpenFilter = (val) => {
        console.log('************ FILTER NOT WORKING ON BACKEND YET ************')
        const filterData = [{
            title: 'Role',
            options: [{
                type: 'select',
                name: 'role',
                defaultValue: filters.role,
                listOfSelects: state.roles,
                hiddenValue: 'Select a role',
                useKey: 'name',
            }],
        }, {
            // title: 'Active',
            // options: [{
            //     title: 'Hidden Seasons',
            //     name: 'show_hidden',
            //     type: 'checkbox',
            //     defaultValue: filters.show_hidden || false,
            // }],
            // {
            title: 'Status',
            options: [{
                title: 'Active',
                name: 'active',
                type: 'checkbox',
                defaultValue: filters.active || false,
            }, {
                title: 'Inactive',
                name: 'inactive',
                type: 'checkbox',
                defaultValue: filters.inactive || false,
            }],
            // },
        }];
        setState({ ...state, filterData });
    };

    const handleCreateUser = () => {
        toggleModal({
            isVisible: true,
            title: 'Create User',
            isClosableOnBackgroundClick: false,
            message: 'Fill out the field below. Once all fields have been filled out correctly, send the new user an invite and they’ll be able to create a profile!',
            fields: [
                {
                    title: 'First Name',
                    type: 'input',
                    name: 'first_name',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
                {
                    title: 'Last Name',
                    type: 'input',
                    name: 'last_name',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
                {
                    title: 'Email',
                    type: 'input',
                    name: 'email',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
                {
                    title: 'User Role',
                    type: 'select',
                    name: 'user_role',
                    defaultValue: null,
                    listOfSelects: [...state.roles].splice(1),
                    rules: [{ required: true }],
                },
            ],
            confirmActionTitle: 'Create Season',
            confirmAction: (values) => createUser({ userData: values }),
        }, 'prompt');
    };

    const pageHeaderInfo = {
        title: 'Users',
        searchPlaceholder: 'Search by name or role',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add User',
                onClick: handleCreateUser,
                // onClick: () => console.log('clicked add user'),
            },
            {
                iconName: 'FILTER',
                title: 'Filter Users',
                isActive: location.search.length > 0,
                onClick: (val) => setFilterDataOpenFilter(val),
                popoverUI: (closeFilter) => (
                    <DashFilter
                        data={state.filterData}
                        closeFilter={closeFilter}
                        filters={filters}
                        setFilters={setFilters}
                    />
                ),
            },
        ],
    };

    return (
        <div style={{ position: 'relative' }}>

            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            <div style={{ paddingBottom: 16 }} />

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    <DashTable
                        data={users}
                        sections={{
                            full_name: { as: 'name', flex: 'two' },
                            email: 'three',
                            admin_type: { as: 'role', flex: 'one' },
                            // is_suspendedd: { as: 'status', flex: 'one' },
                            status: 'one',
                            last_loginn: { as: 'last login', flex: 'two' },
                        }}
                        tableType="users"
                        minWidth={800}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li>View Profile</li>
                                <li>Active Status</li>
                                <li onClick={() => setState({ isPermissionsVisible: !state.isPermissionsVisible })}>Edit Permissions</li>
                                {(d.status === 'invited' || d.status === 'reinvited') && <li onClick={() => { resendInvite({ user_id: d.id }); closePopover(); }}>Resend Invite</li>}
                            </ul>
                        )}

                        // popoverData={(d, closePopover) => {
                        //     console.log(d, 'd')
                        //     return (
                        //         <ul>
                        //             <li>View Profile</li>
                        //             <li>Active Status</li>
                        //             <li onClick={() => setState({ isPermissionsVisible: !state.isPermissionsVisible })}>Edit Permissions</li>
                        //             <li>Resend Invite</li>
                        //         </ul>

                        //     );
                        // }}
                    />
                </div>
            </div>

            <SlideOut isVisible={state.isPermissionsVisible} onClose={() => setState({ isPermissionsVisible: !state.isPermissionsVisible })} slideFrom="right">
                <div className="permissions-container">
                    <h2>Permissions</h2>
                    <ul>
                        <li>create season: true</li>
                        <li>create divisions: true</li>
                        <li>create teams: true</li>
                        <li>create locations: true</li>
                        <li>create games: false</li>
                    </ul>
                    <Button title="Hide Permissions" onClick={() => setState({ isPermissionsVisible: !state.isPermissionsVisible })} />

                </div>
            </SlideOut>
            {/* <Pagination {...stuff} /> */}
        </div>
    );
};

const mapStateToProps = state => ({
    users: state.users.users,
    isLoading: state.users.isLoading,
});

const mapDispatchToProps = dispatch => ({
    getUsers: filter => dispatch(getUsers(filter)),
    createUser: data => dispatch(createUser(data)),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    resendInvite: id => dispatch(resendInvite(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashUsers2);

DashUsers2.propTypes = {
    users: PropTypes.array,
    getUsers: PropTypes.func,
    createUser: PropTypes.func,
    toggleModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    resendInvite: PropTypes.func,
    // currentSeason: PropTypes.object,
    // updateDivision: PropTypes.func,
    // deleteDivision: PropTypes.func,
};
