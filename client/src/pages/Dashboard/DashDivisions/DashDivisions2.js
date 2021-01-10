import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'query-string';
import { getDivisions, createDivision, updateDivision, deleteDivision } from 'redux/actions/divisions';
import { toggleModal } from 'redux/actions/misc';
import { DashPageHeader, useQueryParam, DashFilter } from '../../../components';
import DashTable from '../DashTable';

const DashDivisions2 = ({ divisions, getDivisions, createDivision, updateDivision, deleteDivision, isLoading, location, currentSeason, toggleModal, seasons }) => {
    const [state, setState] = useState({});
    const [filters, setFilters] = useQueryParam({ getMethod: getDivisions });
    const showingHidden = location.search.includes('hidden');

    const setFilterDataOpenFilter = () => {
        const filterData = [{
            title: 'Season',
            options: [{
                type: 'select',
                name: 'season',
                defaultValue: filters.season,
                listOfSelects: seasons,
                hiddenValue: 'Select a type',
                useKey: 'name',
            }],
        }, {
            title: 'Other',
            options: [{
                title: 'Hidden Divisions',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: filters.show_hidden || false,
            }],
        }];
        setState({ ...state, filterData });
    };

    const handleAddDivision = () => {
        const defaultSeason = Object.keys(qs.parse(location.search)).length > 0 ? qs.parse(location.search).season : currentSeason.name;
        toggleModal({
            isVisible: true,
            title: 'Add Divison',
            isClosableOnBackgroundClick: false,
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
                {
                    title: 'Season',
                    type: 'input',
                    name: 'season',
                    disabled: true,
                    defaultValue: defaultSeason,
                    rules: [{ required: true }],
                },
            ],
            confirmActionTitle: 'Create Division',
            confirmAction: (values) => createDivision({ divisionData: values }),
        }, 'prompt');
    };

    const handleEditDivision = (item) => {
        const defaultSeason = Object.keys(qs.parse(location.search)).length > 0 ? qs.parse(location.search).season : currentSeason.name;
        toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Division',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name,
                    rules: [{ required: true }],
                },
                {
                    title: 'Season',
                    type: 'input',
                    name: 'season',
                    disabled: true,
                    defaultValue: defaultSeason,
                    rules: [{ required: true }],
                },
            ],
            confirmActionTitle: 'Update Division',
            confirmAction: (values) => updateDivision({ id: item.id, divisionData: values }),
        }, 'prompt');
    };

    const handleHideDivision = (item) => {
        toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_date ? 'Unh' : 'H'}ide Division`,
            message: item.hidden_date
                ? 'Are you sure you want to unhide this division? This will cause the selected division to be visible on the public page'
                : 'Are you sure you want to hide this division?\nThis will hide the division from both the admin dashboard and from the public page. You can view all hidden divisions using the filter. This does NOT delete the division',
            fields: [],
            confirmActionTitle: `${item.hidden_date ? 'Unh' : 'H'}ide Division`,
            confirmAction: () => updateDivision({ id: item.id, divisionData: { is_hidden: !!!item.hidden_date } }),
        }, 'prompt');
    };

    const handleDeleteDivision = (item) => {
        toggleModal({
            isClosableOnBackgroundClick: true,
            isVisible: true,
            title: 'Delete Division',
            message: 'Are you sure you want to delete this division?\nThis cannot be undone and you will lose any information saved within this division.\n\nPlease type in the name of the division below to delete.',
            toBeDeleted: item,
            deleteAction: () => deleteDivision({ id: item.id }),
        }, 'delete');
    };


    const pageHeaderInfo = {
        title: 'Divisions',
        searchPlaceholder: 'Search by division name',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add Division',
                onClick: handleAddDivision,
            },
            {
                iconName: 'FILTER',
                title: 'Filter Divisions',
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

    console.log(divisions)

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
            <div style={{ paddingBottom: 16 }} />

            <div className="dashboard-list-container">
                <div className="dashboard-list">

                    <DashTable
                        data={divisions}
                        sections={{ name: 'one', teams_count: { flex: 'one', as: 'teams' } }}
                        minWidth={350}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no divisions within your filter criteria' : 'Sorry, no divisions have been created. Start by adding a division above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li onClick={() => { handleEditDivision(d); closePopover(); }}>Edit Division</li>
                                <li onClick={() => { handleHideDivision(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide Division`}</li>
                                <li onClick={() => { handleDeleteDivision(d); closePopover(); }}>Delete Division</li>
                            </ul> 
                        )}
                    />
                </div>
            </div>
        </>
    );
};

// const mapStateToProps = state => ({
//     divisions: state.divisions.divisions,
//     isLoading: state.divisions.isLoading,
//     seasons: state.seasons.seasons,
//     currentSeason: state.seasons.currentSeason,
// });

const mapStateToProps = state => {
    // console.log(state.seasons)
    return {
        divisions: state.divisions.divisions,
        isLoading: state.divisions.isLoading,
        seasons: state.seasons.seasons,
        currentSeason: state.seasons.currentSeason,
    };
};

const mapDispatchToProps = dispatch => ({
    getDivisions: filters => dispatch(getDivisions(filters)),
    createDivision: (name) => dispatch(createDivision(name)),
    deleteDivision: (id, seasonName) => dispatch(deleteDivision(id, seasonName)),
    updateDivision: (id, data) => dispatch(updateDivision(id, data)),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashDivisions2);

DashDivisions2.propTypes = {
    divisions: PropTypes.array,
    getDivisions: PropTypes.func,
    createDivision: PropTypes.func,
    toggleModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    currentSeason: PropTypes.object,
    updateDivision: PropTypes.func,
    deleteDivision: PropTypes.func,
};
