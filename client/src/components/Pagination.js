import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { Icon } from './';
// import { ICONS } from 'assets/ICONS.js';
import qs from 'query-string';
import { history } from 'helpers';
import './pagination.scss';

// const initialState = {
//     totalPages: 5,
//     currentPage: 1
// }

const [LEFT_PAGE, RIGHT_PAGE] = ['left', 'right'];

const Pagination = (props) => {
    // const [ pages,  setPages ] = useState(initialState)
    const [pages, setPages] = useState({ ...props });


    const changePage = dir => {
        const { currentPage, totalPages } = pages;
        let search;
        if (dir === 'prev' && currentPage === 1) return;
        if (dir === 'next' && currentPage === totalPages) return;

        if (typeof dir === 'number') {
            search = qs.stringify({ page: dir });
            setPages({ ...pages, currentPage: dir });
        }

        if (dir === 'prev' && currentPage > 1) {
            search = qs.stringify({ page: currentPage - 1 });

            setPages({ ...pages, currentPage: currentPage - 1 });
        }

        if (dir === 'next' && currentPage < totalPages) {
            search = qs.stringify({ page: currentPage + 1 });
            setPages({ ...pages, currentPage: currentPage + 1 });
        }

        history.push({ search });
    };

    const getPageNumbers = () => {
        // totalPages: 10,
        // currentPage: 1,
        // neighbors: 1,
        // limit: 30,


        const { totalPages, currentPage, neighbors } = pages;


        const totalNumbers = (neighbors * 2) + 3;
        const totalBlocks = totalNumbers + 2;


        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - neighbors);
            const endPage = Math.min(totalPages - 1, currentPage + neighbors);

            let localPages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (localPages.length + 1);


            switch (true) {
            // handle: (1) < {5 6} [7] {8 9} (10)
            case (hasLeftSpill && !hasRightSpill): {
                const extraPages = range(startPage - spillOffset, startPage - 1);
                localPages = [LEFT_PAGE, ...extraPages, ...localPages];
                // localPages = [LEFT_PAGE, ...extraPages, ...localPages];

                break;
            }

            // handle: (1) {2 3} [4] {5 6} > (10)
            case (!hasLeftSpill && hasRightSpill): {
                const extraPages = range(endPage + 1, endPage + spillOffset);
                localPages = [...localPages, ...extraPages, RIGHT_PAGE];
                break;
            }

            // handle: (1) < {4 5} [6] {7 8} > (10)
            case (hasLeftSpill && hasRightSpill):
            default: {
                // localPages = [LEFT_PAGE, ...localPages, RIGHT_PAGE];
                localPages = [LEFT_PAGE, ...localPages, RIGHT_PAGE];
                break;
            }
            }

            return [1, ...localPages, totalPages];
        }


        return range(1, totalPages);
    };

    // console.log(pages, 'PAGES')

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-full-width">
            <div className="pagination-container">

                {/* <div style={{background: 'pink', display: 'flex'}}>
                    <Icon name={ICONS.ARROW_LEFT} size={50} />

                    <Icon name={ICONS.ARROW_RIGHT} />

                </div> */}

                <span className={`left ${pages.currentPage === 1 && 'disabled'}`} onClick={() => changePage('prev')} />

                {/* {Array(pages.totalPages).fill().map((_, i) => {
                    return (
                        <span
                            onClick={() => setPages({...pages, currentPage: i + 1})}
                            className={i + 1 === pages.currentPage && 'current-page'}>
                                {i + 1}
                        </span>
                    )
                })} */}

                {
                    pageNumbers.map((page, index) => {
                        // console.log(page, 'page!!')

                        // if (page === LEFT_PAGE) return (
                        //     <span key={index} className="page-item">
                        //       {/* <a className="page-link" href="#" aria-label="Previous" onClick={this.handleMoveLeft}> */}
                        //         {/* <span aria-hidden="true">&laquo;</span> */}
                        //         <span className="sr-only">Previous</span>
                        //       {/* </a> */}
                        //     </span>
                        //   );

                        //   if (page === RIGHT_PAGE) return (
                        //     <span key={index} className="page-item">
                        //       {/* <a className="page-link" href="#" aria-label="Next" onClick={this.handleMoveRight}> */}
                        //         {/* <span aria-hidden="true">&raquo;</span> */}
                        //         <span className="sr-only">Next</span>
                        //       {/* </a> */}
                        //     </span>
                        //   );

                        if (page === LEFT_PAGE || page === RIGHT_PAGE) {
                            return (
                            // <span key={index} style={{pointer: 'cursor', color: 'black', padding: 0, display: 'flex', alignItems: 'flex-end'}}>
                                <span key={index} style={{ pointer: 'cursor', color: 'black', padding: '0 8px', display: 'flex', alignItems: 'flex-end' }}>

                                    {/* <a className="page-link" href="#" aria-label="Previous" onClick={this.handleMoveLeft}> */}
                                    {/* <span aria-hidden="true">&laquo;</span> */}
                                    {/* <span className="sr-only" style={{pointer: 'cursor'}}>...</span> */}

                                    ...
                                    {/* </a> */}
                                </span>
                            );
                        }

                        return (
                            <span key={index} className={`page-item${pages.currentPage === page ? ' current-page' : ''}`} onClick={() => changePage(page)}>
                                {/* <a className="page-link" href="#" onClick={ this.handleClick(page) }>{ page }</a> */}
                                { page }
                            </span>
                        );
                    })
                }

                <span className={`right ${pages.currentPage === pages.totalPages && 'disabled'}`} onClick={() => changePage('next')} />

            </div>
        </div>

    );
};


const range = (from, to, step = 1) => {
    const range = [];
    while (from <= to) {
        range.push(from);
        from += step;
    }

    return range;
};

// Pagination.defaultProps = {
//     totalPages: 1,
//     currentPage: 1,
//     limit: 20,
//     neighbors: 1,
//     onPageChange: () => alert('onPageChange function not defined')
// }

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    limit: PropTypes.number,
    neighbors: PropTypes.oneOf([0, 1, 2]),
    onPageChange: PropTypes.func,
};

export default Pagination;
