import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dateFormat from 'date-fns/format';
import { Button, DashPageHeader } from '../../../components';
import { createNewsPost, getNewsPostById, updateNewsPostById } from '../../../redux/actions/news';
import './dashnews.scss';
import DashNewsCreate2 from './DashNewsCreate2';


const tags = [
    { name: 'IMPORTANT', icon: '!' },
    { name: 'ALERT', icon: '!i!' },
];

const initialState = {
    title: '',
    body: '',
    allow_collapse: false,
    tag: '',

    created_date: '',
    first_name: '',
    last_name: '',
    edited_date: '',
    edited_first_name: '',
    edited_last_name: '',

    isEditing: false,
};


export class DashBlogs extends Component {
  state = initialState;

  quillModules = {
      toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          // ['link', 'image'],
          ['clean'],
      ],
      imageHandler: this.imageHandler,
  }

  quillFormats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image',
  ]

  componentDidMount() {
      console.log(this.props, 'props in create');

      if (this.props.match.params.id === 'create') {
          return console.log('create, exiting did mount');
      }
      if (this.props.match.params.id !== 'create' && !this.props.location.state) {
          this.props.getNewsPostById(this.props.match.params.id);
          return console.log('GETTING BY ID!!');
      }

      const { title, allow_collapse, tag, body, created_date, first_name, last_name } = this.props.location.state;

      this.setState({
          title, allow_collapse, tag, body, created_date, first_name, last_name, isEditing: true,
      });
  }

  static getDerivedStateFromProps(props, state) {
      if (Object.keys(props.newsById).length > 0) {
          const { title, allow_collapse, tag, body, created_date, first_name, last_name } = props.newsById;
          console.log('GETTING FROM NEWSBYID!!!');
          return {
              title, allow_collapse, tag, body, created_date, first_name, last_name, isEditing: true,
          };
      }
      return null;
  }


  // imageHandler = (image, callback) => {
  //   var IMGUR_CLIENT_ID = 'bcab3ce060640ba';
  //   var IMGUR_API_URL = 'https://api.imgur.com/3/image';
  //   var data = new FormData();
  //   data.append('image', image);

  //   var xhr = new XMLHttpRequest();
  //   xhr.open('POST', IMGUR_API_URL, true);
  //   xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       var response = JSON.parse(xhr.responseText);
  //       if (response.status === 200 && response.success) {
  //         callback(response.data.link);
  //       } else {
  //         var reader = new FileReader();
  //         reader.onload = function (e) {
  //           callback(e.target.result);
  //         };
  //         reader.readAsDataURL(image);
  //       }
  //     }
  //   }
  //   xhr.send(data);
  // }

  // handleChange = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  //   console.log(this.state.message);

  // }
  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.newBlogPost(this.state.message)
  // }

  handleQuillChange = body => {
      this.setState({ body });
      // console.log(this.state.text);
  }

  handleQuillSubmit = () => {
      // console.log(this.state, 'right herrr')
      if (this.state.isEditing) {
          this.props.updateNewsPostById(this.state, this.props.match.params.id);
      } else {
          this.props.createNewsPost(this.state);
      }

      return this.props.history.push('/dashboard/news');
      // this.props.match.params.id === 'create' && this.setState(initialState);
  }

  handleChange = e => {
      this.setState({ [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  }

  handleGoBack = () => {
      // this.props.history.push('/dashboard/news');
      this.props.history.goBack();
      // this.props.history.push(`${this.props.location.pathname}/create`);
  }

  render() {
      const { isEditing } = this.state;
      const pageHeaderInfo = {
          title: `News - ${this.state.title}`,
          hideSearchAndButtons: true,
      };

      return (

          <>

              <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
              <div className="dashboard-filter-header">
                  <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button title="Back to News" onClick={this.handleGoBack} />
                      </div>
                  </div>
              </div>
              <div className="dashnews-container">
                  <h1>{isEditing ? 'Edit' : 'Create'} News Post</h1>
                  <br />
                  {isEditing && (
                      <>
                          <p> Created By: {this.state.first_name} {this.state.last_name}</p>
                          <p> Created Date: {dateFormat(this.state.created_date, 'MM/DD/YYYY h:mmA')}</p>
                      </>
                  )}
                  <br />

                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} />

                  <br />
                  <br />

                  <div className="rte-container">
                      <ReactQuill value={this.state.body} onChange={this.handleQuillChange} formats={this.quillFormats} modules={this.quillModules} />
                  </div>

                  <br />
                  <br />

                  {/* <label htmlFor="allow_collapse">Allow Collapse</label>
                <input type="checkbox" id="allow_collapse" checked={this.state.allow_collapse} name="allow_collapse" onChange={this.handleChange}/>
                <br />
                <br /> */}

                  <select name="tag" id="tag" value={this.state.tag} onChange={this.handleChange}>
                      <option value="">Select A Tag</option>
                      {tags.map(tag => <option key={tag.name}>{tag.name}</option>)}
                  </select>
                  <br />
                  <br />

                  <Button title={isEditing ? 'Update' : 'Submit'} onClick={this.handleQuillSubmit} />
              </div>


              <DashNewsCreate2 />
          </>
      );
  }
}
const mapStateToProps = state => {
    console.log(state.news, 'our state in NEWS CREATE');

    return {
        newsById: state.news.newsById,
    };
};

const mapDispatchToProps = dispatch => ({
    createNewsPost: data => dispatch(createNewsPost(data)),
    getNewsPostById: id => dispatch(getNewsPostById(id)),
    updateNewsPostById: (data, id) => dispatch(updateNewsPostById(data, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashBlogs);
