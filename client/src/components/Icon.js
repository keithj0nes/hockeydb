import React from 'react';
import PropTypes from 'prop-types';

export const Icon = props => {
    const styles = {
        svg: {
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        path: {
            fill: props.color,
        },
    };

    const renderSVG = (type) => {
        switch (type) {
            case 'circle':
                return <circle {...props.name[type]} />
            case 'path':
                return props.name[type].map(r => <path style={styles.path} key={r} d={r} />)
            default:
                break;
        }
    }

    if(!props.name) return null;
    return (
        <svg
            style={styles.svg}
            width={`${props.size}px`}
            height={`${props.size}px`}
            // viewBox="0 0 1024 1024"
            viewBox="0 0 16 16"
        >
            { props.name && Array.isArray(props.name) ? (
                props.name.map(i => <path style={styles.path} key={i} d={i}/> )
            ) : typeof props.name !== 'string' ? (
                Object.keys(props.name).map(item => {
                    return (
                        <React.Fragment key={item}>
                            {renderSVG(item)}
                        </React.Fragment> 
                    )
                })
            ) : (
                <path style={styles.path} d={props.name}></path>
            )}
        </svg>
    );
};

Icon.propTypes = {
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array, 
        PropTypes.object
    ]),    
    size: PropTypes.number,
    color: PropTypes.string,
};

Icon.defaultProps = {
    size: 16,
};
