import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../../redux/actions/teamsActions';

import { toggleModal, toggleFilter} from '../../../redux/actions/misc';
import { Button, Filter } from '../../../components';
// import ListItem from '../ListItem';
// import DashSeasonsListItem from '../DashSeasons/DashSeasonsListItem';
import DashTable from '../DashTable';
import qs from 'query-string';

const defaultState = {
    division_id: null,
    name: '',
    colors: '',
    filters: {
        division: '',
        season: ''
    },
    filterRequestSent: false,
    isFilterVisible: false,
}

class DashTeams extends Component {

   state = defaultState;

    componentDidMount() {
        if(this.props.location.search.length > 0){
            return this.props.getTeams(this.props.location.search.slice(1)).then(res => {
                   return res && this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
            });
        }

        return this.props.getTeams();
    }

    handleChange = edit => e => {
        if(!!edit){
            const editStateCopy = {...this.state.edit};
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState({edit: editStateCopy})
        }
        // console.log({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    handleAddTeam = () => {

        // this variable sets the default disabled value to the season name
        const defaultValue = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;

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
                    title: 'Season',
                    type: 'input',
                    name: 'season',
                    disabled: true,
                    defaultValue
                },
                {
                    title: 'Division',
                    type: 'select',
                    name: 'division_id',
                    defaultValue: null,
                    listOfSelects: [{name: 'Select Division', value: null}, ...this.props.divisions]
                    // listOfSelects: this.props.divisions
                },
                {
                    title: 'Team Colors',
                    type: 'input',
                    name: 'colors',
                    defaultValue: null
                }
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createTeam({ name: this.state.name, division_id: this.state.division_id, colors: this.state.colors, season_name: defaultValue  }); this.setState(defaultState) },
        }, 'prompt');
    }

    handleDeleteTeam = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Team',
            message: `Are you sure you want to delete this team?\nTeam will be removed from the season, but will not affect any previous or upcoming games with this team.\n\nPlease type in the name of the team below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteTeam(item.id, item),
        }, 'delete');
    }

    handleEditTeam = (item) => {
        this.setState({ edit: item })
        console.log(item, 'itemss')

        const defaultValue = Object.keys(qs.parse(this.props.location.search)).length > 0 ? qs.parse(this.props.location.search).season : this.props.currentSeason.name;

        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Team',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                {
                    title: 'Season',
                    type: 'input',
                    name: 'season',
                    defaultValue,
                    disabled: true
                    // listOfSelects: [...this.state.seasonTypes].slice(1)
                },
                {
                    title: 'Division',
                    type: 'select',
                    name: 'division_id',
                    defaultValue: item.division_id,
                    listOfSelects: [{name: 'Select Division', value: null}, ...this.props.divisions]
                    // listOfSelects: this.props.divisions
                },
                {
                    title: 'Team Colors',
                    type: 'input',
                    name: 'colors',
                    defaultValue: item.colors
                }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Team',
            // confirmAction: () => console.log('edit team confirmation')
            confirmAction: () => this.validation('edit') && this.props.updateTeam(item.id, this.state.edit),
        }, 'prompt');
    }


    // validation = () => {
    //     // console.log(!this.state.name, !Number(this.state.division_id), 'state!!!')
    //     if (!this.state.name || !Number(this.state.division_id)) return false;
    //     return true;
    // }

    validation = (edit) => {
        if(!!edit){
            console.log(this.state.edit, 'edit')
            return !this.state.edit.name || !Number(this.state.edit.division_id) ? false : true;
        }
        console.log(this.state.name, Number(this.state.division_id))
        if (!this.state.name|| !Number(this.state.division_id)) return false;
        return true;
    }


    componentDidUpdate(prevProps){

        // this fires checkFilters() when the new season is selected in the filter
        // resetting the divisions array passed to the filter
        if(prevProps.divisions.length !== this.props.divisions.length){
            this.checkFilters(false);
        }
    }

    checkFilters = (toggle) => {
        // console.log(this.props.divisions)
        const teamFilterData = [
            {
                title: 'Season',
                options: [{
                    type: 'select',
                    name: 'season',
                    defaultValue: this.state.filters.season || this.props.currentSeason.name,
                    listOfSelects: this.props.seasons,
                    hiddenValue: 'Select a Season'
                }]
            },
            {
                title: 'Division',
                options: [{
                    type: 'select',
                    name: 'division',
                    defaultValue: this.state.filters.division,
                    listOfSelects: [{name: 'View All', value: ''}, ...this.props.divisions],
                    hiddenValue: 'Select a Division'
                }]
            },{
                title: 'Other',
                options: [{
                    title: 'Hidden Teams (not working yet)',
                    name: 'show_hidden',
                    // isChecked: false
                    // title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    defaultValue: false
                }]

        }]

        this.setState({data: teamFilterData}, () => !!toggle && this.props.toggleFilter())
        // this.setState((prevState, props) => {
        //         console.log(props, 'PROPZZZZZZ in state')
        //         !!toggle && this.props.toggleFilter()
        //     return {data: teamFilterData}
        // })
    }


    render() {
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        const { teams } = this.props

        return (
            <>
            <div className="dashboard-filter-header">
                <div style={{width: '100%'}}>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button title="Add Team" onClick={this.handleAddTeam} />
                        <Button title="Filter" onClick={() => this.checkFilters(true)} />
                    </div>
                    <Filter data={this.state.data} getAction={this.props.getTeams} reloadOn={'season'} history={this.props.history} filterType={'teams'}/>
                </div>
            </div>

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    { teams && teams.length <= 0 ? (
                        <div>
                            Sorry, no teams have been created. Start by adding a season above.
                        </div>
                    ) : (
                        <DashTable 
                            data={teams}
                            sections={{ 'name': 'two', 'division_name': 'one' }}
                            minWidth={550}
                            onEdit={this.handleEditTeam}
                            onDelete={this.handleDeleteTeam}
                        />
                        // <>

                        //     <div className="dashboard-list-item hide-mobile">
                        //         <div style={{ display: 'flex' }}>

                        //             <p className="flex-two">Name</p>
                        //             <p className="flex-one">Division</p>
                        //             <p className="flex-one">Manage</p>
                        //         </div>
                        //     </div>

                        //     {teams.map(item => {
                        //         // console.log(item, 'item!')
                        //         // item.division_name = this.getDivisionNameById(item.division_id)
                        //         return (


                        //             <DashSeasonsListItem 
                        //                 // key={item.id}
                        //                 // item={item}
                        //                 // sections={{ 'name': 'two', 'division_name': 'one' }}
                        //                 // onClick={() => this.handleDeleteSeason(item)}
                        //                 // onEdit={() => this.handleEditTeam(item)}

                        //                 key={item.id}
                        //                 item={item}
                        //                 sections={{ 'name': 'two', 'division_name': 'one' }}
                        //                 onDelete={() => this.handleDeleteTeam(item)}
                        //                 onEdit={() => this.handleEditTeam(item)}
                        //                 // onHide={() => this.handleHideDivision(item)}
                        //                 onHide={() => console.log('on hide clicked')}
                        //             />
                        //         )

                        //     })}
                        // </>
                    )}
                </div>
            </div>

        </>
        )
    }
}

const mapStateToProps = state => {
    // console.log('state:::', state.divisions.divisions)
    return {
        teams: state.teams.teams,
        isLoading: state.teams.isLoading,
        divisions: state.divisions.divisions,
        seasons: state.seasons.seasons,
        currentSeason: state.seasons.currentSeason
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTeams: (filters) => dispatch(getTeams(filters)),
        createTeam: data => dispatch(createTeam(data)),
        updateTeam: (id, data) => dispatch(updateTeam(id, data)),
        deleteTeam: (id, data) => dispatch(deleteTeam(id, data)),
        // updateTeams: (id, data) => dispatch(updateTeams(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
        toggleFilter: () => dispatch(toggleFilter('teams'))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashTeams) 
