import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { closeSnackBar } from '../redux/actions/misc';


const Notification = ({ isVisible, message, type }) => {
    const openNotification = () => {
        const options = {
            message: type.charAt(0).toUpperCase() + type.slice(1),
            description: message,
            onClick: () => {
                console.log('Notification Clicked!');
            },
            placement: 'topRight',
            duration: type === 'error' ? 0 : undefined,
        };

        switch (type) {
        case 'error':
            return notification.error(options);
        case 'alert':
            return notification.info(options);
        case 'success':
            return notification.success(options);
        case 'warning':
            return notification.success(options);
        default:
            return notification.open(options);
        }
    };

    if (isVisible) {
        openNotification();
    }

    return null;
};

const mapStateToProps = state => ({
    isVisible: state.misc.snackBar.isVisible,
    message: state.misc.snackBar.message,
    type: state.misc.snackBar.type,
});

const mapDispatchToProps = dispatch => ({
    closeSnackBar: () => dispatch(closeSnackBar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

Notification.propTypes = {
    isVisible: PropTypes.bool,
    closeSnackBar: PropTypes.func,
    message: PropTypes.string,
    type: PropTypes.oneOf(['', 'error', 'alert', 'success', 'warning']),
};
