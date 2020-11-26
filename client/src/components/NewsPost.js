import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'date-fns/format';
import { Tag } from 'antd';


export const NewsPost = ({ post }) => {
    return (
        <div className="news-container-card">

            {/* Layout for Mobile */}
            <div className="hide-desktop">
                <div className="headline-container">
                    <h1>{post.title}</h1>
                </div>
                <div className="posted-date-container">
                    <h6 className="posted-date">{dateFormat(post.created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
                    {post.updated_date && <p className="posted-date">Updated on: {dateFormat(post.updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> }
                </div>
                <p className="posted-by">{post.first_name} {post.last_name}</p>
                {!!post.tags_in_post?.length && post.tags_in_post.map(item => <Tag key={item.id} style={{ color: 'white', background: '#E3BA4A' }}>{item.name}</Tag>)}
            </div>


            {/* Layout for Desktop */}
            <div className="hide-mobile">
                <h1>{post.title}</h1>
                <div className="posted-date-container">
                    <div>
                        <h6 className="posted-date">{dateFormat(post.created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
                        {post.updated_date && <p className="posted-date">Updated on: {dateFormat(post.updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> }
                    </div>
                    <div>
                        <p className="posted-by">{post.first_name} {post.last_name} </p>
                    </div>
                </div>
                {!!post.tags_in_post?.length && post.tags_in_post.map(item => <Tag key={item.id} style={{ color: 'white', background: '#E3BA4A' }}>{item.name}</Tag>)}
            </div>
            <hr />
            <div className="news-body" dangerouslySetInnerHTML={{ __html: post.body }} />

            {/* {allow_collapse && (
                <div className="view-more-container">
                <input type="button" value={this.state.showLess ? 'View More' : 'View Less'} className="muted" onClick={() => this.setState({showLess: !this.state.showLess})}/>
                </div>
            )} */}
        </div>
    );
};

NewsPost.propTypes = {
    post: PropTypes.object,
};
