import React from 'react';
import { DashPageHeader, DashFilter, Pagination, useQueryParam } from '../../../components';

const DashProfile = (props) => {
    const pageHeaderInfo = {
        title: 'My Profile',
        hideSearchAndButtons: true,
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
            <div style={{ paddingBottom: 16 }} />
            <h2>Profile</h2>
        </>
    );
};

export default DashProfile;
