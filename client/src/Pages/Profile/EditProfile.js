import React from "react";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";

// Form imports
import { Formik, Form, useField } from "formik";
import '@availity/yup';
import * as Yup from 'yup';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const EditProfileDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: baseline;
    max-width: 15vw;
    height: 20vh;
`

const EditProfileFieldDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
`

const EditProfileLabel = styled.label`

`

const EditProfileInput = styled.input`

`

const EditProfileButton = styled.button`
    width: 50px;
    background-color: #ffffff;
`

const EditProfileSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Too short!")
        .max(30, "Too long!")
        .required("Required"),
    lastName: Yup.string()
        .min(2, "Too short")
        .max(30, "Too long!")
        .required("Required"),
    phone: Yup.string()
        .phone("Not a phone number!")
        .required("Required!"),
});

const UPDATE_USER = gql`
    mutation UpdateUser($firstName:String, $lastName:String, $phone:String) {
        userUpdateOne(record:{firstName:$firstName, lastName:$lastName, phone:$phone}) {
            record {
                _id # Need this so that it updates the initial user query
                __typename # Need this so that it updates the initial user query
                firstName
                lastName
                phone
            }
            recordId
        }
    }
`

/**
* Custom field component
*/
const EditProfileField = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    return (
        <EditProfileFieldDiv>
            <EditProfileLabel>
                {label}
                <EditProfileInput {...field} {...props} />
            </EditProfileLabel>
            {meta.touched && meta.error ? meta.error : null}
        </EditProfileFieldDiv>
    )
}

const EditPhoneField = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);

    // We need to get the value from Formik so that everything stays updated
    const { value } = meta;

    // We need to be able to set the value in formik so that our input can be validated
    const { setValue } = helpers;

    return (
        <EditProfileFieldDiv>
            <EditProfileLabel>
                {label}
                <PhoneInput
                    country={"us"}
                    value={value}
                    onChange={setValue}
                />
            </EditProfileLabel>
            {meta.touched && meta.error ? meta.error : null}
        </EditProfileFieldDiv>
    )
}

const EditProfile = ({ user, closeModal }) => {
    // We want the initial values of form elements to be the current user values that are not _id, typename, token, recentUpdate, and netid
    let { _id, __typename, token, recentUpdate, netid, ...initialValues } = user;

    // Check if any initialValues are null/undefined
    for (let fieldName of Object.keys(initialValues)) {
        if (!initialValues[fieldName]) {
            initialValues[fieldName] = "";
        }
    }

    // Create mutation which we'll use to update the user fields
    const [updateUser, { data, loading }] = useMutation(UPDATE_USER);

    const handleSubmit = (values, actions) => {
        // Use mutation
        updateUser({ variables: values });
    }

    if (loading) return <p>Submitting...</p>;
    if (data) closeModal(); // if we're successful, then close the edit screen

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={EditProfileSchema}
            onSubmit={handleSubmit}
        >
            <Form>
                <EditProfileDiv>
                    <EditProfileField name="firstName" type="text" label="First Name" />
                    <EditProfileField name="lastName" type="text" label="Last Name" />
                    <EditPhoneField name="phone" type="tel" label="Phone" />
                    <EditProfileButton type="submit" >Submit</EditProfileButton>
                </EditProfileDiv>
            </Form>
        </Formik>
    )
}

export default EditProfile;