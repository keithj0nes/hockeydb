import React, { useState } from 'react';
import { Form, Input, Button, Popconfirm, Select } from 'antd';
// import { wait } from 'helpers';
import { EditOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import DashPaymentDrawer from './DashPaymentDrawer';
import DashRegistrationDrawer from './DashRegistrationDrawer';

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

const DashRegistrationBasics = (props) => {
    const [addFieldDrawerVisible, setAddFieldDrawerVisible] = useState(false);
    const [addSectionDrawerVisible, setAddSectionDrawerVisible] = useState(false);
    const [sectionOpen, setSectionOpen] = useState(null);
    const { sections, onDelete, onSubmit } = props;

    const renderInputType = (item) => {
        switch (item.value.type) {
        case 'text':
            return <Input type={item.value.type} />;
        case 'select':
            // console.log(item.value.options, 'option')
            return <Select placeholder="Select One" options={item.value.options} />;
        default:
            return null;
        }
    };

    return (
        <div className="m-t-xs">
            <div className="p-t-m">
                <h1>The Basics</h1>

                <p>list the basic form fields here</p>

                <Button type="primary" onClick={() => setAddSectionDrawerVisible(!addSectionDrawerVisible)}>Add Section</Button>
                {/* {!!mapObj(sections).length && (
                    <Button type="primary" className="m-l-s" danger htmlType="button" onClick={handleDeleteForm}>Delete Form</Button>
                )} */}

                <Form layout="vertical" className="m-t-s">
                    {mapObj(sections).map(section => {
                        // console.log(section, 'section')
                        return (
                            <div className="p-v-s" key={section.key} style={{padding: '20px 0', margin: '20px 0', background: 'azure' }}>
                                <h2>
                                    {section.value.title} &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Popconfirm placement="top" onConfirm={() => onDelete({ section: section.key })} title="Are you sure you want to delete this section?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                        <CloseOutlined />
                                    </Popconfirm>
                                    <EditOutlined
                                        onClick={() => {
                                            // setSectionOpen({ section: { title: section.value.title, description: section.value.description } });
                                            setSectionOpen({ section: { ...section.value } });

                                            setAddSectionDrawerVisible(!addSectionDrawerVisible);
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
                                            <Form.Item
                                                style={{width: 200, position: 'relative', marginBottom: 0}}
                                                label={item.value.label}
                                            >
                                                <Form.Item
                                                    name={item.value.name}
                                                    rules={[{ required: item.required, message: `${item.value.label} is required` }]}
                                                >
                                                    <span style={{position: 'absolute', right: 0, top: -28, zIndex: 100 }}>
                                                        <Popconfirm placement="top" onConfirm={() => onDelete({ field: item.key, section: section.key })} title="Are you sure you want to delete this field?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                                            <CloseOutlined />
                                                        </Popconfirm>
                                                        <EditOutlined
                                                            onClick={() => {
                                                                setSectionOpen({ section: section.key, field: item.value });
                                                                setAddFieldDrawerVisible(!addFieldDrawerVisible);
                                                            }}
                                                        />
                                                    </span>

                                                    {renderInputType(item)}

                                                </Form.Item>
                                            </Form.Item>
                                        </div>
                                    );
                                })}
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={() => {
                                        setAddFieldDrawerVisible(!addFieldDrawerVisible);
                                        setSectionOpen({ section: section.key });
                                    }}
                                >
                                    Add Field
                                </Button>
                            </div>
                        );
                    })}

                </Form>
            </div>

            <DashRegistrationDrawer
                type="field"
                visible={addFieldDrawerVisible}
                onClose={() => {
                    setAddFieldDrawerVisible(!addFieldDrawerVisible);
                    setTimeout(() => {
                        setSectionOpen(null);
                    }, 1000);
                }}
                editingField={sectionOpen?.field}
                // onSubmit={(e) => onSubmit(e, 'lol')}
                onSubmit={(values, type) => onSubmit(values, type, sectionOpen)}

            />

            <DashRegistrationDrawer
                type="section"
                editingSection={sectionOpen?.section}
                visible={addSectionDrawerVisible}
                onClose={() => {
                    setAddSectionDrawerVisible(!addSectionDrawerVisible);
                    setSectionOpen(null);
                }}
                // onSubmit={onSubmit}
                onSubmit={(values, type) => onSubmit(values, type, sectionOpen)}

            />

        </div>

    );
};

export default DashRegistrationBasics;
