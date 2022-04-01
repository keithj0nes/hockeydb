import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tabs, Form, Input, Button, Popconfirm, Select } from 'antd';
import { toggleModal } from 'redux/actions/misc';
import { EditOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DashPageHeader } from '../../../components';
import DashRegistrationDrawer from './components/DashRegistrationDrawer';
import DashRegistrationPayments from './components/DashRegistrationPayments';
import DashRegistrationBasics from './components/DashRegistrationBasics';
import DashRegistrationReview from './components/DashRegistrationReview';

const input_model = {
    type: 'text | select',
    options: ['values', 'if', 'type', 'is', 'select'], // only if type === select
    label: 'First Name',
    name: 'first_name', // name will be label regex'd with underscores
    required: true, // default to true, will be marked optional if false
};

function mapObj(obj) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}


//
//
//
//
//
//
//
//
// //// put all state in dash regstrations (this component)
// //// pass all state down to compoennts and update state in this component
//
// 1 figure out how to edit field without it adding new field
// 2 create payment component in separate file
// 3 clean this file up
//
//
//
//
const DashRegistrations = ({ toggleModal }) => {
    const [addFieldDrawerVisible, setAddFieldDrawerVisible] = useState(false);
    const [addSectionDrawerVisible, setAddSectionDrawerVisible] = useState(false);
    // const [mySections, setMySections] = useState(arrOfSections);
    const [mySections, setMySections] = useState({});
    const [sectionOpen, setSectionOpen] = useState(null);

    const pageHeaderInfo = {
        title: 'Registration',
        subTitle: 'Fall 1999',
        hideSearchAndButtons: true,
    };

    useEffect(() => {
        setMySections(JSON.parse(window.localStorage.getItem(`reg ${pageHeaderInfo.subTitle}`)) || {});
    }, []);

    const handleDeleteForm = () => {
        toggleModal({
            isClosableOnBackgroundClick: true,
            isVisible: true,
            title: 'Delete Form',
            message: 'Are you sure you want to delete this form?\nThis cannot be undone and you will lose any information saved within this registration.\n',
            toBeDeleted: null,
            deleteAction: () => {
                setMySections({});
                toggleModal();
                return window.localStorage.removeItem(`reg ${pageHeaderInfo.subTitle}`);
            },
        }, 'delete');
    };

    const handleSubmit = (values, type, sectionOpen) => {
        // console.log(values, type, sectionOpen, 'values type')
        // console.log(sectionOpen, 'seciton open')


        let item = {};
        switch (type) {
        case 'section':
            if (!!sectionOpen) {
                // item = { ...mySections, [sectionOpen.section.title.toLowerCase()]: values };
                // const item = {};
                delete Object.assign(item, mySections, { [values.title.toLowerCase()]: mySections[sectionOpen.section.title.toLowerCase()] })[sectionOpen.section.title.toLowerCase()];
                item[values.title.toLowerCase()] = values;
                // console.log(item, 'NEW OBJECTTTTT!!!!')
            } else {
                item = { ...mySections, [values.title.toLowerCase()]: values };
            }
            // console.log(item,' item!!')
            setMySections(item);
            break;
        case 'field':
        default:
            item = { ...mySections, [sectionOpen.section]: { ...mySections[sectionOpen.section], fields: { ...mySections[sectionOpen.section].fields, [values.name]: values } } };
            setMySections(item);
            break;
        }
        window.localStorage.setItem(`reg ${pageHeaderInfo.subTitle}`, JSON.stringify(item));
    };

    const handleDelete = ({ section, field }) => {
        const newObj = { ...mySections };
        if (!field) {
            delete newObj[section];
        } else {
            delete newObj[section].fields[field];
        }
        setMySections(newObj);
        // uncomment to remove on delete
        // window.localStorage.setItem(`reg ${pageHeaderInfo.subTitle}`, JSON.stringify(newObj));
    };

    const renderInputType = (item) => {
        switch (item.value.type) {
        case 'text':
            return <Input type={item.value.type} />;
        case 'select':
            return <Select placeholder="Select One" options={item.value.options} />;
        default:
            return null;
        }
    };

    // :: TODO ::
    // FIX EDIT FUNCTIONALITY FOR SELECT
    // ADD RADIO / CHECKBOX TO FIELDS LIST

    console.log(mySections, 'mysections')

    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            <div className="p-h-m p-v-xl">

                <h1>DashRegistrations - Create</h1>

                <Tabs defaultActiveKey="1" onChange={key => console.log(key,' keeey')}>
                    <Tabs.TabPane tab="Basics" key="1">
                        {/* Actions for basics */}
                        <DashRegistrationBasics sections={mySections} onDelete={handleDelete} onSubmit={handleSubmit} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Waivers" key="2">
                        {/* Actions to submit waivers */}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Payments" key="3">
                        {/* Actions for payments */}
                        <DashRegistrationPayments />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Review" key="4">
                        {/* Actions to review completed registration */}
                        <DashRegistrationReview sections={mySections} />
                    </Tabs.TabPane>
                </Tabs>
            </div>

            {/* <DashRegistrationDrawer
                type="field"
                visible={addFieldDrawerVisible}
                onClose={() => {
                    setAddFieldDrawerVisible(!addFieldDrawerVisible);
                    setSectionOpen(null);
                }}
                editingField={sectionOpen?.field}
                // visible={!!sectionOpen}
                // onClose={() => setSectionOpen(null)}
                onSubmit={handleSubmit}
            />

            <DashRegistrationDrawer
                type="section"
                editingSection={sectionOpen?.section}
                visible={addSectionDrawerVisible}
                onClose={() => {
                    setAddSectionDrawerVisible(!addSectionDrawerVisible);
                    setSectionOpen(null);
                }}
                onSubmit={handleSubmit}
            /> */}

        </>
    );
};

const mapDispatchToProps = dispatch => ({
    toggleModal: (modalProps, modalType) => dispatch(toggleModal(modalProps, modalType)),
});

// export default DashRegistrations;

export default connect(null, mapDispatchToProps)(DashRegistrations);
