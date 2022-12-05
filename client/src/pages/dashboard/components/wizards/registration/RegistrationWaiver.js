import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Popconfirm } from 'antd';
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
                <h2 className="text-6xl">WAIVERS PAGE</h2>
            </div>
        </div>
    );
};

export default RegistrationWaiver;
