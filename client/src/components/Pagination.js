/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as AntPagination } from 'antd';

const Pagination = ({ onChange, total, pageSize, defaultCurrent, ...props }) => {
    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg></a>;
        }

        if (type === 'next') {
            return <a><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>;
        }

        if (type === 'jump-prev') {
            return <a><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg></a>;
        }

        if (type === 'jump-next') {
            return <a><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></a>;
        }

        return originalElement;
    };

    return (
        <AntPagination
            total={total}
            pageSize={pageSize}
            hideOnSinglePage
            showSizeChanger={false}
            defaultCurrent={defaultCurrent}
            onChange={onChange}
            itemRender={itemRender}
            {...props}
        />
    );
};

export default Pagination;

Pagination.defaultProps = {
    pageSize: 100,
    defaultCurrent: 1,
};

Pagination.propTypes = {
    onChange: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number,
    defaultCurrent: PropTypes.number,
};
