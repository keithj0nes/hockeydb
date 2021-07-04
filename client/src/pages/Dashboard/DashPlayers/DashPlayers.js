import React from 'react';
import { DashPageHeader, Banner } from '../../../components';


const DashPlayers = () => {
    const pageHeaderInfo = {
        title: 'Players',
        hideSearchAndButtons: true,
    };
    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
            <Banner />
            <h1>DASH PLAYERS COMPONENT</h1>
        </>
    );
};

export default DashPlayers;
