import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Modal } from 'antd';
import { format, parseISO } from 'date-fns';
import { customAlphabet } from 'nanoid';
import { useAuth } from '../../../../hooks';

const nanoid = customAlphabet('1234567890abcdef', 10);

const VALIDATIONS = {
    'register-as': {
        required: {
            message: 'Please select an option below',
        },
    },
};

const WizardSelectPlayer = () => {
    const user = useAuth();
    const { onNext, onBack, formData, model, steps } = useOutletContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { fields, handleChange, errors, validate, setFieldsDangerously } = formData;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const isValidated = validate(VALIDATIONS, false);
        if (!isValidated) return;

        let registeringPlayer = {};

        if (fields['register-as'] === String(0)) {
            console.log('new player');
            registeringPlayer.value = {
                'register-as': `_${nanoid()}`,
            };
        } else if (fields['register-as'] === String(user.player_id)) {
            console.log('current user is reg');
            // registeringPlayer = user;
            registeringPlayer= submissions.find(item => {
                console.log(fields['register-as'], item.value['register-as'], 'itemmmm');
                return item.value['register-as'] === fields['register-as'];
            });
            // registeringPlayer = { ...user, value: { 'register-as': fields['register-as'] } }
        } else if (fields['register-as'].includes('_')) {
            console.log('IT HAS AN UNDERSCORE');
            registeringPlayer = submissions.find(item => {
                console.log(fields['register-as'], item.value['register-as'], 'itemmmm');
                return item.value['register-as'] === fields['register-as'];
            });
        } else {
            console.log('here  - last ');
            registeringPlayer = submissions.find(item => {
                console.log(fields['register-as'], item.value['register-as'], 'itemmmm');
                return item.value['register-as'] === fields['register-as'];
            });
        }

        console.log(registeringPlayer, 'registeringPlayer');


        // TODO: figure out a way to not overwrite form fields if registeringPlayer is not changed

        setFieldsDangerously({
            'First Name': registeringPlayer.first_name || registeringPlayer.value?.['First Name'],
            'Last Name': registeringPlayer.last_name || registeringPlayer.value?.['Last Name'],
            'Phone Number': registeringPlayer.phone_number || registeringPlayer.value?.['Phone Number'],
            // 'register-as': registeringPlayer.value?.['register-as'] || fields['register-as'],
            // 'submission-key': registeringPlayer.value?.['submission-key'] || nanoid(),
            // 'submission-key': fields['register-as'] === '0' ? `_${nanoid()}` : null,
            // 'register-as': fields['register-as'] === '0' ? '0' : null,
            ...registeringPlayer.value,
        }, true);

        onNext(registeringPlayer.step || null);
    };

    const submissions = model.registered_players || [];
    const associatedAccounts = [user, ...(user.associated_accounts || [])];
    const alreadyRegistered = submissions.filter(o1 => o1.submitted_at);
    const canRegister = submissions.filter(o1 => !o1.submitted_at);
    const associatedAccountsWhoCanRegister = associatedAccounts.filter(aa => !submissions.some(s => {
        const isUser = aa.id === user.id && !aa.parent_id;
        return (isUser ? aa.player_id : aa.id) === s.player_id;
    }));


    return (
        <form onSubmit={handleSubmit} id="modal-wrapper">
            <div className="p-4 pb-0 max-w-lg mx-auto">
                <h2 className="text-xl">Who would you like to register?</h2>
                <p className="text-sm">We noticed previous registrations tied to your account. You can register an existing player, or create a new one</p>
            </div>

            {errors['register-as'] && (
                <p className="pt-6 text-center text-red-500 text-sm pl-1">{errors['register-as']}</p>
            )}

            {!!alreadyRegistered.length && (
                <div className="py-4 text-center">
                    <button onClick={showModal} className="p-3 text-blue-500 underline" type="button">
                        View already registered players ({alreadyRegistered.length})
                    </button>
                </div>
            )}


            <div className="flex flex-col">

                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-5 m-auto">
                    {canRegister.map(item => {
                        if (!item.value) return null;
                        const isUser = item.player_id === user.player_id;
                        const onCurrentStep = item.step ? steps[item.step] : steps[0];
                        const names = {
                            first_name: item.value['First Name'],
                            last_name: item.value['Last Name'],
                            initials: `${item.value['First Name'].charAt(0)}${item.value['Last Name'].charAt(0)}`,
                        };


                        const val = item.value['register-as'];
                        const checkedddd = fields['register-as'] === val;
                        // console.log( fields['register-as'], " fields['register-as'")
                        // console.log({ val, checkedddd });


                        // console.log('\n\n\n');
                        return (
                            <li key={item.id} className="flex justify-center relative">
                                <input className="sr-only peer" disabled={false} type="radio" value={val} name="register-as" id={`register-${val}`} onChange={handleChange} checked={checkedddd} />

                                <label
                                    htmlFor={`register-${val}`}
                                    className="w-[200px] pt-8 pb-3 bg-white block border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent peer-disabled:bg-gray-200 peer-disabled:cursor-default"
                                >
                                    <div className="bg-blue-200 rounded-full h-16 w-16 flex justify-center items-center m-auto">
                                        <h3 className="text-xl uppercase">{names.initials}</h3>
                                    </div>
                                    <div className="py-4 text-center">
                                        {names.first_name} {names.last_name} {isUser && '(me)'}
                                    </div>
                                    <div className="py-0 text-center text-xl font-bold">
                                        Continue
                                    </div>
                                    <div className="py-0 text-center">
                                        ({onCurrentStep?.name})
                                    </div>
                                </label>
                            </li>
                        );
                    })}

                    {associatedAccountsWhoCanRegister.map(item => {
                        const isUser = item.id === user.id && !item.parent_id;
                        const names = {
                            first_name: item.first_name,
                            last_name: item.last_name,
                            initials: `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`,
                        };

                        return (
                            <li key={item.id} className="flex justify-center relative">
                                <input className="sr-only peer" disabled={false} type="radio" value={isUser ? item.player_id : item.id} name="register-as" id={`register-${item.id}`} onChange={handleChange} checked={fields['register-as'] === String(isUser ? item.player_id : item.id)} />
                                <label
                                    htmlFor={`register-${item.id}`}
                                    className="w-[200px] py-8 bg-white block border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent peer-disabled:bg-gray-200 peer-disabled:cursor-default"
                                >
                                    <div className="bg-blue-200 rounded-full h-16 w-16 flex justify-center items-center m-auto">
                                        <h3 className="text-xl uppercase">{names.initials}</h3>
                                    </div>
                                    <div className="py-4 text-center">
                                        {names.first_name} {names.last_name} {isUser && '(me)'}
                                    </div>
                                    <div className="py-0 text-center text-xl font-bold">
                                        Start
                                    </div>
                                </label>
                            </li>
                        );
                    })}

                    <li className="flex justify-center relative">
                        <input className="sr-only peer" type="radio" value="0" name="register-as" id="register-new" onChange={handleChange} checked={fields['register-as'] === String(0)} />
                        <label
                            htmlFor="register-new"
                            className="w-[200px] py-8 bg-white block border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent peer-disabled:bg-gray-200 peer-disabled:cursor-default"
                        >
                            <div className="bg-db-secondary rounded-full h-16 w-16 flex justify-center items-center m-auto">
                                {/* <h3 className="text-xl uppercase">NEW</h3> */}
                                <svg className="w-8 h-8 text-white peer-checked:bg-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                            <div className="py-4 text-center">
                                New player
                            </div>
                            <div className="py-0 text-center text-xl font-bold">
                                Start
                            </div>
                        </label>
                    </li>
                </ul>
            </div>


            <div className="relative py-4 hidden">
                <div className="absolute inset-0 flex items-center w-4/12 mx-auto min-w-[50%] sm:min-w-0">
                    <div className="w-full border-b border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className=" bg-light-gray px-4 text-sm text-gray-500">OR</span>
                </div>
            </div>

            <div className="flex justify-center pt-6 relative hidden">
                {/* <input className="sr-only peer" type="radio" value="0" name="register-as" id="register-new" onChange={handleChange} checked={fields['register-as'] === String(0)} />
                <label className="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent" htmlFor="register-new">
                    <div>
                        <h4 className="text-center">New Player</h4>
                    </div>
                </label> */}
                <input className="sr-only peer" type="radio" value="0" name="register-as" id="register-new1" onChange={handleChange} checked={fields['register-as2'] === String(0)} />
                <label
                    htmlFor="register-new1"
                    className="w-[200px] py-8 bg-white block border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-db-secondary peer-checked:bg-db-secondary-100 peer-checked:ring-2 peer-checked:border-transparent peer-disabled:bg-gray-200 peer-disabled:cursor-default"
                >
                    <div className="bg-db-secondary rounded-full h-16 w-16 flex justify-center items-center m-auto">
                        {/* <h3 className="text-xl uppercase">NEW</h3> */}
                        <svg className="w-8 h-8 text-white peer-checked:bg-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <div className="py-4 text-center">
                        New player
                    </div>
                    <div className="py-0 text-center">
                        Start Registration
                    </div>
                </label>
            </div>


            <div className="flex justify-between pt-10 px-5">
                <button
                    type="button"
                    // className="text-black group relative flex items-center gap-x-4 p-2 text-sm rounded-md hover:bg-primary-100 hover:text-white "
                    className="flex opacity-0 pointer-events-none justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    onClick={onBack}
                >
                    Back
                </button>

                <button
                    type="submit"
                    // disabled={currentStep === steps.length}
                    className="flex justify-center items-center border p-2 transition duration-200 text-sm border-gray-300 rounded bg-primary text-white hover:bg-primary-100 disabled:bg-primary-100 disabled:ring-0 focus:outline-none active:ring active:ring-primary-50"
                >
                    Continue
                </button>
            </div>

            <Modal title="Basic Modal" getContainer={() => document.getElementById('modal-wrapper')} footer={null} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ul className="w-full max-w-xl m-auto text-sm font-medium text-gray-900 bg-white rounded-lg">
                    {alreadyRegistered.map(item => {
                        const isUser = item.player_id === user.player_id;
                        return (
                            <li key={item.id} className="flex justify-between py-2 px-4 w-full rounded-t-lg border-b border-gray-200 last:border-b-0">
                                <div>
                                    <h4>{item.value['First Name']} {item.value['Last Name']} {isUser && '(me)'}</h4>
                                    <p className="text-xs text-gray-600">on {format(parseISO(item.submitted_at), 'LLLL dd, yyyy')}</p>
                                </div>

                                <Link
                                    to={`/dashboard/registrations/${item.id}`}
                                    className="flex items-center text-indigo-700 hover:text-indigo-400 duration-200"
                                >
                                    View
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </Modal>

        </form>
    );
};

export default WizardSelectPlayer;

WizardSelectPlayer.propTypes = {};
