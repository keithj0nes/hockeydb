import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTeams, createTeam } from '../../../redux/actions/teamsActions';
import { getDivisions } from '../../../redux/actions/divisions';

import { toggleModal, toggleFilter} from '../../../redux/actions/misc';
import { Button, Filter } from '../../../components';
import ListItem from '../ListItem';
// import qs from 'query-string';

const defaultState = {
    division_id: null,
    name: '',
    colors: '',
    filters: {
        division: ''
    },
    filterRequestSent: false,
    isFilterVisible: false
}

class DashTeams extends Component {

   state = defaultState;

    componentDidMount() {
        this.props.getTeams();
        if(!this.props.divisions.length){
            this.props.getDivisions(1);
            // this.props.getDivisions(this.props.currentSeason.id);
        }
    }

    handleChange = e => {
        console.log(e.target.name, e.target.value,  'aye')
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    handleAddTeam = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Team',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null
                },
                {
                    title: 'Division',
                    type: 'select',
                    name: 'division_id',
                    defaultValue: null,
                    // listOfSelects: [{name: 'select', value: null}, ...this.props.divisions]
                    listOfSelects: this.props.divisions

                },
                {
                    title: 'Team Colors',
                    type: 'input',
                    name: 'colors',
                    defaultValue: null
                }

            ],
            onChange: this.handleChange,
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createTeam({ name: this.state.name, division_id: this.state.division_id, colors: this.state.colors  }); this.setState(defaultState) },
        }, 'prompt');
    }

    validation = () => {
        if (!this.state.name) return false;
        return true;
    }

    checkFilters = () => {

        const teamFilterData = [{
                title: 'Division',
                options: [{
                    type: 'select',
                    name: 'division',
                    defaultValue: this.state.filters.division,
                    // listOfSelects: this.props.divisions,
                    listOfSelects: [{name: 'View All', value: ''}, ...this.props.divisions],

                    hiddenValue: 'Select a Division'
                }]
            },{
                title: 'Other',
                options: [{
                    title: 'Hidden Seasons',
                    name: 'show_hidden',
                    // isChecked: false

                    // title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    // name: 'is_active',
                    // hidden: item.is_active,
                    defaultValue: false
                }]

        }]
        this.setState({data: teamFilterData}, () => this.props.toggleFilter())

        // {name, value, isChecked}
        // console.log(this.state.filters.type, 'tiler time')
        // console.log(this.state.seasonTypes, 'seasontimes')


    }

    // handleFilterChange = e => {
    //     const copy = {...this.state.filters};
    //     copy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //     this.setState({filters: copy})
    // }

    // handleFilterSubmit = () => {
    //     // console.log(this.state.filters, 'submitting')
    //     const filters = qs.stringify(this.state.filters);
    //     // console.log(filters, 'FILTERS')
    //     this.props.getTeams(filters)
    //     this.setState({filterRequestSent: true})
    //     this.props.history.push({
    //         search: filters
    //     })
    // }

    // clearFilters = () => {
    //     this.setState({filters: {}, filterRequestSent: false}, () => {
    //         this.props.getTeams(qs.stringify(this.state.filters))
    //         this.props.history.push({
    //             search: null
    //         })
    //     })
    // }

    // getDivisionNameById = (id) => {
    //     const { divisions } = this.props;
    //     for(let div in divisions){
    //         if(divisions[div].id === id){
    //             return divisions[div].name
    //         }
    //     }
    // }

    render() {
        const { teams } = this.props
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <>
            <div className="dashboard-filter-header">
                <div style={{width: '100%'}}>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button title="Add Team" onClick={this.handleAddTeam} />

                        {/* <div>
                            {
                                Object.keys(this.state.filters).length > 0 && this.state.filterRequestSent &&
                                <span style={{fontSize: 14}}onClick={this.clearFilters}>Clear Filters</span>
                            }
                            
                        </div> */}
                        <Button title="Filter" onClick={this.checkFilters} />
                    </div>
                    <Filter data={this.state.data} getAction={this.props.getTeams} history={this.props.history} filterType={'teams'}/>
                </div>
            </div>

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    { teams && teams.length <= 0 ? (
                        <div>
                            Sorry, no teans have been created. Start by adding a season above.
                        </div>
                    ) : (
                        <>

                            <div className="dashboard-list-item hide-mobile">
                                <div style={{ display: 'flex' }}>

                                    <p className="flex-two">Name</p>
                                    <p className="flex-one">Division</p>
                                    <p className="flex-one">Manage</p>
                                </div>
                            </div>

                            {teams.map(item => {
                                // console.log(item, 'item!')
                                // item.division_name = this.getDivisionNameById(item.division_id)
                                return (
                                    <ListItem
                                        key={item.id}
                                        item={item}
                                        sections={{ 'name': 'two', 'division_name': 'one' }}
                                        onClick={() => this.handleDeleteSeason(item)}
                                        onEdit={() => this.handleEditSeason(item)}
                                    />
                                )

                            })}
                        </>
                    )}
                </div>
            </div>

        </>
        )
    }
}

const mapStateToProps = state => {
    // console.log('state:::', state)
    return {
        teams: state.teams.teams,
        isLoading: state.teams.isLoading,
        divisions: state.divisions.divisions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTeams: (filters) => dispatch(getTeams(filters)),
        getDivisions: (season_id) => dispatch(getDivisions(season_id)),
        createTeam: data => dispatch(createTeam(data)),
        // deleteTeam: id => dispatch(deleteSeason(id)),
        // updateTeams: (id, data) => dispatch(updateTeams(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
        toggleFilter: () => dispatch(toggleFilter('teams'))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashTeams) 
