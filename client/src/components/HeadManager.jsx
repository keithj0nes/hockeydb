import React from 'react';
import { Helmet } from 'react-helmet';
import league_logo from '../assets/icons/league_logo.svg';

const HeadManager = () => {
  return (
    <Helmet>
      <title>Play Maker League</title>
      <link rel="shortcut icon" href={league_logo} type="image/svg+xml" />
    </Helmet>
  );
};

export default HeadManager;
