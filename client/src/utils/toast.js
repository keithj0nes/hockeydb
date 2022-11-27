import { notification as antNotification } from 'antd';

const optionConstants = {
    error: {
        message: 'Something went wrong',
        className: 'border-l-4 border-red-500',
        duration: 0,
    },
    success: {
        message: 'Success',
        className: 'border-l-4 border-green-500',
    },
    info: {
        message: 'Info',
        className: 'border-l-4 border-blue-500',
    },
};

export const toast = (notification, message) => {
    const options = {
        // message: 'Error',
        description: message,
        // onClick: () => {
        //     console.log('Notification Clicked!');
        // },
        placement: 'topRight',
        duration: notification.duration || 4,
        ...optionConstants[notification.status || 'info'],
    };
    antNotification.open(options);
};
