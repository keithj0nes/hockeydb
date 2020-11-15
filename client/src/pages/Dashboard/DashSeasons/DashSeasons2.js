import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSeasons, deleteSeason, createSeason, updateSeason } from 'redux/actions/seasons';
import { toggleModal } from 'redux/actions/misc';
import { DashPageHeader, DashFilter } from '../../../components';
import DashTable from '../DashTable';
import './DashSeasons.scss';
import { useQueryParam } from '../../../components/useQueryParams';

const defaultState = {
    seasonTypes: [
        { name: 'View All', value: '' },
        { name: 'Regular', value: 'Regular' },
        { name: 'Playoffs', value: 'Playoffs' },
        { name: 'Tournament', value: 'Tournament' },
    ],
    // name: '',
    // type: 'Regular',
    // is_active: false,
    edit: {},
    // filters: {
    //     // type: ''
    // },
    filterRequestSent: false,
    isFilterVisible: false,
    filterData: [],
};

const DashSeasons2 = ({ seasons, isLoading, location, getSeasons, toggleModal, createSeason, updateSeason, deleteSeason }) => {
    const [state, setState] = useState(defaultState);
    const [filters, setFilters] = useQueryParam({ getMethod: getSeasons });

    // useEffect(() => {
    //     console.log('setting state on flitler change');
    //     setState({ ...state, filters });
    // }, []);

    const setFilterDataOpenFilter = (val) => {
        console.log(filters, 'filters');
        const filterData = [{
            title: 'Type',
            options: [{
                type: 'select',
                name: 'type',
                defaultValue: filters.type,
                listOfSelects: state.seasonTypes,
                hiddenValue: 'Select a type',
                useKey: 'value',
            }],
        }, {
            title: 'Other',
            options: [{
                title: 'Hidden Seasons',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: filters.show_hidden || false,
            }],
        }];
        setState({ ...state, filterData });
    };

    const handleAddSeason = () => {
        toggleModal({
            isVisible: true,
            title: 'Add Season',
            isClosableOnBackgroundClick: false,
            message: 'heres a long message that i\'m \n adding so that it appears to have some sort of body to the modal. without this, i cant test for a message. It\'s really not that big of a deal though',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
                {
                    title: 'Type',
                    type: 'select',
                    name: 'type',
                    defaultValue: state.seasonTypes[1].value || null,
                    listOfSelects: [...state.seasonTypes].splice(1),
                    rules: [{ required: true }],
                },
            ],
            onChange: handleChange,
            confirmActionTitle: 'Create Season',
            // confirmAction: () => { validation() && this.props.createSeason({ name: this.state.name, type: this.state.type }); this.setState(defaultState); },
            // confirmAction: (e) => console.log(e, 'button clicked')
            confirmAction: (values) => createSeason({ seasonData: values }),
            // confirmAction: (values) => console.log(values),

        }, 'prompt');
    };

    const handleChange = edit => e => {
        console.log(e.target.value, 'e.target.value')
        if (!!edit) {
            const editStateCopy = { ...state.edit };
            editStateCopy[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            return setState({ ...state, edit: editStateCopy });
        }
        return setState({ ...state, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    };

    const handleEditSeason = (item) => {
        setState({ ...state, edit: item });
        toggleModal({
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
                    listOfSelects: [...state.seasonTypes].splice(1),
                },
                {
                    title: item.is_active ? 'Active Season' : 'Set To Active Season',
                    type: 'checkbox',
                    name: 'is_active',
                    hidden: item.is_active,
                    defaultValue: item.is_active,
                },
            ],
            onChange: handleChange('editing'),
            confirmActionTitle: 'Update Season',
            // confirmAction: () => this.validation('edit') && this.props.updateSeason(item.id, this.state.edit),
            confirmAction: (values) => updateSeason({ id: item.id, seasonData: values }),
            // confirmAction: (e) => console.log(e, 'button EDIT clicked'),
        }, 'prompt');
    };

    const handleDeleteSeason = (item) => {
        toggleModal({
            isVisible: true,
            title: 'Delete Season',
            message: 'Are you sure you want to delete this season?\nThis cannot be undone and you will lose any information saved within this season.\n\nPlease type in the name of the season below to delete.',
            toBeDeleted: item,
            deleteAction: () => deleteSeason({ id: item.id }),
        }, 'delete');
    };


    const pageHeaderInfo = {
        title: 'Seasons',
        searchPlaceholder: 'Search by season name',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add Season',
                // onClick: () => setFilters({ ...filters, show_hidden: true }),
                onClick: handleAddSeason,
            },
            {
                iconName: 'FILTER',
                title: 'Filter Seasons',
                isActive: location.search.length > 0,
                onClick: (val) => setFilterDataOpenFilter(val),
                popoverUI: (closeFilter) => (
                    <DashFilter
                        data={state.filterData}
                        closeFilter={closeFilter}
                        filters={filters}
                        setFilters={setFilters}
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
                    <h3>lol</h3>
                    <DashTable
                        data={seasons}
                        sections={{ name: 'two', type: 'one' }}
                        minWidth={550}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li>Item!</li>
                                <li onClick={() => { handleEditSeason(d); closePopover(); }}>Edit Season</li>
                                {/* <li onClick={() => { this.handleHideSeason(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide Season`}</li> */}
                                {!d.is_active && <li onClick={() => { handleDeleteSeason(d); closePopover(); }}>Delete Season</li>}
                            </ul>
                        )}
                    />
                </div>
            </div>
        </>
    );
};


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
});

export default connect(mapStateToProps, mapDispatchToProps)(DashSeasons2);

DashSeasons2.propTypes = {
    seasons: PropTypes.array.isRequired,
    getSeasons: PropTypes.func.isRequired,
    createSeason: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    deleteSeason: PropTypes.func.isRequired,
    updateSeason: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
};