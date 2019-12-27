import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getBlogs } from '../../redux/actions/blogActions';
import dateFormat from 'date-fns/format';

export class Blog extends Component {
  componentDidMount() {
    this.props.getBlogs();
  }

  render() {
    return (
      <div>
        <h1>blog</h1>
        {this.props.blogs.map(item => (
          <div key={item.id}>
            <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
            <p>Posted by: {item.first_name} {item.last_name} </p>
            <p>Created: {dateFormat(item.created_date, 'MM/DD/YYYY hh:mm:ss')}</p>
          </div>
        ))}
      </div>
    )
  }
}
const mapStateToProps = state => {
  console.log(state, "our state in blogs🈯️");

  return {
    blogs: state.blogs.blogs
  };
};



const mapDispatchToProps = dispatch => ({
  getBlogs: () => dispatch(getBlogs())
})

export default connect(mapStateToProps, mapDispatchToProps)(Blog);