import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDivisions, createDivision, updateDivision, deleteDivision } from '../../../redux/actions/divisions';
import { Button, Filter } from '../../../components';
import { toggleModal, toggleFilter} from '../../../redux/actions/misc';
import qs from 'query-string';

// import './DashDivisions.scss';
import ListItem from '../ListItem';


const defaultState = {
    isAddDivisionVisible: false,
    name: '',
    edit: {},
    currentSeasonSelected: '',
    filterData: [],
    filters: {
        // season: ''
    },

}

class DashDivisions extends Component {
    
    state = defaultState;

    // componentDidMount() {
    //     console.log(this.props, 'DID MOUNT DASH DIVVVVV')
    //     // if (this.props.divisions.length <= 0) {
    //         // this.props.getDivisions(this.props.currentSeason.id);
    //     // }
    // }


    componentDidMount() {
        //check for query params on page load
        if(this.props.location.search.length > 0){
            return this.props.getDivisions(this.props.location.search.slice(1)).then(res => {
                   return res && this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
            });
        }

        return this.props.getDivisions();
    }

    toggleSeasonVisible = () => {
        this.setState({ isAddDivisionVisible: !this.state.isAddDivisionVisible })
    }
    
    handleAddDivision = () => {

        // console.log(qs.parse(this.props.location.search), 'seasrch!')

        // let m;
        // if(Object.keys(this.props.location.search).length > 0){

        // }

        // const m = qs.parse(this.props.location.search) || this.props.currentSeason.name;

        const m = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;


        console.log(m, 'MMMM SERACH')
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
                    defaultValue: m
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Division',
            confirmAction: () => { this.validation() && this.props.createDivision({ name: this.state.name, season: m }); this.setState(defaultState) },

            // confirmAction: () => { this.validation() && this.props.createDivision({ name: this.state.name, season_id: this.state.currentSeasonSelected.id || this.props.currentSeason.id }); this.setState(defaultState) },
        }, 'prompt');
    }

    handleNameChange = e => {
        this.setState({ newDivisionName: e.target.value })
        console.log(this.state.newDivisionName);

    }


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

    // handleChangeSeasonDropdown = e => {

    //     var editStateCopy = {...this.state.currentSeasonSelected};
    //     editStateCopy = JSON.parse(e.target.value)
    //     // editStateCopy = e.target.value;

    //     // editStateCopy[e.target.name] = e.target.value;
    //     console.log(editStateCopy, 'edistatcopy 2')

    //     return this.setState({currentSeasonSelected: editStateCopy}, () =>{
    //         console.log(this.state.currentSeasonSelected, 'edit!!')
    //         // this.props.history.push({
    //         //     search: `?season=${this.state.currentSeasonSelected.id}`
    //         //   })
    //         // this.props.getDivisions(this.state.currentSeasonSelected.season);
    //         // this.props.getDivisions(this.state.currentSeasonSelected.id)
    //     })
    // }

    validation = () => {
        if (!this.state.name) return false;
        return true;
    }


    handleEditDivision = (item) => {

        console.log(item, 'edtinggggg item!');

        this.setState({ edit: item });

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
                }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Division',
            confirmAction: () => this.props.updateDivision(item.id, this.state.edit),
        }, 'prompt');
    }

    handleDeleteDivision = (item) => {

        const seasonName = Object.keys(qs.parse(this.props.location.search)).length > 0 && qs.parse(this.props.location.search).season;

        this.props.toggleModal({
            isClosableOnBackgroundClick: true,
            isVisible: true,
            title: 'Delete Division',
            message: `Are you sure you want to delete this division?\nThis cannot be undone and you will lose any information saved within this division.\n\nPlease type in the name of the division below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteDivision(item.id, seasonName),
        }, 'delete');
    }



    checkFilters = () => {
        //set filter data and toggle filter component

        const m = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;

        const filterData = [{
            title: 'Season',
            options: [{
                type: 'select',
                name: 'season',
                defaultValue: m,
                // defaultValue: JSON.stringify(this.props.currentSeason),

                // defaultValue: this.props.currentSeason,
                listOfSelects: this.props.seasons,
                hiddenValue: 'Select a season'
            }]
        },{
            title: 'Other',
            options: [{
                title: 'Hidden Divisions',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: this.state.filters.show_hidden || false,
            }]
        }]

        console.log(this.props.seasons)
        this.setState({filterData}, () => this.props.toggleFilter())
    }



    render() {
        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }

        const { divisions } = this.props;

        // console.log(divisions, 'div')
        // console.log(this.props.currentSeason, 'currenseasons')
        return (
            <div>
                <div className="dashboard-filter-header">
                    <div style={{width: '100%'}}>

                            {/* <select className="select-css" name={'season'} defaultValue={JSON.stringify(this.props.currentSeason)} onChange={this.handleChangeSeasonDropdown}>

                                    {this.props.seasons && this.props.seasons.map(item => {
                                        // console.log(item, 'item!')
                                        // return <option key={item.id} value={item}>{item.name}</option>

                                        return <option key={item.id} value={JSON.stringify(item)}>{item.name}</option>
                                    })} 
                            </select> */}


                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button title="Add Division" onClick={this.handleAddDivision} />

                            <div>
                                {/* {
                                    Object.keys(this.state.filters).length > 0 && this.state.filterRequestSent &&
                                    <span style={{fontSize: 14}}onClick={this.clearFilters}>Clear Filters</span>
                                } */}
                                <Button title="Filter" onClick={this.checkFilters} />

                            </div>
                        </div>
                        {/* <Filter data={this.state.filterData} getAction={this.props.getSeasons} history={this.props.history} filterType={'seasons'}/> */}


                        <Filter data={this.state.filterData} getAction={this.props.getDivisions} history={this.props.history} filterType={'divisions'}/>

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
                                            onClick={() => this.handleDeleteDivision(item)}
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
    // console.log(state.divisions, 'dffef')
    return {
        divisions: state.divisions.divisions,
        seasons: state.seasons.seasons,
        currentSeason: state.seasons.currentSeason
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDivisions: filters => dispatch(getDivisions(filters)),
        createDivision: (name) => dispatch(createDivision(name)),
        deleteDivision: (id, seasonName) => dispatch(deleteDivision(id, seasonName)),
        updateDivision: (id, data) => dispatch(updateDivision(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
        toggleFilter: () => dispatch(toggleFilter('divisions'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashDivisions) 