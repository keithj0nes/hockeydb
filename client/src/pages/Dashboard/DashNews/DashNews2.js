import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DashPageHeader, DashFilter } from '../../../components';
import { getNews, updateNewsPostOrder } from '../../../redux/actions/news';
import DashTable from '../DashTable';
import { useQueryParam } from '../../../components/useQueryParams';


const DashNews2 = ({ news, getNews, isLoading, location, updateNewsPostOrder, history }) => {
    const [newsPosts, setNewsPosts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useQueryParam({ getMethod: getNews });

    if (newsPosts.length !== news.length) setNewsPosts(news);

    const setFilterDataOpenFilter = (val) => {
        const filterData = [{
            title: 'Other',
            options: [{
                title: 'Hidden News Posts',
                name: 'show_hidden',
                type: 'checkbox',
                defaultValue: filters.show_hidden || false,
            }],
        }];
        setFilteredData(filterData);
    };

    const onDragEnd = result => {
        const { destination, source } = result;
        if (!destination) return; // if dropped outside of droppable area
        if (destination.droppableId === source.droppableId && destination.index === source.index) return; // if dropped in the same spot
        const newsPostsArr = [...newsPosts];
        const [removed] = newsPostsArr.splice(source.index, 1);
        newsPostsArr.splice(destination.index, 0, removed);
        setNewsPosts(newsPostsArr);
        const { id } = removed;
        const data = { toIndex: destination.index + 1, fromIndex: source.index + 1, move: destination.index + 1 > source.index + 1 ? 'down' : 'up' };
        updateNewsPostOrder(data, id);
    };

    const handleEditNewsPost = post => {
        history.push(`${location.pathname}/${post.id}`, post);
    };

    // think about ways to pass a function to table
    // user case: date formatter to table to format date nicely

    const pageHeaderInfo = {
        title: 'News',
        searchPlaceholder: 'Search by title or content',
        onChange: () => console.log('changing placeholder text'),
        buttons: [
            {
                iconName: 'ADD_USER',
                title: 'Add News Post',
                onClick: () => history.push(`${location.pathname}/create`),
            },
            {
                iconName: 'FILTER',
                title: 'Filter News Posts',
                onClick: (val) => setFilterDataOpenFilter(val),
                popoverUI: (closeFilter) => (
                    <DashFilter
                        data={filteredData}
                        closeFilter={closeFilter}
                        filters={filters}
                        setFilters={setFilters}
                    />
                ),
            },
        ],
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            <div style={{ paddingBottom: 16 }} />

            <div className="dashboard-list-container">
                <div className="dashboard-list">
                    <DashTable
                        data={newsPosts}
                        sections={{
                            title: 'three',
                            full_name: { as: 'author', flex: 'one' },
                            created_date: { as: 'published date', flex: 'one' },
                        }}
                        minWidth={680}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no seasons within your filter criteria' : 'Sorry, no seasons have been created. Start by adding a season above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li>hi</li>
                                <li>there</li>
                                <li onClick={() => { handleEditNewsPost(d); closePopover(); }}>Edit Season</li>
                                {/* {!d.is_active && <li onClick={() => { handleHideSeason(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide Season`}</li>} */}
                                {/* {!d.is_active && <li onClick={() => { handleDeleteSeason(d); closePopover(); }}>Delete Season</li>} */}
                            </ul>
                        )}
                        draggableProps={{ onDragEnd }}
                    />
                </div>
            </div>
        </>
    );
};


const mapStateToProps = state => {
    return {
        news: state.news.news,
        newsNum: state.news.newsNum,
        isLoading: state.news.isLoading,
    };
};

const mapDispatchToProps = dispatch => ({
    getNews: filters => dispatch(getNews(filters)),
    updateNewsPostOrder: (data, id) => dispatch(updateNewsPostOrder(data, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashNews2));

DashNews2.propTypes = {
    news: PropTypes.array.isRequired,
    getNews: PropTypes.func.isRequired,
    updateNewsPostOrder: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
};
