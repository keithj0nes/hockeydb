import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createLocation, getLocations, deleteLocation, updateLocation } from '../../../redux/actions/locations';
import { DashPageHeader } from '../../../components';
import DashTable from '../DashTable';
import { toggleModal } from '../../../redux/actions/misc';

const DashLocations2 = ({ getLocations, locations, isLoading, location, toggleModal, createLocation, updateLocation, deleteLocation }) => {
    // DashLocations is not using any filtering state
    useEffect(() => {
        getLocations();
    }, [getLocations]);

    const handleAddLocation = () => {
        toggleModal({
            isVisible: true,
            title: 'Add Location',
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
                    title: 'Address',
                    type: 'input',
                    name: 'address',
                    defaultValue: null,
                    rules: [{ required: true }],
                },
            ],
            confirmActionTitle: 'Create Location',
            confirmAction: (values) => createLocation({ locationData: values }),
        }, 'prompt');
    };

    const handleEditLocation = (item) => {
        toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: false,
            title: 'Edit Location',
            fields: [
                {
                    title: 'Name',
                    type: 'input',
                    name: 'name',
                    defaultValue: item.name,
                    rules: [{ required: true }],
                },
                {
                    title: 'Address',
                    type: 'input',
                    name: 'address',
                    defaultValue: item.address,
                    rules: [{ required: true }],
                },
            ],
            confirmActionTitle: 'Update Season',
            confirmAction: (values) => updateLocation({ id: item.id, locationData: values }),
        }, 'prompt');
    };

    const handleDeleteLocation = (item) => {
        toggleModal({
            isVisible: true,
            title: 'Delete Location',
            message: 'Are you sure you want to delete this location?\nThis cannot be undone - current games with this location will not be effected.\n\nPlease type in the name of the location below to delete.',
            toBeDeleted: item,
            deleteAction: () => deleteLocation({ id: item.id }),
        }, 'delete');
    };


    const pageHeaderInfo = {
        title: 'Locations',
        searchPlaceholder: 'Search by location name or address',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add Location',
                onClick: handleAddLocation,
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
                        data={locations}
                        sections={{ name: 'two', address: 'three' }}
                        minWidth={660}
                        isLoading={isLoading}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no locations within your filter criteria' : 'Sorry, no locations have been created. Start by adding a location above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li onClick={() => { handleEditLocation(d); closePopover(); }}>Edit Location</li>
                                <li onClick={() => { handleDeleteLocation(d); closePopover(); }}>Delete Location</li>
                            </ul>
                        )}
                    />
                </div>
            </div>
        </>
    );
};


const mapStateToProps = state => ({
    locations: state.locations.locations,
    isLoading: state.locations.isLoading,
});

const mapDispatchToProps = dispatch => ({
    createLocation: (name, address) => dispatch(createLocation(name, address)),
    getLocations: () => dispatch(getLocations()),
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    deleteLocation: id => dispatch(deleteLocation(id)),
    updateLocation: (id, data) => dispatch(updateLocation(id, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashLocations2));

DashLocations2.propTypes = {
    getLocations: PropTypes.func.isRequired,
    createLocation: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired,
    updateLocation: PropTypes.func.isRequired,
    locations: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
};
