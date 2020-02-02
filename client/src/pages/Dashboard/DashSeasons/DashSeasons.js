import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason, createSeason, updateSeason } from '../../../redux/actions/seasons';
import { Button, Filter } from '../../../components';
// import ListItem from '../ListItem';
import DashSeasonsListItem from './DashSeasonsListItem';
import { toggleModal, toggleFilter} from '../../../redux/actions/misc';
import qs from 'query-string';
import './DashSeasons.scss';


const defaultState = {
    seasonTypes: [
        {name: 'View All',   value: ''},
        {name: 'Regular',    value: 'Regular'},
        {name: 'Playoffs',   value: 'Playoffs'},
        {name: 'Tournament', value: 'Tournament'}
    ],
    name: '',
    type: 'Regular',
    is_active: false,
    edit: {},
    filters: {
        // type: ''
    },
    filterRequestSent: false,
    isFilterVisible: false,
    filterData: []
}

class DashSeasons extends Component {

    state = defaultState;

    componentDidMount() {
        //check for query params on page load
        if(this.props.location.search.length > 0){
            return this.props.getSeasons(this.props.location.search.slice(1)).then(res => {
                   return res && this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
            });
        }

        return this.props.getSeasons();
    }

    handleAddSeason = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Season',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: null,
                    listOfSelects: [...this.state.seasonTypes].splice(1)
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState) },
        }, 'prompt');
    }

    validation = (edit) => {
        if(!!edit){
            return !this.state.edit.name ? false : true;
        }
        if (!this.state.name) return false;
        return true;
    }

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Season',
            message: `Are you sure you want to delete this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
    }

    handleHideSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_date ? 'Unh': 'H'}ide Season`,
            message: item.hidden_date ? 
            `Are you sure you want to unhide this season? This will cause the selected season to be visible on the public page` 
            : 
            `Are you sure you want to hide this season?\nThis will hide the season from both the admin dashboard and from the public page. You can view all hidden seasons using the filter. This does NOT delete the season`,
            fields: [],
            confirmActionTitle: `${item.hidden_date ? 'Unh': 'H'}ide Season`,
            confirmAction: () => {
                return this.props.updateSeason(item.id, {is_hidden: !!item.hidden_date ? false : true}).then((d) => {
                    d === 'getSeasons' && this.props.getSeasons(this.props.location.search.slice(1))
                })
            },
        }, 'prompt');
    }

    handleChange = edit => e => {
        if(!!edit){
            const editStateCopy = {...this.state.edit};
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState({edit: editStateCopy})
        }
        this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    // handleFilterChange = e => {
    //     const copy = {...this.state.filters};
    //     copy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //     this.setState({filters: copy})
    // }

    // handleFilterSubmit = () => {
    //     // console.log(this.state.filters, 'submitting')
    //     const filters = qs.stringify(this.state.filters);
    //     console.log(filters, 'FILTERS')
    //     this.props.getSeasons(filters)
    //     this.setState({filterRequestSent: true})
    //     this.props.history.push({
    //         search: filters
    //     })
    // }

    clearFilters = () => {
        this.setState({filters: {}, filterRequestSent: false}, () => {
            this.props.getSeasons(qs.stringify(this.state.filters))
            this.props.history.push({
                search: null
            })
        })
    }

    handleEditSeason = (item) => {
        this.setState({ edit: item })
        console.log(item, 'itemss')
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Season',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: item.type,
                    listOfSelects: [...this.state.seasonTypes].slice(1)
                },
                {
                    title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    name: 'is_active',
                    hidden: item.is_active,
                    defaultValue: item.is_active
                }
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Season',
            confirmAction: () => this.validation('edit') && this.props.updateSeason(item.id, this.state.edit),
        }, 'prompt');
    }

    checkFilters = () => {
        //set filter data and toggle filter component
        const filterData = [{
            title: 'Type',
            options: [{
                type: 'select',
                name: 'type',
                defaultValue: this.state.filters.type,
                listOfSelects: this.state.seasonTypes,
                hiddenValue: 'Select a type'
            }]
        },{
            title: 'Other',
            options: [{
                title: 'Hidden Seasons',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: this.state.filters.show_hidden || false
            }]
        }]

        this.setState({filterData}, () => this.props.toggleFilter())
    }


    render() {
        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        const { seasons } = this.props;
        return (
            <>
                <div className="dashboard-filter-header">
                    <div style={{width: '100%'}}>

                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button title="Add Season" onClick={this.handleAddSeason} />

                            <div>
                                {
                                    Object.keys(this.state.filters).length > 0 && this.state.filterRequestSent &&
                                    <span style={{fontSize: 14}}onClick={this.clearFilters}>Clear Filters</span>
                                }
                                <Button title="Filter" onClick={this.checkFilters} />

                            </div>
                        </div>

                            {/* FOR MOBILE */}
                        {/* <div className="sort-section hide-desktop" style={{background: 'red'}}>
                            Sort By
                            <div className="select-style">
                            <select name="" id="">
                            <option value="name">Name</option>
                            <option value="type">Type</option>
                            </select>
                            </div>
                        </div> */}


                        <Filter data={this.state.filterData} getAction={this.props.getSeasons} history={this.props.history} filterType={'seasons'}/>
                    </div>
                </div>

                <div className="dashboard-list-container">
                    <div className="dashboard-list">

                        { seasons && seasons.length <= 0 ? (
                            <div>
                                {this.props.location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                            </div>
                        ) : (
                            <>

                                <div className="dashboard-list-item hide-mobile">
                                    <div style={{ display: 'flex' }}>

                                        <p className="flex-two">Name</p>
                                        <p className="flex-one">Type</p>
                                        <p className="flex-one">Manage</p>
                                    </div>
                                </div>

                                {seasons.map(item => {

                                    return (
                                        <DashSeasonsListItem
                                            key={item.id}
                                            item={item}
                                            sections={{ 'name': 'two', 'type': 'one' }}
                                            onDelete={() => this.handleDeleteSeason(item)}
                                            onEdit={() => this.handleEditSeason(item)}
                                            onHide={() => this.handleHideSeason(item)}
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
    return {
        seasons: state.seasons.seasons,
        isLoading: state.seasons.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSeasons: filters => dispatch(getSeasons(filters)),
        createSeason: data => dispatch(createSeason(data)),
        deleteSeason: id => dispatch(deleteSeason(id)),
        updateSeason: (id, data) => dispatch(updateSeason(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
        toggleFilter: () => dispatch(toggleFilter('seasons'))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 