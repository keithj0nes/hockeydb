import React from 'react';
import PropTypes from 'prop-types';
import { ICONS } from 'assets/ICONS';

export const Icon = props => {

    if(!props.name) return null;

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
            case 'rect':
                return <rect {...props.name[type]} />
            case 'line':
                return <line {...props.name[type]} />
            default:
                break;
        }
    }


    const XrenderSVG = (type) => {

        // console.log(type, 'TYPE')
        switch (type) {
            case 'circle':
                return <circle {...ICONS[props.name][type]} />
            case 'path':
                return ICONS[props.name][type].map(r => <path style={styles.path} key={r} d={r} />)
            case 'rect':
                return <rect {...ICONS[props.name][type]} />
            case 'line':
                return <line {...ICONS[props.name][type]} />
            default:
                break;
        }
    }

    if(props.x) {
        // console.log('props.x', props.name)

        // console.log(Object.keys(ICONS[props.name]))
        // console.log(ICONS[props.name])

        return (
            <svg
                style={styles.svg}
                width={`${props.size}px`}
                height={`${props.size}px`}
                // viewBox="0 0 1024 1024"
                viewBox="0 0 16 16"
            >

                {props.name && Array.isArray(ICONS[props.name]) ? (
                    ICONS[props.name].map(i => <path style={styles.path} key={i} d={i}/> )
                ) : (
                    Object.keys(ICONS[props.name]).map(item => {
                        return (
                            <React.Fragment key={item}>
                                {XrenderSVG(item)}
                            </React.Fragment> 
                        )
                    })
                )}
            </svg>
        )
    }

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
