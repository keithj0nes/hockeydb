import React from 'react';
import Notification from '../../../components/Notification';
import { DashPageHeader } from '../../../components';

const DashHome = () => {
    const pageHeaderInfo = {
        title: 'Dashboard',
        hideSearchAndButtons: true,
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            {/* <Notification /> */}
        </>
    );
};

export default DashHome;
