import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, Input, Select, Tag } from 'antd';
import { Button, DashPageHeader, NewsPost } from '../../../components';
import { createNewsPost, getNewsPostById, updateNewsPostById } from '../../../redux/actions/news';
import './dashnews.scss';

const defaultTags = [
    { value: 'announcement' },
    { value: 'covid' },
    { value: 'schedule-update' },
    { value: 'summer' },
    { value: 'winter' },
    { value: 'spring' },
];

const quillModules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        // ['link', 'image'],
    ],
    // imageHandler: this.imageHandler,
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
];


const DashNewsCreate2 = ({ user, createNewsPost, history, match }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [tagsList, setTagsList] = useState(defaultTags);
    const [options, setOptions] = useState([]);
    const [post, setPost] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // useEffect(() => {
    //     console.log('did mount dashnewscreate2');
    //     if (match.params.id !== 'create') {
    //         console.log(match.params.id, 'match.params.id')
    //     }
    // }, [match]);


    const clickTag = (e) => {
        const tag = e.target.textContent;
        setTagsList(tagsList.filter(item => item.value !== tag));
        const newOptions = [...options, { value: tag }];
        setOptions(newOptions);
        form.setFieldsValue({ tags: newOptions.map(({ value }) => value) });
    };

    const closeableman = (e) => {
        setTagsList([...tagsList, { value: e.label }]);
        setOptions(options.filter(item => item.value !== e.label));
    };

    const tagRender = (props) => {
        const { label, value, closable } = props;
        return (
            <Tag color="#FF815C" closable={closable} onClose={() => closeableman({ value, label })} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    };

    const handleSubmit = () => {
        createNewsPost(post);
        history.push('/dashboard/news');
    };

    const pageHeaderInfo = {
        title: `News - ${isEditing ? 'Edit' : 'Create'}`,
        hideSearchAndButtons: true,
    };

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />
            <div className="dashnews-container">

                {isEditing && (
                    <div style={{ padding: '20px 0', background: 'yellow' }}>
                        <p> Created By: me hehhe</p>
                        <p> Created Date: 10/14/2819 8:22 AM</p>
                        {/* <p> Created By: {this.state.first_name} {this.state.last_name}</p>
                        <p> Created Date: {dateFormat(this.state.created_date, 'MM/DD/YYYY h:mmA')}</p> */}
                    </div>
                )}

                {!showPreview && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={values => { setPost(values); setShowPreview(!showPreview); }}
                    >

                        <div className="title-postdate-container">
                            <Form.Item
                                label="Title"
                                name="title"
                                className="dashnews-input"
                                rules={[{ required: true, message: 'Title is required' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* save for later */}
                            {/* <Form.Item label="Post Date" name="post_date" className="dashnews-input">
                                <Input />
                            </Form.Item> */}
                        </div>

                        <Form.Item>
                            <Form.Item
                                name="body"
                                initialValue=""
                                noStyle
                                rules={[{ required: true, message: 'Body is required' }]}
                            >
                                <ReactQuill formats={quillFormats} modules={quillModules} />
                            </Form.Item>
                        </Form.Item>


                        <Form.Item label="Tags" name="tags" className="dashnews-input">
                            <Select
                                mode="multiple"
                                tagRender={tagRender}
                                open={false}
                                style={{ width: '100%' }}
                                placeholder="Select tags"
                                className="tag-select"
                            >
                                {options.map(option => (
                                    <Select.Option key={option.value}>{option.value}</Select.Option>
                                ))}
                            </Select>

                        </Form.Item>

                        <div className="dashnews-input">
                            {tagsList.map(tag => <Tag onClick={clickTag} key={tag.value}>{tag.value}</Tag>)}
                        </div>
                        <br />
                        <br />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button title="Preview Post" type="admin" htmlType="submit" />
                        </div>

                    </Form>
                )}

                {showPreview && (
                    <>
                        <div className="dash-news-preview-container">
                            <NewsPost post={{ ...post, first_name: user.first_name, last_name: user.last_name }} />
                        </div>

                        <br />
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button title="Edit" type="cancel" htmlType="button" onClick={() => setShowPreview(false)} />
                            <Button title="Submit post" type="admin" htmlType="button" onClick={handleSubmit} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};


const mapStateToProps = state => ({
    user: state.user.user,
    newsById: state.news.newsById,
});

const mapDispatchToProps = dispatch => ({
    createNewsPost: data => dispatch(createNewsPost(data)),
    getNewsPostById: id => dispatch(getNewsPostById(id)),
    updateNewsPostById: (data, id) => dispatch(updateNewsPostById(data, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashNewsCreate2));

DashNewsCreate2.propTypes = {
    user: PropTypes.object,
    history: PropTypes.object,
    createNewsPost: PropTypes.func,
};
