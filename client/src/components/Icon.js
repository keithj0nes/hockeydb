import React from 'react';
import PropTypes from 'prop-types';

const Icon = props => {
    const styles = {
        svg: {
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        path: {
            fill: props.color,
        },
    };

    return (
        <svg
            style={styles.svg}
            width={`${props.size}px`}
            height={`${props.size}px`}
            // viewBox="0 0 1024 1024"
            viewBox="0 0 16 16"
        >
            { props.name && typeof props.name !== 'string' ? (
                props.name.map(i => <path style={styles.path} key={i} d={i}/> )
            ) : (
                <path style={styles.path} d={props.name}></path>
            )}
        </svg>
    );
};

Icon.propTypes = {
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),    
    size: PropTypes.number,
    color: PropTypes.string,
};

Icon.defaultProps = {
    size: 16,
};

export default Icon;