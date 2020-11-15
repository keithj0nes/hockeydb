import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import league_logo from 'assets/icons/league_logo.svg';
import { Site_Name_Short } from 'assets/resourceStrings';

const HeadManager = ({ subTitle }) => (
    <Helmet>
        <title>{Site_Name_Short} {subTitle ? `- ${subTitle}` : ''}</title>
        <link rel="shortcut icon" href={league_logo} type="image/svg+xml" />
    </Helmet>
);

export default HeadManager;

HeadManager.propTypes = {
    subTitle: PropTypes.string,
};
