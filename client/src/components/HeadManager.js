import React from 'react';
import { Helmet } from 'react-helmet';
import league_logo from 'assets/icons/league_logo.svg';
import { Site_Name_Full } from 'assets/resourceStrings';

const HeadManager = () => {
  return (
    <Helmet>
      <title>{Site_Name_Full}</title>
      <link rel="shortcut icon" href={league_logo} type="image/svg+xml" />
    </Helmet>
  );
};

export default HeadManager;
