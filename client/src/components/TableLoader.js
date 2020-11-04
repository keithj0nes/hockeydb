/* eslint-disable react/no-array-index-key */
import React from 'react';

const TableLoader = ({ count = 5, format }) => Array(count).fill().map((_, idx) => (
    <div className="ot-row" key={idx}>
        {format.map((flexNum, fidx) => (
            <p key={fidx} className={`ot-cell ot-flex-${flexNum} shimmer`} />
        ))}
    </div>
));

export default TableLoader;
