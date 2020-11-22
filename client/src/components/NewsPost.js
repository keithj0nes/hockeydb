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
                    {/* {post.tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> } */}
                </div>
                <div className="posted-date-container">
                    <h6 className="posted-date">{dateFormat(post.created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
                    {/* <p className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</p> */}
                    {/* {updated_date && <p className="posted-date">Updated on: {dateFormat(updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> } */}
                </div>
                {/* <p className="posted-by">Johnny Smith</p> */}
                <p className="posted-by">{post.first_name} {post.last_name}</p>

                {!!post.tags?.length && post.tags.map(item => <Tag key={item} style={{ color: 'white', background: '#E3BA4A' }}>{item}</Tag>)}
            </div>


            {/* Layout for Desktop */}
            <div className="hide-mobile">
                <h1>{post.title}</h1>
                <div className="posted-date-container">
                    <div>
                        <h6 className="posted-date">{dateFormat(new Date(), 'MM/DD/YYYY | hh:mm a')}</h6>
                        {/* <h6 className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6> */}
                    </div>
                    <div>
                        {/* {!!post.tags?.length && <div className="tag" style={{background: '#E3BA4A'}}> </div> } */}
                        {/* <p className="posted-by">Johnny Smith</p> */}
                        {/* <p className="posted-by">{post.created_by}</p> */}
                        <p className="posted-by">{post.first_name} {post.last_name} </p>


                    </div>
                </div>
                {!!post.tags?.length && post.tags.map(item => <Tag key={item} style={{ color: 'white', background: '#E3BA4A' }}>{item}</Tag>)}
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
