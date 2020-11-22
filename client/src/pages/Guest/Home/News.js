import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNews } from '../../../redux/actions/news';
import { NewsPost } from '../../../components';
import './news.scss';

const News = ({ getNews, news }) => {
    useEffect(() => {
        getNews();
    }, [getNews]);

    return (
        <div className="news-container">
            {news.map(item => (
                <NewsPost key={item.id} post={item} />
            ))}
        </div>
    );
};

const mapStateToProps = state => ({
    news: state.news.news,
});


const mapDispatchToProps = dispatch => ({
    getNews: () => dispatch(getNews()),
});

export default connect(mapStateToProps, mapDispatchToProps)(News);


News.propTypes = {
    getNews: PropTypes.func,
    news: PropTypes.array,

};


// class NewsPost extends Component {

//   state = {
//     showLess: true
//   }

//   render() {

//     const { title, tag, created_date, updated_date, first_name, last_name, body, allow_collapse } = this.props.newsPost

//     // this will change to an actual icon
//     const icon = tag ? '!' : '';

//     return (
//       <div className="news-container-card">

//       {/* Layout for Mobile */}
//         <div className="hide-desktop">
//           <div className="headline-container">
//             <h1>{title}</h1>
//             {/* <h1>This will be the headline of the article</h1> */}
//             {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
//           </div>
//           <div className="posted-date-container">
//             <h6 className="posted-date">{dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
//             {/* <p className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</p> */}
//             {updated_date && <p className="posted-date">Updated on: {dateFormat(updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> }
//           </div>
//           <p className="posted-by">{first_name} {last_name} </p>
//         </div>


//       {/* Layout for Desktop */}
//         <div className="hide-mobile">
//           <h1>{title}</h1>
//           <div className="posted-date-container">
//             <div>
//               <h6 className="posted-date">{dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
//               <h6 className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
//             </div>
//             <div>
//               {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
//               <p className="posted-by">{first_name} {last_name} </p>
//             </div>
//           </div>
//         </div>

//         <hr />

//         <div className={`news-body ${!allow_collapse && this.state.showLess && 'show-less'}`} dangerouslySetInnerHTML={{ __html: body }}></div>

//         {/* {allow_collapse && (
//           <div className="view-more-container">
//             <input type="button" value={this.state.showLess ? 'View More' : 'View Less'} className="muted" onClick={() => this.setState({showLess: !this.state.showLess})}/>
//           </div>
//         )} */}
//       </div>
//     )
//   }
// }
