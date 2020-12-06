import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleModal } from 'redux/actions/misc';
import { DashPageHeader, DashFilter } from '../../../components';
import { getNews, updateNewsPostOrder, updateNewsPostById, deleteNewsPost } from '../../../redux/actions/news';
import DashTable from '../DashTable';
import { useQueryParam } from '../../../components/useQueryParams';


const DashNews2 = ({ news, getNews, isLoading, location, toggleModal, updateNewsPostOrder, updateNewsPostById, deleteNewsPost, history }) => {
    const [newsPosts, setNewsPosts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useQueryParam({ getMethod: getNews });
    const showingHidden = location.search.includes('hidden');

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

    const handleHideNewsPost = (item) => {
        toggleModal({
            isVisible: true,
            isClosableOnBackgroundClick: true,
            title: `${item.hidden_date ? 'Unh' : 'H'}ide News Post`,
            message: item.hidden_date
                ? 'Are you sure you want to unhide this news post? This will cause the selected news post to be visible on the public page'
                : 'Are you sure you want to hide this news post?\nThis will hide the news post from both the admin dashboard and from the public page. You can view all hidden news posts using the filter. This does NOT delete the news post',
            fields: [],
            confirmActionTitle: `${item.hidden_date ? 'Unh' : 'H'}ide News Post`,
            confirmAction: () => updateNewsPostById({ id: item.id, newsData: { is_hidden: !!!item.hidden_date } }),
        }, 'prompt');
    };

    const handleDeleteSeason = (item) => {
        toggleModal({
            isVisible: true,
            title: 'Delete News post',
            message: 'Are you sure you want to delete this news post?\nThis cannot be undone and you will lose any information saved within this news post.\n\nPlease type in the name of the news post below to delete.',
            toBeDeleted: item,
            toBeDeletedString: item.title,
            deleteAction: () => deleteNewsPost({ id: item.id }),
        }, 'delete');
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
                isActive: location.search.length > 0,
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
                            // only show the created date if show_hidden filter isnt applied
                            ...!location.search.includes('show_hidden') && { created_date: { as: 'published date', flex: 'one', type: 'date' } },
                        }}
                        minWidth={680}
                        isLoading={[isLoading, 15]}
                        emptyTableText={location.search.length > 0 ? 'Sorry, there are no news posts within your filter criteria' : 'Sorry, no news posts have been created. Start by adding a news post above.'}
                        popoverData={(d, closePopover) => (
                            <ul>
                                <li onClick={() => { handleEditNewsPost(d); closePopover(); }}>Edit Season</li>
                                <li onClick={() => { handleHideNewsPost(d); closePopover(); }}>{`${showingHidden ? 'Unh' : 'H'}ide News Post`}</li>
                                <li onClick={() => { handleDeleteSeason(d); closePopover(); }}>Delete News Post</li>
                            </ul>
                        )}
                        draggableProps={{ onDragEnd, isDraggable: !location.search.includes('show_hidden') }}
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
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
    updateNewsPostById: (id, data) => dispatch(updateNewsPostById(id, data)),
    deleteNewsPost: id => dispatch(deleteNewsPost(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashNews2));

DashNews2.propTypes = {
    news: PropTypes.array.isRequired,
    getNews: PropTypes.func.isRequired,
    updateNewsPostOrder: PropTypes.func,
    updateNewsPostById: PropTypes.func,
    deleteNewsPost: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    toggleModal: PropTypes.func.isRequired,
    history: PropTypes.object,
};
