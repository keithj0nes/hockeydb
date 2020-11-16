import React from 'react';
import { DashPageHeader } from '../../../components';

const DashHome = () => {
    const pageHeaderInfo = {
        title: 'Dashboard',
        hideSearchAndButtons: true,
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
        </>
    );
};

export default DashHome;
