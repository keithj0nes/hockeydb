import React from 'react';
import { Helmet } from 'react-helmet';

const HeadManager = () => {
  return (
    <Helmet>
      <title>Play Maker League</title>
      <link id="favicon" rel="icon" href="../assets/icons/league_logo.svg" type="image/svg+xml" />
    </Helmet>
  );
};

export default HeadManager;
