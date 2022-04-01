import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { Tabs, Form, Input, Button, Popconfirm, Select } from 'antd';
// import { toggleModal } from 'redux/actions/misc';
import { EditOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import { DashPageHeader } from '../../../components';
// import DashRegistrationDrawer from './components/DashRegistrationDrawer';
// import DashRegistrationPayments from './components/DashRegistrationPayments';
// import DashRegistrationBasics from './components/DashRegistrationBasics';

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

const DashRegistrationReview = (props) => {
    // const [addFieldDrawerVisible, setAddFieldDrawerVisible] = useState(false);
    // const [addSectionDrawerVisible, setAddSectionDrawerVisible] = useState(false);
    // const [sectionOpen, setSectionOpen] = useState(null);
    const { sections, onDelete, onSubmit } = props;

    return (
        <div>
            {mapObj(sections).map(section => {
                // console.log(section, 'section')
                return (
                    <div className="p-v-s" key={section.key} style={{padding: '20px 0', margin: '20px 0', background: 'azure' }}>
                        <h2>
                            {section.value.title} &nbsp;&nbsp;&nbsp;&nbsp;
                            {/* <Popconfirm placement="top" onConfirm={() => handleDelete({ section: section.key })} title="Are you sure you want to delete this section?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                <CloseOutlined />
                            </Popconfirm> */}
                            <EditOutlined
                                onClick={() => {
                                    console.log('send back to basics tab')
                                    // setSectionOpen({ section: { title: section.value.title, description: section.value.description } });
                                    // setSectionOpen({ section: {...section.value} });

                                    // setAddSectionDrawerVisible(!addSectionDrawerVisible);
                                }}
                            />
                        </h2>
                        <p className="p-b-s">{section.value.description}</p>

                        {!Object.keys(section.value.fields).length ? (
                            <p>Add a field for this section</p>
                        ) : mapObj(section.value.fields).map(item => {
                            // console.log(item, 'ITEEMMM HAHAAH')
                            return (
                                <div key={item.key} style={{borderTop: '1px solid gray'}}>
                                    {item.value.label} : {item.value.type}
                                </div>
                            );
                        })}
                        {/* <Button type="primary" htmlType="button" onClick={() => setAddFieldDrawerVisible(!addFieldDrawerVisible)}>Add Field</Button> */}
                    </div>
                );
            })}
        </div>
    );
};

export default DashRegistrationReview;
