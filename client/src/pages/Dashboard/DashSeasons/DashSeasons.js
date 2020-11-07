import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'query-string';
import { getSeasons, deleteSeason, createSeason, updateSeason } from 'redux/actions/seasons';
import { toggleModal, toggleFilter } from 'redux/actions/misc';
import { setQuery } from 'helpers';
import { DashPageHeader, DashFilter } from '../../../components';
import DashTable from '../DashTable';
import './DashSeasons.scss';

const defaultState = {
    seasonTypes: [
        { name: 'View All', value: '' },
        { name: 'Regular', value: 'Regular' },
        { name: 'Playoffs', value: 'Playoffs' },
        { name: 'Tournament', value: 'Tournament' },
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
    filterData: [],
};

class DashSeasons extends Component {
    state = defaultState;

    componentDidMount() {
        // check for query params on page load
        if (this.props.location.search.length > 0) {
            // eslint-disable-next-line arrow-body-style
            return this.props.getSeasons(this.props.location.search.slice(1)).then(res => {
                return res && this.setState({ filters: qs.parse(this.props.location.search) }); // this adds filters to default values
            });
        }

        return this.props.getSeasons();
    }

    handleAddSeason = () => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Add Season',
            isClosableOnBackgroundClick: false,
            message: 'heres a long message that i\'m adding so that it appears to have some sort of body to the modal. without this, i cant test for a message. It\'s really not that big of a deal though',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null,
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: null,
                    listOfSelects: [...this.state.seasonTypes].splice(1),
                },
            ],
            onChange: this.handleChange(),
            confirmActionTitle: 'Create Season',
            confirmAction: () => { this.validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState); },
        }, 'prompt');
    }

    validation = (edit) => {
        if (!!edit) {
            return !!this.state.edit.name;
        }
        if (!this.state.name) return false;
        return true;
    }

    handleDeleteSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            title: 'Delete Season',
            message: 'Are you sure you want to delete this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.',
            toBeDeleted: item,
            deleteAction: () => this.props.deleteSeason(item.id),
        }, 'delete');
    }

    handleHideSeason = (item) => {
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_date ? 'Unh' : 'H'}ide Season`,
            message: item.hidden_date
                ? 'Are you sure you want to unhide this season? This will cause the selected season to be visible on the public page'
                : 'Are you sure you want to hide this season?\nThis will hide the season from both the admin dashboard and from the public page. You can view all hidden seasons using the filter. This does NOT delete the season',
            fields: [],
            confirmActionTitle: `${item.hidden_date ? 'Unh' : 'H'}ide Season`,
            confirmAction: () => this.props.updateSeason(item.id, { is_hidden: !!!item.hidden_date }).then((d) => {
                d === 'getSeasons' && this.props.getSeasons(this.props.location.search.slice(1));
            }),
        }, 'prompt');
    }

    handleChange = edit => e => {
        if (!!edit) {
            const editStateCopy = { ...this.state.edit };
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return this.setState(() => ({ edit: editStateCopy }));
        }
        return this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    }

    clearFilters = () => {
        this.setState({ filters: {}, filterRequestSent: false }, () => {
            this.props.getSeasons(qs.stringify(this.state.filters));
            this.props.history.push({
                search: null,
            });
        });
    }

    handleEditSeason = (item) => {
        this.setState({ edit: item });
        this.props.toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Season',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name,
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: item.type,
                    listOfSelects: [...this.state.seasonTypes].slice(1),
                },
                {
                    title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    name: 'is_active',
                    hidden: item.is_active,
                    defaultValue: item.is_active,
                },
            ],
            onChange: this.handleChange('editing'),
            confirmActionTitle: 'Update Season',
            confirmAction: () => this.validation('edit') && this.props.updateSeason(item.id, this.state.edit),
        }, 'prompt');
    }

    checkFilters = () => {
        // set filter data and toggle filter component
        const filterData = [{
            title: 'Type',
            options: [{
                type: 'select',
                name: 'type',
                defaultValue: this.state.filters.type,
                listOfSelects: this.state.seasonTypes,
                hiddenValue: 'Select a type',
            }],
        }, {
            title: 'Other',
            options: [{
                title: 'Hidden Seasons',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: this.state.filters.show_hidden || false,
            }],
        }];

        this.setState(() => ({ filterData }), () => this.props.toggleFilter());
    }

    setFilterDataOpenFilter = (val) => {
        // set filter data and toggle filter component

        const filterData = [{
            title: 'Type',
            options: [{
                type: 'select',
                name: 'type',
                defaultValue: this.state.filters.type,
                listOfSelects: this.state.seasonTypes,
                hiddenValue: 'Select a type',
                useKey: 'value',
            }],
        }, {
            title: 'Other',
            options: [{
                title: 'Hidden Seasons',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: this.state.filters.show_hidden || false,
            }],
        }];

        this.setState(() => ({ filterData }), () => {
            this.setState(prevState => ({ isFilterVisible: val !== undefined ? val : !prevState.isFilterVisible }));
        });
    }

    handleFilterChange = (e) => {
        // clear filters and close
        if (e === null) {
            this.props.history.push({ search: '' });
            this.props.getSeasons();
            return this.setState({ filters: {}, isFilterVisible: false });
        }

        const filters = { ...this.state.filters };

        if (e.target.value === '' || e.target.checked === false) {
            delete filters[e.target.name];
        } else {
            filters[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        }

        const search = setQuery(filters);
        this.props.getSeasons(`?${search}`);
        this.props.history.push({ search });
        return this.setState(() => ({ filters }));
    }


    render() {
        const { seasons, isLoading } = this.props;

        const showingHidden = this.props.location.search.includes('hidden');

        const pageHeaderInfo = {
            title: 'Seasons',
            searchPlaceholder: 'Search by season name',
            onChange: () => console.log('changing placeholder text'),
            buttons: [
                {
                    iconName: 'ADD_USER',
                    title: 'Add Season',
                    onClick: this.handleAddSeason,
                },
                {
                    iconName: 'FILTER',
                    title: 'Filter Seasons',
                    isActive: this.props.location.search.length > 0,
                    onClick: (val) => {
                        this.setFilterDataOpenFilter(val);
                        // this.setState({isFilterVisible: val !== undefined ? val : !this.state.isFilterVisible});
                    },
                    isPopoverVisible: this.state.isFilterVisible,
                    popoverUI: (closeFilter) => (
                        <DashFilter
                            data={this.state.filterData}
                            getAction={this.props.getSeasons}
                            closeFilter={closeFilter}
                            filterType="seasons"
                            onChange={this.handleFilterChange}
                        />
                    ),
                },
            ],
        };

        return (
            <>
                <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

                <div style={{ paddingBottom: 16 }} />

                <div className="dashboard-list-container">
                    <div className="dashboard-list">
                        <DashTable
                            data={seasons}
                            sections={{ name: 'two', type: 'one' }}
                            minWidth={550}
                            isLoading={[isLoading, 15]}
                            emptyTableText={this.props.location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                            popoverData={(d, closePopover) => (
                                <ul>
                                    <li onClick={() => { this.handleEditSeason(d); closePopover(); }}>Edit Season</li>
                                    <li onClick={() => { this.handleHideSeason(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide Season`}</li>
                                    {!d.is_active && <li onClick={() => { this.handleDeleteSeason(d); closePopover(); }}>Delete Season</li>}
                                </ul>
                            )}
                        />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    seasons: state.seasons.seasons,
    isLoading: state.seasons.isLoading,
});

const mapDispatchToProps = dispatch => ({
    getSeasons: filters => dispatch(getSeasons(filters)),
    createSeason: data => dispatch(createSeason(data)),
    deleteSeason: id => dispatch(deleteSeason(id)),
    updateSeason: (id, data) => dispatch(updateSeason(id, data)),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    toggleFilter: () => dispatch(toggleFilter('seasons')),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons);

DashSeasons.propTypes = {
    seasons: PropTypes.array.isRequired,
    getSeasons: PropTypes.func.isRequired,
    createSeason: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    deleteSeason: PropTypes.func.isRequired,
    updateSeason: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    toggleFilter: PropTypes.func,
    location: PropTypes.object,
};
