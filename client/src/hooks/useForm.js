/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useEffect, useState } from 'react';

export default function useForm(initialState = {}) {
    const [fields, setFields] = useState(initialState);
    const [errors, setLocalErrors] = useState({});
    const initalValues = Object.values(initialState).join('');

    useEffect(() => {
        setFields(initialState);
    }, [initalValues]);

    const handleChange = (e, key, nameManual) => {
        // if (!e.target) {
        // console.log(e, 'eeeeeeeeee')
        // }

        if (nameManual) {
            // return console.log(nameManual, key);
            setFields({
                ...fields,
                [nameManual]: key.toString(),
            });
            return;
        }

        // console.log(key, 'keeeyy')
        const { name, type, files, checked } = e.target;
        let { value } = e.target;

        // console.log(type, name, checked, value, 'TYPEEEE')

        if (type === 'number') {
            // use maxLength on type: number
            // console.log(value, e.target.attributes?.max.value, 'ma value')
            // console.log(typeof e.target.attributes?.max.value, 'ma value')

            if (e.target.attributes?.max) {
                if (value > parseFloat(e.target.attributes?.max.value)) {
                    value = parseFloat(e.target.attributes?.max.value);
                }
                value = parseFloat(value);
            } else if (e.target.attributes?.maxlength) {
                if (value.length > e.target.attributes?.maxlength.value) return;
                value = parseFloat(value);
            } else {
                value = parseFloat(value);
            }

            if (Number.isNaN(value)) {
                value = 0;
            }
        }
        if (type === 'file') {
            [value] = files;
        }

        if (key) {
            setFields({
                ...fields,
                [key]: {
                    ...fields[key],
                    [name]: { value: type === 'checkbox' ? checked : value },
                },
            });
            return;
        }

        // console.log({
        //     ...fields,
        //     [name]: type === 'checkbox' ? checked : value,
        // });

        setFields({
            ...fields,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validate = (validations, scrollToError = true) => {
        let valid = true;
        const newErrors = {};
        for (const key in validations) {
            // value of the field we're validating
            const value = fields[key];
            // the matching validation rule for this key
            const validation = validations[key];

            // REQUIRED
            if (!!validation?.required && !value) {
                valid = false;
                newErrors[key] = validation?.required?.message || 'This is a required field';
            }
            // PATTERN
            const pattern = validation?.pattern;

            // console.log(pattern?.value, 'RegExp(pattern.value).test(value)')
            if (pattern?.value && !RegExp(pattern.value).test(value)) {
                valid = false;
                newErrors[key] = pattern.message;
            }
            // CUSTOM
            const custom = validation?.custom;
            if (custom?.isValid && !custom.isValid(value)) {
                valid = false;
                newErrors[key] = custom.message;
            }
        }

        if (!valid) {
            setLocalErrors(newErrors);

            if (scrollToError) {
                // NOTE: to scroll to error, the input must have an id
                const errorsKeys = Object.keys(newErrors);
                const section = document.getElementById(`${errorsKeys[0]}`);
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            return false;
        }
        setLocalErrors(newErrors);
        return true;
    };

    const resetForm = () => {
        setFields(initialState);
        setLocalErrors({});
    };

    const clearForm = () => {
        const clearedState = Object.fromEntries(
            Object.entries(fields).map(([key]) => [key, '']),
        );
        setFields(clearedState);
        setLocalErrors({});
    };

    const setErrors = (incomingErrors) => setLocalErrors({ ...errors, ...incomingErrors });
    // const setFieldsDangerously = (incomingFields) => setFields({ ...fields, ...incomingFields });

    const setFieldsDangerously = (incomingFields, overwrite) => {
        if (overwrite) {
            setFields({ ...incomingFields });
        } else {
            setFields({ ...fields, ...incomingFields });
        }
    };


    return { fields, handleChange, resetForm, clearForm, errors, validate, setErrors, setFieldsDangerously };
}
