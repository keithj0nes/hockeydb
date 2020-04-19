import React, { Component } from 'react'
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import { getNews } from '../../../redux/actions/news';

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

          // console.log(item, 'item!')

          // const view = item.open ? 'View More' : 'View Less'

          // const view = 'View More'

          // console.log(view, 'view!')
          // const icon = item.tag ? '!' : '';
          return (
            <NewsPost key={item.id} newsPost={item} />
          )            
        })}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    news: state.news.news
  };
};



const mapDispatchToProps = dispatch => ({
  getNews: () => dispatch(getNews())
})

export default connect(mapStateToProps, mapDispatchToProps)(News);





class NewsPost extends Component {

  state = {
    showLess: true
  }

  render() {

    const { title, tag, created_date, updated_date, first_name, last_name, body, allow_collapse } = this.props.newsPost

    // this will change to an actual icon
    const icon = tag ? '!' : '';

    return (
      <div className="news-container-card">

      {/* Layout for Mobile */}
        <div className="hide-desktop">
          <div className="headline-container">
            <h1>{title}</h1>
            {/* <h1>This will be the headline of the article</h1> */}
            {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
          </div>
          <div className="posted-date-container">
            <h6 className="posted-date">{dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
            {/* <p className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</p> */}
            {updated_date && <p className="posted-date">Updated on: {dateFormat(updated_date, 'MM/DD/YYYY hh:mm:ss')}</p> }
          </div>
          <p className="posted-by">{first_name} {last_name} </p>
        </div>


      {/* Layout for Desktop */}
        <div className="hide-mobile">
          <h1>{title}</h1>
          <div className="posted-date-container">
            <div>
              <h6 className="posted-date">{dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
              <h6 className="posted-date">Updated on: {dateFormat(created_date, 'MM/DD/YYYY | hh:mm a')}</h6>
            </div>
            <div>
              {tag && <div className="tag" style={{background: '#E3BA4A'}}>{icon} <span className="hide-mobile">&nbsp;{tag}</span></div> }
              <p className="posted-by">{first_name} {last_name} </p>
            </div>
          </div>
        </div>
        
        <hr />

        <div className={`news-body ${!allow_collapse && this.state.showLess && 'show-less'}`} dangerouslySetInnerHTML={{ __html: body }}></div>

        {/* {allow_collapse && (
          <div className="view-more-container">
            <input type="button" value={this.state.showLess ? 'View More' : 'View Less'} className="muted" onClick={() => this.setState({showLess: !this.state.showLess})}/>
          </div>
        )} */}
      </div>
    )
  }
}