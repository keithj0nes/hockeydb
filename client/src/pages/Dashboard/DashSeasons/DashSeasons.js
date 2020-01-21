import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason, createSeason, updateSeason, hideSeason } from '../../../redux/actions/seasons';
import { Button, Filter } from '../../../components';

import './DashSeasons.scss';
// import ListItem from '../ListItem';
import DashSeasonsListItem from './DashSeasonsListItem';
import { toggleModal, toggleFilter} from '../../../redux/actions/misc';

import qs from 'query-string';

const defaultState = {
    // seasonTypes: ['Regular Season', 'Playoffs', 'Tournament'],
    seasonTypes: [{
        name: 'View All', value: ''
    },{
        name: 'Regular', value: 'Regular'
    },{
        name: 'Playoffs', value: 'Playoffs'
    },{
        name: 'Tournament', value: 'Tournament'
    }],

    name: '',
    type: 'Regular Season',
    is_active: false,
    edit: {},
    filters: {
        // type: ''
    },
    filterRequestSent: false,
    isFilterVisible: false
}

class DashSeasons extends Component {

    state = defaultState;

    componentDidMount() {

        //check for query params

        // console.log(this.props.location.search, 'SEraCh')

        if(this.props.location.search.length > 0){
            console.log('hitting)')
            this.props.getSeasons(this.props.location.search.slice(1)).then(r => {
                // console.log(r, 'ARREE')
                if(r){
                    this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
                }
            });

        }

        else {
            console.log('hitting else')
            this.props.getSeasons();

        }

        // if (this.props.seasons.length <= 0) {
        // //     console.log('therelajsdlas;dl;alsdg')
        // console.log(this.props.seasons.length, 'YO!')
        // console.log(this.props.seasons)
        //     this.props.getSeasons(null);
        // }
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
                    listOfSelects: this.state.seasonTypes
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState) },
        }, 'prompt');
    }

    validation = () => {
        if (!this.state.name) return false;
        return true;
    }

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Season',
            message: `Are you sure you want to hide this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
    }

    handleHideSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: 'Hide Season',
            message: item.hidden_date ? 
            `Are you sure you want to unhide this season? This will cause the selected season to be visible on the public page` 
            : 
            `Are you sure you want to hide this season?\nThis will hide the season from both the admin dashboard and from the public page. You can view all hidden seasons using the filter. This does NOT delete the season`,
            fields: [],
            confirmActionTitle: 'Hide Season',
            // confirmAction: () => console.log(this.state, 'this.state'),
            // confirmAction: () => console.log(item, 'clicked to hide'),
            confirmAction: () => this.props.updateSeason(item.id, {is_hidden: !!item.hidden_date ? false : true}),

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

    handleFilterChange = e => {
        const copy = {...this.state.filters};
        copy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({filters: copy})
    }

    handleFilterSubmit = () => {
        // console.log(this.state.filters, 'submitting')
        const filters = qs.stringify(this.state.filters);
        console.log(filters, 'FILTERS')
        this.props.getSeasons(filters)
        this.setState({filterRequestSent: true})
        this.props.history.push({
            search: filters
        })
    }

    clearFilters = () => {
        this.setState({filters: {}, filterRequestSent: false}, () => {
            this.props.getSeasons(qs.stringify(this.state.filters))
            this.props.history.push({
                search: null
            })
        })
    }

    handleEditSeason = (item) => {
        // console.log(item, 'edtinggggg item!');

        this.setState({ edit: item })


        console.log(item, 'item!')
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            // toBeDeleted: item,
            title: 'Edit Season',
            // message: 'Are you sure you want to delete this season?',
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
                    listOfSelects: this.state.seasonTypes
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
            // confirmAction: () => console.log(this.state, 'this.state'),
            confirmAction: () => this.props.updateSeason(item.id, this.state.edit),
        }, 'prompt');
    }


    handleFilterSeason = () => {
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: 'Filter Season',
            fields: [
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: this.state.filters.type,
                    listOfSelects: this.state.seasonTypes,
                    hiddenValue: 'Select a type'
                },
            ],
            onChange: this.handleFilterChange,
            confirmActionTitle: 'Filter Season',
            confirmAction: () => this.handleFilterSubmit(),
        }, 'prompt');
    }

    checkFilters = () => {

        const hi = [{
                // title: 'Type',
                //this is for checkboxes
                // data: [...this.state.seasonTypes.map(n => {
                //     return {
                //         name: n,
                //         value: n,
                //         isChecked: false
                //     }
                // })]

                // data: 

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
                    // isChecked: false

                    // title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    // name: 'is_active',
                    // hidden: item.is_active,
                    defaultValue: false
                }]

        }]

        // this.setState({isFilterVisible: !this.state.isFilterVisible,
        //     data:hi
        // })

        this.setState({data: hi}, () => this.props.toggleFilter())

        // {name, value, isChecked}
        console.log(this.state.filters.type, 'tiler time')
        console.log(this.state.seasonTypes, 'seasontimes')


    }


    render() {
        // console.log(this.props, 'propss')

        //this should be it's own loading icon component
        
        console.log(this.state.data, 'DATA')
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
                                {/* <Button title="Filter" onClick={this.handleFilterSeason} /> */}
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


                        <Filter data={this.state.data} getAction={this.props.getSeasons} history={this.props.history} filterType={'seasons'}/>

                        {/* <Filter isVisible={this.state.isFilterVisible} data={this.state.data} filterType={'seasons'}/> */}
                    </div>
                </div>

                <div className="dashboard-list-container">
                    <div className="dashboard-list">

                        { seasons && seasons.length <= 0 ? (
                            <div>
                                Sorry, no seasons have been created. Start by adding a season above.
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
        getSeasons: (filters) => dispatch(getSeasons(filters)),
        createSeason: data => dispatch(createSeason(data)),
        deleteSeason: id => dispatch(deleteSeason(id)),
        updateSeason: (id, data) => dispatch(updateSeason(id, data)),
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
        toggleFilter: () => dispatch(toggleFilter('seasons'))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 