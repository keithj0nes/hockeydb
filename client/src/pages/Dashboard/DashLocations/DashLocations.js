import React, { Component } from 'react'
import { connect } from 'react-redux';

import { createLocation, getLocations, deleteLocation, updateLocation } from '../../../redux/actions/locationsActions';
import { Button } from '../../../components';
import ListItem from '../ListItem';
import DashTable from '../DashTable';
import { toggleModal } from '../../../redux/actions/misc';

const defaultState = {
    isAddLocationVisible: false,
    name: '',
    address: '',
    is_active: false,
    edit: {}
}

export class DashGames extends Component {

    state = defaultState
    componentDidMount() {
        this.props.getLocations();
    }

    // handleChange = e => {
    //     this.setState({ [e.target.name]: e.target.value })
    // }

    handleChange = edit => e => {
        if(!!edit){
            const editStateCopy = {...this.state.edit};
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState({edit: editStateCopy})
        }
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }
    // validation = () => {
    //     if (!this.state.name || !this.state.address) return false;

    //     return true;
    // }

    validation = (edit) => {
        if(!!edit){
            return !this.state.edit.name || !this.state.edit.address ? false : true;
        }
        if (!this.state.name || !this.state.address) return false;
        return true;
    }

    handleAddLocation = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Location',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null
                },
                {
                    title: 'Address',
                    type: 'input',
                    name: 'address',
                    defaultValue: null,
                }
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Location',
            // confirmAction: () => console.log(this.state, 'this.state'),
            confirmAction: () => { this.validation() && this.props.createLocation({ name: this.state.name, address: this.state.address }); this.setState(defaultState) },
        }, 'prompt');
    }


    handleEditLocation = (item) => {
        this.setState({ edit: item })
        console.log(item, 'itemss')
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Location',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                {
                    title: 'Address',
                    type: 'input',
                    name: 'address',
                    defaultValue: item.address,
                    // listOfSelects: [...this.state.seasonTypes].slice(1)
                }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Location',
            confirmAction: () => this.validation('edit') && this.props.updateLocation(item.id, this.state.edit),
        }, 'prompt');
    }


    handleLocationsSubmit = async e => {
        e.preventDefault();
        const { name, address } = this.state;
        if (!name || !address) {
            return alert('please enter a input');
        }
        const added = await this.props.newLocation({ name, address });

        if (!added) {
            return alert('location not added')
        }
        return this.setState({ isAddLocationVisible: false, name: '', address: '' })
    }

    toggleAddVisible = () => {
        this.setState({ isAddLocationVisible: !this.state.isAddLocationVisible })
    }


    handleDeleteLocation = (item) => {
        this.props.toggleModal({
            isClosableOnBackgroundClick: true,
            isVisible: true,
            toBeDeleted: item,
            title: 'Delete Location',
            message: `Are you sure you want to delete this location?\nThis cannot be undone - current games with this location will not be effected.\n\nPlease type in the name of the location below to delete.`,
            deleteAction: () => this.props.deleteLocation(item.id),
        }, 'delete');
    }

    render() {
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        const { locations } = this.props;
        return (
            <div>
                <div className="dashboard-filter-header">
                    <div>
                        <Button title="Add Location" onClick={this.handleAddLocation} />
                    </div>
                </div>

                {this.state.isAddLocationVisible && (

                    <form onSubmit={this.handleLocationsSubmit} className="dashboard-add-container">
                        <input type="text" onChange={this.handleChange} name="name" placeholder="Location name" />
                        <input type="text" onChange={this.handleChange} name="address" placeholder="Location address" />

                        <div className="dashboard-add-button-container">
                            <Button title="Save Location" success onClick={() => { }} />
                        </div>

                    </form>

                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        { locations && locations.length <= 0 ? (
                            <div>
                                {this.props.location.search.length > 0 ? 'Sorry, there are no locations within your filter criteria' : 'Sorry, no locations have been created. Start by adding a location above.'}
                            </div>
                        ) : (

                            <DashTable 
                                data={locations}
                                sections={{ 'name': 'two', 'address': 'three' }}
                                minWidth={660}
                                onEdit={this.handleEditLocation}
                                onDelete={this.handleDeleteLocation}                                            
                            />

                            // <>

                            //     <div className="dashboard-list-item hide-mobile">
                            //         <div style={{ display: 'flex' }}>

                            //             <p className="flex-three">Name</p>
                            //             <p className="flex-three">Address</p>
                            //             <p className="flex-one">Manage</p>

                            //         </div>
                            //     </div>

                            //     {locations.map(item => {

                            //         // console.log(item, 'befroe')
                            //         // item.date = dateFormat(item.start_date, 'MM/DD/YYYY');
                            //         // item.start_time = dateFormat(item.start_date, 'h:mm A')
                            //         // console.log(item, 'after')

                            //         return (
                            //             <ListItem 
                            //                 key={item.id} 
                            //                 item={item} 
                            //                 sections={{ 'name': 'three', 'address': 'three' }} 
                            //                 onClick={() => this.handleDeleteLocation(item)}                                            
                            //                 onEdit={() => this.handleEditSeason(item)}
                            //                 // onHide={() => this.handleHideSeason(item)} 
                            //             />
                            //         )
                            //     })}
                            // </>
                        )}
                    </div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        locations: state.locations.locations,
    };
};



const mapDispatchToProps = dispatch => ({
    createLocation: (name, address) => dispatch(createLocation(name, address)),
    getLocations: () => dispatch(getLocations()),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    deleteLocation: id => dispatch(deleteLocation(id)),
    updateLocation: (id, data) => dispatch(updateLocation(id, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashGames);



