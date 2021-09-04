import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Steps, Collapse, Checkbox, Radio } from 'antd';





    // change out this waiver step in the registration file



const WaiverStep = ({ fakeData, setFakeData, form, userInputedValues, openPanelKey44, setOpenPanelKey44 }) => {
    return (
        <div className="section-border">
            {/* <h2>Docs & Waivers</h2> */}
            <h2>Waivers</h2>
            {/* <p>{fakeData.description}</p> */}
            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_description }} />

            <div style={{ marginTop: '24px' }} />

            <h3>Participant: {userInputedValues.first_name} {userInputedValues.last_name}</h3>
            {/* <p style={{fontSize: 12}}>
                    Below are the documents that <strong>John Smith</strong> needs to sign before being able to practice and join a team for the 2020 Spring season.
                </p> */}

            <p dangerouslySetInnerHTML={{ __html: fakeData.step2_important }} />

            <div style={{ marginTop: '24px' }} />

            <Form
                form={form}
                // onFinish={values => console.log(values, 'VALUES HAHA')}
                // onFinish={() => setOpenPanelKey(openPanelKey + 1)}
                onFinish={values => {
                    console.log(values, 'VALUES ON FINISH OPEN PANEL');

                    const [entry] = Object.entries(values);
                    console.log(entry[0], entry[1], 'key balueeeee');
                    // form.setFieldsValue({ [waiver.name]: e.target.value?.toUpperCase() });
                    form.setFieldsValue({ [entry[0]]: entry[1]?.toUpperCase() });

                    setOpenPanelKey44('next');

                    // TO DO

                    // formStep2 waivers should be updated here
                    // it is currently being updated on line 451 via onchange
                }}
            >
                {/* <Collapse defaultActiveKey={openPanelKey}> */}
                <Collapse activeKey={openPanelKey44} onChange={e => setOpenPanelKey44(e)}>

                    {fakeData.step2_waivers.map(waiver => (
                        <WaiverCollapse waiver={waiver} fakeData={fakeData} setFakeData={setFakeData} key={waiver.id} form={form} userInputedValues={userInputedValues} setOpenPanelKey44={setOpenPanelKey44} />
                    ))}

                </Collapse>
            </Form>
        </div>
    );
};

export default WaiverStep;

WaiverStep.propTypes = {
    fakeData: PropTypes.object,
    form: PropTypes.object,
};
