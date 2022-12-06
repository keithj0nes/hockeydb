import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Popconfirm } from 'antd';
import classNames from 'classnames';
import DrawerAddField from '../../drawers/DrawerAddField';
import DrawerAddSection from '../../drawers/DrawerAddSection';
// import { useForm } from '../../../hooks';
// import { Dropdown } from '../../../components/dashboard';
import { Toggle } from '../../../../../components';
import { updateRegistrationFieldsByRegId } from '../../../../../redux/slices/registrations';

const WizardFields = () => {
    const [sectionNames, setSectionNames] = useState([]);
    const [sections2, setSections2] = useState({});
    const [addFieldDrawerVisible, setAddFieldDrawerVisible] = useState(false);
    const [addSectionDrawerVisible, setAddSectionDrawerVisible] = useState(false);
    const [needsToSave, setNeedsToSave] = useState(false);

    const [selectedSection, setSelectedSection] = useState({});
    const [removedIds, setRemovedIds] = useState([]);


    const { formFields } = useSelector((state) => state.registrations);
    const dispatch = useDispatch();
    const { id: season_id, registration_id } = useParams();

    useEffect(() => {
        sorter(formFields);
    }, [formFields]);

    const sorter = (f, forceSectionsUpdate = false) => {
        const b = [...f].sort((a, b) => a.section_display_index - b.section_display_index).reduce((acc, curr) => {
            // console.log({ acc, curr })
            acc[curr.section] = acc[curr.section] || [];
            acc[curr.section].push(curr);
            acc[curr.section].sort((a, b) => a.display_index - b.display_index);
            return acc;
        }, {});

        const l = Object.keys(b);
        // console.log(l, 'llll');

        if ((l.length > sectionNames.length) || forceSectionsUpdate) {
            setSectionNames(l);
        }

        // console.log(b, 'bbbbbbbbbb');
        setSections2(b);
    };


    const renderInputType = item => {
        switch (item.value.field_type) {
            case 'text':
                return <input type="text" className="w-full border p-0.5 m-0 text-sm border-gray-300 rounded disabled:bg-gray-50 disabled:cursor-not-allowed" disabled />;
            case 'checkbox':
                return <Toggle disabled checked />;
            default:
                return <input type="text" className="w-full border p-0.5 m-0 text-sm border-gray-300 rounded disabled:bg-gray-50 disabled:cursor-not-allowed" disabled />;
                // return null;
        }
    };


    const handleDeleteField2 = ({ field_id, field }) => {
        // flatten sections object to single array and filter out the deleted field_id
        const arr = Object.keys(sections2).map(item => sections2[item]).flat(1);

        const newFields = arr.filter(item => {
            if (!field_id) {
                return item.label !== field.label;
            }
            setRemovedIds([...removedIds, field_id]);
            return item.field_id !== field_id;
        });

        if (!field_id && !removedIds.length) {
            setNeedsToSave(false);
        } else {
            setNeedsToSave(true);
        }

        sorter(newFields);
    };


    const handleAddField2 = ({ section, name, ...rest }) => {
        console.log('* ADDING FIELD');
        console.log(section, name, 'section [=========]');
        console.log(rest, 'resstt');


        const arr = Object.keys(sections2).map(item => sections2[item]).flat(1);
        const fieldExists = arr.find(item => item.label.toLowerCase() === rest.label.toLowerCase());

        if (fieldExists) {
            if (fieldExists.section === section) {
                return { label: 'This field already exists in this section' };
            }
            return { label: `This field already exists in the ${fieldExists.section} section` };
        }
        const indexOfSection = sectionNames.findIndex(sec => sec === section);

        const newArrayOfFields = [...arr, { name, display_index: arr.length + 1, section, section_display_index: indexOfSection + 1, ...rest }];
        setNeedsToSave(true);
        return sorter(newArrayOfFields);
    };

    const handleAddSection2 = ({ section, old_section_name }) => {
        console.log('* ADDING SECTION');
        console.log({ section, old_section_name });

        setNeedsToSave(true);

        // editing current, do not add to new
        if (!!old_section_name && old_section_name === selectedSection?.key) {
            const flattenedSections = Object.keys(sections2).map(item => sections2[item]).flat(1);

            const updatedArray = flattenedSections.map(item => {
                if (item.section === selectedSection.key) {
                    return { ...item, section };
                }
                return item;
            });
            return sorter(updatedArray, true);
        }

        const sectionExists = sectionNames.some(secName => secName.toLowerCase() === section.toLowerCase());
        if (sectionExists) return { section: 'This section already exists' };

        return setSectionNames([...sectionNames, section]);
    };

    return (
        <div className="pb-40">
            <div className="flex justify-end py-4 gap-x-4">
                <button
                    type="button"
                    className="flex justify-center items-center border p-2 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                    // onClick={() => setIsCreateVisible(true)}
                    onClick={() => {
                        setAddSectionDrawerVisible(true);
                        // setAddFieldDrawerVisible(true);
                        setSelectedSection({ section: '' });
                    }}
                >
                    Add Section
                </button>
            </div>

            <div className="mb-10">
                {sectionNames.map(section => (
                    <div key={section} className="bg-white">
                        <div className="border-b bg-gray-200 p-2 flex items-center justify-between">

                            <div className="flex">
                                <h3 className="font-semibold text-lg">{section}</h3>

                                <button
                                    type="button"
                                    className="ml-4"
                                    onClick={() => {
                                        setAddSectionDrawerVisible(true);
                                        setSelectedSection({ key: section });
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                            </div>


                            <button
                                type="button"
                                className="flex justify-center items-center border py-1 px-3 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                                onClick={() => {
                                    setAddFieldDrawerVisible(true);
                                    setSelectedSection({ key: section });
                                }}
                            >
                                Add Field
                            </button>
                        </div>

                        {/* {sections2[section] && sections2[section].map(field => {
                            console.log(field, 'field')
                            // return (
                            // )
                        })} */}

                        {sections2[section] && sections2[section].map(field => (
                            <div key={field.field_id} className="p-2 sm:flex items-center py-3 border-b">
                                <div className="w-full flex justify-between sm:w-1/5 pb-2 sm:pb-0">
                                    <p className="w-2/3 ">{field.label}</p>

                                    {field.is_required && (<p className="w-1/3 text-center sm:hidden">Required</p>)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="w-2/3">
                                        {renderInputType({ ...field, value: { field_type: field.field_type } })}

                                    </div>
                                    <p className={classNames('hidden px-4 sm:block', { invisible: !field.is_required })}>Required</p>
                                    <div className="flex justify-center w-1/3">
                                        <Popconfirm
                                            placement="top"
                                            okText="Delete"
                                            onConfirm={() => handleDeleteField2({ field, field_id: field.field_id })}
                                            // title={`Are you sure you want to delete the ${field.label} field?`}
                                            title={(<span>Are you sure you want to delete the <span className="bg-gray-200 px-2 py-0.5">{field.label}</span> field?</span>)}
                                        >
                                            <button
                                                type="button"
                                                className={classNames('flex justify-center items-center text-red-400 p-0 text-sm rounded focus:outline-none active:ring active:ring-gray-200', {
                                                    invisible: !field.removable && field.locked,
                                                })}
                                            >
                                                Remove
                                            </button>
                                        </Popconfirm>
                                        {/* <Popconfirm
                                                    placement="top"
                                                    okText="Delete"
                                                    // onConfirm={() => console.log({ field, field_id: field.field_id, section: section.key })}
                                                    // onConfirm={() => handleDelete2({ field, field_id: field.field_id, section: section.key })}
                                                    // title="Are you sure you want to delete this field?"
                                                    title={`Are you sure you want to delete the ${field.label} field?`}
                                                >
                                                      <button
                                                        type="button"
                                                        // className="flex justify-center items-center text-red-400 p-0 text-sm rounded focus:outline-none active:ring active:ring-gray-200"
                                                        className={classNames('flex justify-center items-center text-red-400 p-0 text-sm rounded focus:outline-none active:ring active:ring-gray-200', {
                                                            invisible: !field.removable && field.locked,
                                                        })}
                                                    >
                                                        Remove
                                                    </button>
                                                </Popconfirm> */}

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-x-2">

                <div className="relative">
                    <button
                        // disabled
                        type="submit"
                        className="flex justify-center items-center border p-2 px-6 text-sm border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none active:ring active:ring-gray-200 active:bg-gray-100"
                        onClick={async () => {
                            console.log('SAVING .........');
                            console.log({ sections2 });

                            const arr = Object.keys(sections2).map(item => sections2[item]).flat(1);
                            console.log(arr, 'subbiting this');

                            console.log({ removedIds });
                            const res = await dispatch(updateRegistrationFieldsByRegId({ season_id, registration_id, fields: arr, removedIds }));
                            console.log(res, 'ressssss from saving');
                            if (!!res) {
                                setRemovedIds([]);
                                setNeedsToSave(false);
                            }
                        }}
                    >
                        Save
                    </button>

                    {needsToSave && (
                        <div className="absolute pointer-events-none animate-ping-button top-0 w-full border-2 border-db-secondary h-full rounded" />
                    )}
                </div>

            </div>


            <DrawerAddField
                onClose={() => {
                    setAddFieldDrawerVisible(false);
                    setSelectedSection({});
                }}
                visible={addFieldDrawerVisible}
                section={{ section: selectedSection.key }}
                onAddField={handleAddField2}
            />

            <DrawerAddSection
                onClose={() => {
                    setAddSectionDrawerVisible(false);
                    setSelectedSection({ section: '' });
                }}
                visible={addSectionDrawerVisible}
                section={{ section: selectedSection.key }}
                onAddSection={handleAddSection2}
            />


        </div>
    );
};

export default WizardFields;
