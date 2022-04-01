import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { Drawer } from 'antd';
import { getSeasons, deleteSeason, createSeason, updateSeason } from 'redux/actions/seasons';
import { toggleModal } from 'redux/actions/misc';
// import dateFormat from 'date-fns/format';
import { DashPageHeader, DashFilter, Pagination, useQueryParam } from '../../../components';
import DashTable from '../DashTable';
import './DashSeasons.scss';
import { searchReduce } from '../../../helpers';
// import Form from '../../../components/Form';
import DashSeasonsDrawer from './DashSeasonsDrawer';

const defaultState = {
    seasonTypes: [
        { name: 'View All', value: '' },
        { name: 'Regular', value: 'Regular' },
        { name: 'Playoffs', value: 'Playoffs' },
        { name: 'Tournament', value: 'Tournament' },
    ],
    filterData: [],
};

const DashSeasons2 = ({ seasons, isLoading, location, getSeasons, toggleModal, createSeason, updateSeason, deleteSeason, paginationDetails, user }) => {
    const [state, setState] = useState(defaultState);
    const [filters, setFilters] = useQueryParam({ getMethod: getSeasons });
    const [quickMenuVisible, setQuickMenuVisible] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const showingHidden = location.search.includes('hidden');

    const setFilterDataOpenFilter = (val) => {
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
            confirmActionTitle: 'Create Season',
            confirmAction: (values) => createSeason({ seasonData: values }),
        }, 'prompt');
    };

    const handleEditSeason = (item) => {
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
            confirmActionTitle: 'Update Season',
            confirmAction: (values) => updateSeason({ id: item.id, seasonData: values }),
        }, 'prompt');
    };

    const handleHideSeason = (item) => {
        toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_at ? 'Unh' : 'H'}ide Season`,
            message: item.hidden_at
                ? 'Are you sure you want to unhide this season? This will cause the selected season to be visible on the public page'
                : 'Are you sure you want to hide this season?\nThis will hide the season from both the admin dashboard and from the public page. You can view all hidden seasons using the filter. This does NOT delete the season',
            fields: [],
            confirmActionTitle: `${item.hidden_at ? 'Unh' : 'H'}ide Season`,
            confirmAction: () => updateSeason({ id: item.id, seasonData: { is_hidden: !!!item.hidden_at } }),
        }, 'prompt');
    };

    const handleDeleteSeason = (item) => {
        toggleModal({
            isClosableOnBackgroundClick: true,
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
                onClick: handleAddSeason,
            },
            {
                iconName: 'FILTER',
                title: 'Filter Seasons',
                // isActive: location.search.length > 0,
                isActive: searchReduce(),

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


    // //////////////////////////////////// //

    // next issue: red screen error when clicking seasons
    // navigating to another page, and clicking seasons again

    // //////////////////////////////////// //

    // console.log(seasons, 'seasonssss')

    // const seasons2 = [{
    //     created_at: "2021-09-09T22:12:54.604Z",
    //     created_by: 3,
    //     id: 3,
    //     is_active: true,
    //     name: "Summer 2021",
    //     type: "Playoffs",
    //     updated_at: null,
    //     registration_is: 'open', // limited, closed
    // }]
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
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li onClick={() => { setQuickMenuVisible(true); closePopover(); setSelectedSeason(d); }}>Open Slideout</li>
                                <li onClick={() => { handleEditSeason(d); closePopover(); }}>Edit Season</li>
                                <li onClick={() => { handleEditSeason(d); closePopover(); }}>Registration</li>
                                {!d.is_active && <li onClick={() => { handleHideSeason(d); closePopover(); }}>{`${showingHidden ? 'Unhide' : 'Hide'} Season`}</li>}
                                {!d.is_active && <li onClick={() => { handleDeleteSeason(d); closePopover(); }}>Delete Season</li>}
                            </ul>
                        )}
                    />
                </div>
            </div>
            <Pagination {...paginationDetails} setFilters={setFilters} />

            {/* <Drawer
                width="360px"
                placement="right"
                maskClosable // ={true} // set to false if has been edited
                // onClick={() => setQuickMenuVisible(false)}
                onClose={() => {
                    setQuickMenuVisible(false);
                    setSelectedSeason(null);
                }}
                visible={quickMenuVisible}
            > */}
            {console.log(selectedSeason, 'selected season!')}
            <DashSeasonsDrawer
                visible={quickMenuVisible}
                selected={selectedSeason || {}}
                onClose={() => {
                    console.log('firiinggg onCLOSE')
                    setQuickMenuVisible(false);
                    setSelectedSeason(null);
                }}
            />
            {/* </Drawer> */}

            {/* <Drawer
                className="my-drawer"
                ...
                .my-drawer.ant-drawer-open {
                // width: 100% !important; // mask: false
                > .ant-drawer-content-wrapper {
                    width: 30% !important;
                }
                }

                @media (max-width: 767.98px) {
                .my-drawer.ant-drawer-open {
                    > .ant-drawer-content-wrapper {
                    width: 100% !important;
                    }
                }
                } */}


            {/* fields: [
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
            ], */}
        </>
    );
};


// const mapStateToProps = state => ({
//     seasons: state.seasons.seasons,
//     isLoading: state.seasons.isLoading,
//     paginationDetails: state.seasons.pagination,
// });

const mapStateToProps = state => {
    console.log(state.seasons)
    return {
        user: state.user.user,
        seasons: state.seasons.seasons,
        isLoading: state.seasons.isLoading,
        paginationDetails: state.seasons.pagination,
    };
};

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
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    paginationDetails: PropTypes.object,
    user: PropTypes.object,
};

// drawer styles

// <Drawer
//     className="my-drawer"
//     ...
//     .my-drawer.ant-drawer-open {
//     // width: 100% !important; // mask: false
//     > .ant-drawer-content-wrapper {
//         width: 30% !important;
//     }
//     }

//     @media (max-width: 767.98px) {
//     .my-drawer.ant-drawer-open {
//         > .ant-drawer-content-wrapper {
//         width: 100% !important;
//         }
//     }
// }
