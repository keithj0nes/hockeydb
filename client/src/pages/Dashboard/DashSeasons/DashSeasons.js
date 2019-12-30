import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason, createSeason, updateSeason } from '../../../redux/actions/seasons';
import { Button } from '../../../components';

import './DashSeasons.scss';
// import ListItem from '../ListItem';
import DashSeasonsListItem from './DashSeasonsListItem';
import { toggleModal } from '../../../redux/actions/misc';

import qs from 'query-string'

const defaultState = {
    seasonTypes: ['Regular Season', 'Playoffs', 'Tournament'],
    name: '',
    type: 'Regular Season',
    is_active: false,
    edit: {},
    filters: {
        // type: ''
    },
    filterRequestSent: false
}

class DashSeasons extends Component {

    state = defaultState;

    componentDidMount() {

        //check for query params

        // console.log(this.props.location.search, 'SEraCh')

        if(this.props.location.search.length > 0){
            this.props.getSeasons(this.props.location.search.slice(1)).then(r => {
                // console.log(r, 'ARREE')
                if(r){
                    this.setState({filters: qs.parse(this.props.location.search)}) //this adds filters to default values
                }
            });

        }

        if (this.props.seasons.length <= 0) {
            console.log('therelajsdlas;dl;alsdg')
            this.props.getSeasons();
        }
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
            message: `Are you sure you want to delete this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.`,
            toBeDeleted: item,
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
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


    render() {
        // console.log(this.props, 'propss')

        //this should be it's own loading icon component
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        const { seasons } = this.props;
        return (
            <>
                <div className="dashboard-filter-header">
                        <Button title="Add Season" onClick={this.handleAddSeason} />

                        <div>
                            {
                                Object.keys(this.state.filters).length > 0 && this.state.filterRequestSent &&
                                <span style={{fontSize: 14}}onClick={this.clearFilters}>Clear Filters</span>
                            }
                            <Button title="Filter" onClick={this.handleFilterSeason} />
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
        toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons) 