import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getNews } from '../../redux/actions/news';
import dateFormat from 'date-fns/format';

import './news.scss';

export class News extends Component {
  componentDidMount() {
    this.props.getNews();
  }

  render() {
    return (
      <div className="news-container">
        {this.props.news.map(item => {

          // item.tag = 'IMPORTANT';
          // item.allow_collapse = true;

          const icon = item.tag ? '!' : '';
          return (
            <div key={item.id} className="news-container-card">

              <div className="headline-container">
                <h1>{item.title}</h1>
                {item.tag && <div className="tag" style={{background: '#e1ad01'}}>{icon} <span className="hide-mobile">&nbsp;{item.tag}</span></div> }
                {/* <div className="hide-mobile">HELLO</div> */}
              </div>

              <p className="posted-date">{dateFormat(item.created_date, 'MM/DD/YYYY | hh:mm a')}</p>

              {item.updated_date && <p className="posted-date">Updated on: {dateFormat(item.updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> }

              <p className="posted-by">{item.first_name} {item.last_name} </p>

              <hr />

              <div dangerouslySetInnerHTML={{ __html: item.body }}></div>

              {/* <button>View more</button> */}

              {item.allow_collapse && (
                <div className="view-more-container">
                  <input type="button" value="View More" />
                </div>
              )}
            </div>
          )            
        })}
      </div>
    )
  }
}
const mapStateToProps = state => {
  console.log(state, "our state in news");

  return {
    news: state.news.news
  };
};



const mapDispatchToProps = dispatch => ({
  getNews: () => dispatch(getNews())
})

export default connect(mapStateToProps, mapDispatchToProps)(News);