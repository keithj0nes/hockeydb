import React from 'react';

const TableLoader = ({count = 5, format}) => {
    return Array(count).fill().map( (_, idx) => {
        return (
            <div className="ot-row" key={idx}>
                {format.map((flexNum, fidx) => (
                    <p key={fidx} className={`ot-cell ot-flex-${flexNum} shimmer`}></p>
                ))}
            </div>
        )
    })
}

export default TableLoader