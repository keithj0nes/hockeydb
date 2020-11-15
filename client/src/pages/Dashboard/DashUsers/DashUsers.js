
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUsers, createUser } from 'redux/actions/users';
import { toggleModal } from 'redux/actions/misc';
import { Button, SlideOut, DashPageHeader, DashSelect, DashCheckbox, DashFilter } from '../../../components';
import DashTable from '../DashTable';
import { setQuery } from 'helpers';
import './dashusers.scss';

const defaultState = {
    first_name: '',
    last_name: '',
    email: '',
    admin_type: '',
    edit: {},
    isPermissionsVisible: false,
    isFilterVisible: false,
    filterData: [],
    filters: {}
}

// // // // // // // // // // // //
// // // // // // // // // // // //
// changed DashUsers to a Class Component due to state handling erros with props.toggleModal and the handleChange 
// function not storing e.target.value state insdie setUserData in the commented out functional component code below
// // // // // // // // // // // //
// // // // // // // // // // // //

class DashUsers extends Component {

    state = defaultState

    componentDidMount() {
        //check for query params on page load
        // if(this.props.location.search.length > 0){
        //     return this.props.getSeasons(this.props.location.search.slice(1)).then(res => {
        //            return res && this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
        //     });
        // }

        return this.props.getUsers();
    }


    handleCreateUser = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Create User',
            isClosableOnBackgroundClick: false,
            message: 'Fill out the field below. Once all fields have been filled out correctly, send the new user an invite and they’ll be able to create a profile!',
            fields: [
                {
                    title: 'First Name',
                    type: 'input',
                    name: 'first_name',
                    defaultValue: null
                },
                {
                    title: 'Last Name',
                    type: 'input',
                    name: 'last_name',
                    defaultValue: null
                },
                {
                    title: 'Email',
                    type: 'input',
                    name: 'email',
                    defaultValue: null
                },
                // {
                //     title: 'Type',
                //     type: 'select',
                //     name: 'type',
                //     defaultValue: null,
                //     listOfSelects: [...this.state.seasonTypes].splice(1)
                // },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Send Invite',
            confirmAction: () => { this.props.createUser({first_name: this.state.first_name, last_name: this.state.last_name, email: this.state.email, admin_type: this.state.admin_type})}
            // confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState) },
        }, 'prompt');
    }

    handleChange = edit => e => {
        if(!!edit){
            console.log('handle user change in edit haha')
            // const editStateCopy = {...this.state.edit};
            // editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            // return this.setState({edit: editStateCopy})
        }

        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    filterUI = () => {
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

    setFilterDataOpenFilter = (val) => {
        //set filter data and toggle filter component

        const myOptions = [
            {id: 1, name: 'haha'},
            {id: 2, name: 'hihi'},
            {id: 3, name: 'hehe'},
            {id: 4, name: 'hoho'},
            {id: 5, name: 'huhu'},
        ]


        const filterData = [{
            title: 'Role',
            options: [{
                type: 'select',
                name: 'admin_type',
                defaultValue: this.state.filters.admin_type,
                listOfSelects: [{name: 'All', value: ''}, ...myOptions],
                hiddenValue: 'Select a role',
                useKey: 'id'
            }]
        },{
            title: 'Status',
            options: [{
                title: 'Active',
                name: 'active',
                type: 'checkbox',
                defaultValue: this.state.filters.active || false
            },{
                title: 'Inactive',
                name: 'inactive',
                type: 'checkbox',
                defaultValue: this.state.filters.inactive || false
            }]
        },
        // {
        //     title: 'Permissions',
        //     options: [{
        //         title: 'Default',
        //         name: 'default',
        //         type: 'checkbox',
        //         defaultValue: this.state.filters.default || false
        //     },{
        //         title: 'Modified',
        //         name: 'modified',
        //         type: 'checkbox',
        //         defaultValue: this.state.filters.modified || false
        //     }]
        // }
        ]

        this.setState({filterData}, () => {
            this.setState({isFilterVisible: val !== undefined ? val : !this.state.isFilterVisible});
        })
    }

    handleFilterChange = (e) => {
        // clear filters and close
        if(e === null) { 
            this.props.history.push({ search: '' })
            this.props.getUsers()
            return this.setState({filters: {}, isFilterVisible: false})
        }

        const filters = {...this.state.filters};

        if(e.target.value === '' || e.target.checked === false){
            delete filters[e.target.name];
        } else {
            filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }

        
        const search = setQuery(filters);
        this.props.getUsers(search)
        this.props.history.push({ search })
        this.setState({filters})
        // this.setState({filters}, () => this.setFilterDataOpenFilter)
    }


    render() {

        const pageHeaderInfo = {
            title: 'Users',
            searchPlaceholder: 'Search by name or role',
            onChange: () => console.log('changing placeholder text'),
            buttons: [
                { 
                    iconName: 'ADD_USER',
                    title: 'Add User',
                    onClick: this.handleCreateUser
                },
                { 
                    iconName: 'FILTER',
                    title: 'Filter Users',
                    // onClick: () => console.log('clickedddd FILTER'),
                    // onClick: (val) => this.setState({isFilterVisible: val !== undefined ? val : !this.state.isFilterVisible}),
                    // isPopoverVisible: this.state.isFilterVisible,
                    // popoverUI: () => this.filterUI()

                    onClick: (val) => {
                        this.setFilterDataOpenFilter(val); 
                        // this.setState({isFilterVisible: val !== undefined ? val : !this.state.isFilterVisible});
                    },
                    isPopoverVisible: this.state.isFilterVisible,
                    popoverUI: (closeFilter) => (
                        <DashFilter 
                            data={this.state.filterData} 
                            getAction={this.props.getUsers} 
                            closeFilter={closeFilter} 
                            filterType={'users'}
                            onChange={this.handleFilterChange} />
                    )
                }
            ]
        }


        return (
            <div style={{position: 'relative'}}>

                <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

                <div style={{paddingBottom: 16}} />

                <div className="dashboard-list-container">
                    <div className="dashboard-list">

                        <DashTable 
                            data={this.props.users}
                            sections={{ 
                                'full_name':     { as: 'name',       flex: 'two' },
                                'email': 'three', 
                                'admin_type':    { as: 'role',       flex: 'one' },
                                'is_suspendedd': { as: 'status',     flex: 'one' },
                                'last_loginn':   { as: 'last login', flex: 'two' }
                            }}
                            tableType='users'
                            minWidth={800}
                            // onEdit={this.handleEditSeason}
                            // onDelete={this.handleDeleteSeason}
                            // onHide={this.handleHideSeason}
                            isLoading={this.props.isLoading}
                            emptyTableText={this.props.location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
                            popoverData={(
                                <ul>
                                    <li>View Profile</li>
                                    <li>Active Status</li>
                                    <li onClick={() => this.setState({isPermissionsVisible: !this.state.isPermissionsVisible})}>Edit Permissions</li>
                                    <li>Resend Invite</li>
                                </ul> 
                            )}
                        />
                    </div>
                </div>

                <SlideOut isVisible={this.state.isPermissionsVisible} onClose={() => this.setState({isPermissionsVisible: !this.state.isPermissionsVisible})} slideFrom="right">
                    <div className="permissions-container">
                        <h2>Permissions</h2>
                        <ul>
                            <li>create season: true</li>
                            <li>create divisions: true</li>
                            <li>create teams: true</li>
                            <li>create locations: true</li>
                            <li>create games: false</li>
                        </ul>
                        <Button title="Hide Permissions" onClick={() => this.setState({isPermissionsVisible: !this.state.isPermissionsVisible})} />

                    </div>
                </SlideOut>

                {/* <Pagination {...stuff} /> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state, 'STATE')
    return {
        users: state.users.users,
        isLoading: state.users.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: filter => dispatch(getUsers(filter)),
        createUser: data => dispatch(createUser(data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashUsers);




// import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { getUsers, createUser } from 'redux/actions/users';
// import { toggleModal } from 'redux/actions/misc';
// import { Button, SlideOut, DashPageHeader, DashSelect, DashCheckbox } from '../../../components';
// import DashTable from '../DashTable';

// import './dashusers.scss';

// const defaultUser = {
//     first_name: '',
//     last_name: '',
//     email: '',
//     admin_type: ''
// }

// const DashUsers = props => {

//     const [ showPermissions, setShowPermissions ] = useState(false);
//     const [ isFilterVisible, setIsFilterVisible ] = useState(false);
//     const [ userData, setUserData ] = useState(defaultUser);

//     useEffect(() => {
//         props.getUsers();
//     }, [])


//     useEffect(() => {
//         console.log(userData, 'user datasaaaaaa')
//     }, [userData])

// //     totalPages: PropTypes.number.isRequired,
// //     currentPage: PropTypes.number.isRequired,
// //     neighbors: PropTypes.number,
// //     onPageChange: PropTypes.func

//     // const stuff = {
//     //     totalPages: 12,
//     //     currentPage: 1,
//     //     neighbors: 1,
//     //     limit: 30,
//     //     onPageChange: () => console.log('changed!')
//     // }

//     const handleCreateUser = () => {
//         props.toggleModal({
//             isVisible: true,
//             title: 'Create User',
//             isClosableOnBackgroundClick: false,
//             message: 'Fill out the field below. Once all fields have been filled out correctly, send the new user an invite and they’ll be able to create a profile!',
//             fields: [
//                 {
//                     title: 'First Name',
//                     type: 'input',
//                     name: 'first_name',
//                     defaultValue: userData.first_name
//                 },
//                 {
//                     title: 'Last Name',
//                     type: 'input',
//                     name: 'last_name',
//                     defaultValue: userData.last_name
//                 },
//                 {
//                     title: 'Email',
//                     type: 'input',
//                     name: 'email',
//                     defaultValue: null
//                 },
//                 // {
//                 //     title: 'Type',
//                 //     type: 'select',
//                 //     name: 'type',
//                 //     defaultValue: null,
//                 //     listOfSelects: [...this.state.seasonTypes].splice(1)
//                 // },
//             ],
//             // onChange: handleChange(),
//             onChange: e => setUserData({...userData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}),
//             confirmActionTitle: 'Send Invite',
//             confirmAction: () => { props.createUser(userData)}
//             // confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState) },
//         }, 'prompt');
//     }

//     const handleChange = edit => e => {
//         if(!!edit){
//             console.log('handle user change in edit haha')
//             // const editStateCopy = {...this.state.edit};
//             // editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//             // return this.setState({edit: editStateCopy})
//         }
//         // console.log({...userData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value},' userdata')
//         // setUserData({...userData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
//         // setUserData('hi')

//         // this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
//     }


//     const filterUI = () => {
//         const myOptions = [
//             {id: 1, name: 'haha'},
//             {id: 2, name: 'hihi'},
//             {id: 3, name: 'hehe'},
//             {id: 4, name: 'hoho'},
//             {id: 5, name: 'huhu'},
//         ]

//         return (
//             <>
//                 <div className="popover-header">
//                     <h2>Filter Options</h2>
//                     <p>Clear X</p>
//                 </div>

//                 <div className="popover-section">
//                     <h5>Role</h5>

//                     <DashSelect 
//                         name='optionzz' 
//                         listOfSelects={[{name: 'All', value: ''}, ...myOptions]} 
//                         // onChange={this.handleChange} 
//                         // defaultValue={this.state.filters.division || ''} 
//                         useKey="id" />
//                 </div>

//                 <div className="popover-section">
//                     <h5>Status</h5>
//                     <div className="popover-checkbox-container">
//                         <DashCheckbox name="status" title="Active" />
//                         <DashCheckbox name="status" title="Inactiveed place" />
//                         <DashCheckbox name="status" title="Inactive" />
//                         <DashCheckbox name="status" title="Inactivew" />

//                     </div>
//                 </div>

//                 <div className="popover-section">
//                     <h5>Permissions</h5>
//                     <div className="popover-checkbox-container">
//                         <DashCheckbox name="permissions" title="Default" />
//                         <DashCheckbox name="permissions" title="Modified" />
//                     </div>
//                 </div>
//             </>
//         )
//     }

//     const pageHeaderInfo = {
//         title: 'Users',
//         searchPlaceholder: 'Search by name or role',
//         onChange: () => console.log('changing placeholder text'),
//         buttons: [
//             { 
//                 iconName: 'ADD_USER',
//                 title: 'Add User',
//                 onClick: handleCreateUser
//             },
//             { 
//                 iconName: 'FILTER',
//                 title: 'Filter Users',
//                 // onClick: () => console.log('clickedddd FILTER'),
//                 onClick: (val) => setIsFilterVisible( val !== undefined ? val : !isFilterVisible),
//                 isPopoverVisible: isFilterVisible,
//                 popoverUI: () => filterUI()
//             }
//         ]
//     }

//     return (
//         <div style={{position: 'relative'}}>

//             <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

//             <div style={{paddingBottom: 16}} />

//             {/* <div className="page-header">
//                 <div className="page-header-title-container">
//                     <h1>changin</h1> 
//                     <input type="text" className="page-header-search hide-mobile" placeholder="Search by name or role" />
//                     <div className="icons-container">
//                         <div className="icon-housing" title="Add User">
//                             <Icon name={ICONS.ADD_USER} size={20}/>

//                         </div>
//                         <div className="icon-housing" title="Filter">
//                             <Icon name={ICONS.FILTER} size={20} />

//                         </div>
//                         <div className="hide-mobile">
//                             <div className="profile-housing">
//                                 <ProfilePic />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <input type="text" className="page-header-search hide-desktop" placeholder="Search by name or role" />
//             </div> */}



//             {/* <div className="dashboard-filter-header">
//                 <div style={{width: '100%'}}>
//                     <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                         <Button title="Add User" onClick={() => console.log('add user clicked')} />
//                     </div>
//                 </div>
//             </div> */}



//             <div className="dashboard-list-container">
//                 <div className="dashboard-list">

//                     <DashTable 
//                         data={props.users}
//                         sections={{ 
//                             'full_name':     { as: 'name',       flex: 'two' },
//                             'email': 'three', 
//                             'admin_type':    { as: 'role',       flex: 'one' },
//                             'is_suspendedd': { as: 'status',     flex: 'one' },
//                             'last_loginn':   { as: 'last login', flex: 'two' }
//                         }}
//                         tableType='users'
//                         minWidth={800}
//                         // onEdit={this.handleEditSeason}
//                         // onDelete={this.handleDeleteSeason}
//                         // onHide={this.handleHideSeason}
//                         isLoading={props.isLoading}
//                         emptyTableText={props.location.search.length > 0 ? 'Sorry, there are no users within your filter criteria' : 'Sorry, no users have been created. Start by adding a user above.'}
//                         popoverData={(
//                             <ul>
//                                 <li>View Profile</li>
//                                 <li>Active Status</li>
//                                 <li onClick={() => setShowPermissions(!showPermissions)}>Edit Permissions</li>
//                                 <li>Resend Invite</li>
//                             </ul> 
//                         )}
//                     />
//                 </div>
//             </div>

//             <SlideOut isVisible={showPermissions} onClose={() => setShowPermissions(!showPermissions)} slideFrom="right">
//                 <div className="permissions-container">
//                     <h2>Permissions</h2>
//                     <ul>
//                         <li>create season: true</li>
//                         <li>create divisions: true</li>
//                         <li>create teams: true</li>
//                         <li>create locations: true</li>
//                         <li>create games: false</li>
//                     </ul>
//                     <Button title="Hide Permissions" onClick={() => setShowPermissions(!showPermissions)} />

//                 </div>
//             </SlideOut>

//             {/* <Pagination {...stuff} /> */}
//         </div>
//     )
// }

// const mapStateToProps = state => {
//     return {
//         users: state.users.users,
//         isLoading: state.users.isLoading
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         getUsers: filter => dispatch(getUsers(filter)),
//         createUser: data => dispatch(createUser(data)),
//         toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(DashUsers);



