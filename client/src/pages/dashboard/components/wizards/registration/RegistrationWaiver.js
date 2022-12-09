import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Collapse } from 'antd';
import classNames from 'classnames';
import { Button } from '../..';


const waivers = [
    {
        title: 'Refund Policy',
        body: 'The refund policy is as stated ...',
    },
    {
        title: 'Assumption of Risk',
        body: 'By initialing this form you assume all risks with playing the sport of hockey ...',
    },
]



// TODO: send the registration model when entering the the admin registration 


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const RegistrationWaiver = () => {
    const a = '';
    return (
        <div className="pb-40">
            <div className="flex justify-end py-4 gap-x-4">
                <Button>
                    Add Waiver
                </Button>
            </div>

            <div className="mb-10">
                {/* <h2 className="text-6xl">WAIVERS PAGE</h2> */}

                <div className="bg-white">

                    <Collapse defaultActiveKey={[waivers[0].title]} onChange={key => console.log(key)}>
                        {/* <Collapse.Panel header="This is panel header 1" key="1">
                            <p>{text}</p>
                        </Collapse.Panel>
                        <Collapse.Panel header="This is panel header 2" key="2">
                            <p>{text}</p>
                        </Collapse.Panel>
                        <Collapse.Panel header="This is panel header 3" key="3">
                            <p>{text}</p>
                        </Collapse.Panel> */}
                        {waivers.map(item => {
                            const b = '';
                            return (
                                <Collapse.Panel header={item.title} key={item.title}>
                                    <p>{item.body}</p>
                                </Collapse.Panel>
                            )
                        })}
                    </Collapse>
                </div>
            </div>
        </div>
    );
};

export default RegistrationWaiver;
