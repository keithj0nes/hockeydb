import React, { useState } from 'react';
import { Input, Select, Button } from '../../../components'
import './inquiry.scss';

const initialState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    type: '1',
    message: ''
}

const Inquiry = () => {

    const [ form, setForm ] = useState(initialState)

    const handleSubmit = e => {
        e.preventDefault();
        alert("Form data being submitted \n \n" + JSON.stringify(form));
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({...form, [name]: value})
    }

    return (
        <div className="schedule-container" >
            <div className="white-bg" style={{paddingBottom:40}}>
                <h1>General Inquiry</h1>
                <p style={{color: 'red'}}>*Form fields work - Currently not submitting anywhere*</p>

                <form className="inquiry-form" onSubmit={handleSubmit}> 
                    <div className="inquiry-input-container">
                        <Input name="first_name" label="First Name" onChange={handleChange}/>
                        <Input name="last_name" label="Last Name" onChange={handleChange}/>
                    </div>

                    <div className="inquiry-input-container">
                        <Input name="email" label="Email Address" onChange={handleChange}/>
                        <Input name="phone" label="Phone Number" onChange={handleChange}/>
                    </div>

                    <div className="inquiry-select-container">
                        <Select name='type' title="Inquiry Type" listOfSelects={inquiryTypes} onChange={handleChange}  defaultValue={form.type || ''}   useKey="id" />
                    </div>

                    <label htmlFor="ta">Message</label>
                    <textarea name="message" id="ta" className="custom-textarea" onChange={handleChange}></textarea>

                    <div className="inquiry-button-container">
                        <Button title="SEND MESSSAGE" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Inquiry;


const inquiryTypes = [
    { id: 1, name: 'General Inquiry', value: 'gen_inq'},
    { id: 2, name: 'New Player', value: 'new_pla'},
    { id: 3, name: 'Game Review', value: 'gam_rev'},
]