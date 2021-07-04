import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { connect } from 'react-redux';
// import { getBanner } from '../actions/banner';

function Banner({ banner }) {
    const location = useLocation();

    useEffect(() => {
        // getBanner();
    }, []);

    // NEED TO MAKE THIS DYNAMIC FROM AN API CALL
    // CREATE API ROUTE
    return !location.pathname.includes('registration') && (
        <div style={{padding: '30px 10px 0px'}}>
            <Alert
                message="Registration open!"
                description={(
                    <>
                        Log in to register for the upcoming season <Link to="/registration">HERE</Link>
                    </>
                )}

                type="info"
                closable
                style={{padding: 20}}
            />
        </div>
    );
}

const mapState = state => ({
    banner: state.banner,
});
// const mapDispatch = { getBanner };

export default connect(mapState)(Banner);

Banner.propTypes = {
    // getBanner: PropTypes.func,
    banner: PropTypes.object,
};
