import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import { getDivisions, createDivision, updateDivision, deleteDivision } from 'redux/actions/divisions';
import { toggleModal, toggleFilter} from 'redux/actions/misc';
import { Button, Filter, DashPageHeader } from '../../../components';
import DashTable from '../DashTable';
// import './DashDivisions.scss';


const defaultState = {
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
    
    handleAddDivision = () => {

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

    handleHideDivision = (item) => {
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_date ? 'Unh': 'H'}ide Division`,
            message: item.hidden_date ? 
            `Are you sure you want to unhide this division? This will cause the selected division to be visible on the public page` 
            : 
            `Are you sure you want to hide this division?\nThis will hide the division from both the admin dashboard and from the public page. You can view all hidden divisions using the filter. This does NOT delete the division`,
            fields: [],
            confirmActionTitle: `${item.hidden_date ? 'Unh': 'H'}ide Division`,
            confirmAction: () => {
                return this.props.updateDivision(item.id, {is_hidden: !!item.hidden_date ? false : true}).then((d) => {
                    d === 'getDivisions' && this.props.getDivisions(this.props.location.search.slice(1))
                })
            },
            // confirmAction: () => console.log('confirm clicked')
        }, 'prompt');
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
        const { divisions, isLoading } = this.props;
        const pageHeaderInfo = {
            title: 'Divisions',
            searchPlaceholder: 'Search by division name',
            onChange: () => console.log('changing placeholder text'),
            buttons: [
                { 
                    iconName: 'ADD_USER',
                    title: 'Add Division',
                    onClick: () => console.log('clickedddd ADD_USER')
                },
                { 
                    iconName: 'FILTER',
                    title: 'Filter Divisions',
                    onClick: () => console.log('clickedddd FILTER')
                }
            ]
        }

        return (
            <div>
                <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

                <div className="dashboard-filter-header">
                    <div style={{width: '100%'}}>

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

                <div className="dashboard-list-container">
                    <div className="dashboard-list">

                        <DashTable 
                            data={divisions}
                            sections={{ 'name': 'three' }}
                            minWidth={350}
                            onEdit={this.handleEditDivision}
                            onDelete={this.handleDeleteDivision}
                            onHide={this.handleHideDivision}
                            isLoading={isLoading}
                            emptyTableText={this.props.location.search.length > 0 ? 'Sorry, there are no divisions within your filter criteria' : 'Sorry, no divisions have been created. Start by adding a division above.'}
                        />
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
        isLoading: state.divisions.isLoading,
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