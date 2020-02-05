import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDivisions, createDivision, updateDivision, deleteDivision } from '../../../redux/actions/divisions';
import { Button } from '../../../components';
// import './DashDivisions.scss';
import ListItem from '../ListItem';

import { toggleModal } from '../../../redux/actions/misc';


const defaultState = {
    isAddDivisionVisible: false,
    name: '',
    edit: {},
    currentSeasonSelected: ''
}

class DashDivisions extends Component {
    
    state = defaultState;

    componentDidMount() {
        console.log(this.props, 'DID MOUNT DASH DIVVVVV')
        // if (this.props.divisions.length <= 0) {
            this.props.getDivisions(this.props.currentSeason.id);
        // }
    }

    toggleSeasonVisible = () => {
        this.setState({ isAddDivisionVisible: !this.state.isAddDivisionVisible })
    }
    
    handleAddDivision = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Divison',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null
                },
                {
                    title: 'Season',
                    type: 'input',
                    name: 'season',
                    disabled: true,
                    defaultValue: this.state.currentSeasonSelected.name || this.props.currentSeason.name
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Division',
            confirmAction: () => { this.validation() && this.props.createDivision({ name: this.state.name, season_id: this.state.currentSeasonSelected.id || this.props.currentSeason.id }); this.setState(defaultState) },
        }, 'prompt');
    }

    handleNameChange = e => {
        this.setState({ newDivisionName: e.target.value })
        console.log(this.state.newDivisionName);

    }

    // sendNewDivision = () => {
    //     const { newDivisionName } = this.state;
    //     this.state.newDivisionName.length > 1 && (this.props.newDivision({ newDivisionName }));
    //     this.toggleSeasonVisible();
    // }




    handleChange = edit => e => {
        console.log(edit, 'edit!')
        if(!!edit){
            var editStateCopy = {...this.state.edit};

                // console.log(e.target.name, JSON.stringify(e.target.value), 'ha')
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

                // console.log(editStateCopy, 'edistatcopy 2')

            return this.setState({edit: editStateCopy}, () =>{
                console.log(this.state.edit, 'edit!!')
            })
        }
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    handleChangeSeasonDropdown = e => {

        var editStateCopy = {...this.state.currentSeasonSelected};
        editStateCopy = JSON.parse(e.target.value)
        // editStateCopy = e.target.value;

        // editStateCopy[e.target.name] = e.target.value;
        console.log(editStateCopy, 'edistatcopy 2')

        return this.setState({currentSeasonSelected: editStateCopy}, () =>{
            console.log(this.state.currentSeasonSelected, 'edit!!')
            // this.props.history.push({
            //     search: `?season=${this.state.currentSeasonSelected.id}`
            //   })
            // this.props.getDivisions(this.state.currentSeasonSelected.season);
            this.props.getDivisions(this.state.currentSeasonSelected.id)
        })
    }

    validation = () => {
        if (!this.state.name) return false;
        return true;
    }


    handleEditDivision = (item) => {

        console.log(item, 'edtinggggg item!');

        this.setState({ edit: item }, () => {
            console.log(this.state.edit, 'edit!')
        })

        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Division',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                // {
                //     title: 'Type',
                //     type: 'select',
                //     name: 'type',
                //     defaultValue: item.type,
                //     listOfSelects: this.state.seasonTypes
                // },
                // {
                //     title: item.is_active ? 'Active Season' : 'Set To Active Season',
                //     type: 'checkbox',
                //     name: 'is_active',
                //     hidden: item.is_active,
                //     defaultValue: item.is_active
                // }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Division',
            confirmAction: () => this.props.updateDivision(item.id, this.state.edit),
        }, 'prompt');
    }

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Division',
            message: `Are you sure you want to delete this division?\nThis cannot be undone and you will lose any information saved within this division.\n\nPlease type in the name of the division below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteDivision(item.id),
        }, 'delete');
    }



    render() {
        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }

        const { divisions } = this.props;

console.log(divisions, 'div')
        // console.log(this.props.currentSeason, 'currenseasons')
        return (
            <div>

                <div className="dashboard-filter-header">
                    <div>
                        <Button title="Add Division" onClick={this.handleAddDivision} />

                        {/* <select name="n" id="">
                            <option value="hi">hi</option>
                            <option value="his">his</option>
                        </select> */}

                        {/* <div className="modal-field"> */}
                            {/* <label htmlFor={field.name}>{field.title}</label> */}
                            {/* <select className="select-css" name={'season'} defaultValue={field.defaultValue} onChange={data.onChange}> */}
                            <select className="select-css" name={'season'} defaultValue={JSON.stringify(this.props.currentSeason)} onChange={this.handleChangeSeasonDropdown}>

                                    {this.props.seasons && this.props.seasons.map(item => {
                                        // console.log(item, 'item!')
                                        // return <option key={item.id} value={item}>{item.name}</option>

                                        return <option key={item.id} value={JSON.stringify(item)}>{item.name}</option>
                                    })} 
                            </select>

                        {/* </div> */}
                    </div>

                </div>

                {this.state.isAddDivisionVisible && (

                    <div className="dashboard-add-container">
                        <input type="text" placeholder="Enter division name" onChange={this.handleNameChange} />
                        <div className="dashboard-add-button-container">
                            <Button title="Save Division" success onClick={this.sendNewDivision} />
                        </div>
                    </div>
                )}


                <div className="dashboard-list-container">

                    <div className="dashboard-list">

                        {divisions && divisions.length <= 0 ? (
                            <div>
                                Sorry, no divisions for this season. Start by adding a division above.
                            </div>
                        ) : (

                            <>
                                <div className="dashboard-list-item hide-mobile">
                                    <div style={{ display: 'flex' }}>
                                        <p className="flex-three">Name</p>
                                        <p className="flex-one">Manage</p>
                                    </div>
                                </div>

                                {divisions.map(item => {
                                    return (
                                        <ListItem 
                                            key={item.id} 
                                            item={item} 
                                            sections={{'name': 'three'}} 
                                            onClick={() => this.handleDeleteSeason(item)}
                                            onEdit={() => this.handleEditDivision(item)}
                                        />
                                    )

                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state.divisions, 'dffef')
    return {
        divisions: state.divisions.divisions,
        seasons: state.seasons.seasons,
        currentSeason: state.seasons.currentSeason
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDivisions: (season_id) => dispatch(getDivisions(season_id)),
        createDivision: (name) => dispatch(createDivision(name)),
        deleteDivision: id => dispatch(deleteDivision(id)),
        updateDivision: (id, data) => dispatch(updateDivision(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashDivisions) 