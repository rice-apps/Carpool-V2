import React, { useState } from "react";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import '../../App.css'

// Form imports
import '@availity/yup';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { useToasts } from "react-toast-notifications";

const EditProfileDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    max-width: 100vw;
    height: 60vh;
    color: white;
    font-family: AvenirLTStd-Book;
    font-size: 3vh;
`
const EditProfileHeader = styled.div`
    font-size: 5vh;
`

const EditProfileFieldDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
`

const EditProfileLabel = styled.label`
    padding: .5rem 1rem;
    border: 1px solid rgba(0,0,0,.125);
    width: 300px;
    border:none;
`

const EditProfileInput = styled.input`
    font-size: 3vh;
    letter-spacing: 0.1vw;
    background-color:#FFFFFF2B;
    border-radius: 1vh;
    color:white;
    border: none;
    width: 15vw;
    height:4.5vh;
    outline: none;
    padding-left: 2vh;
    padding-right: 2vh;
    text-align:left;
    ::-webkit-input-placeholder { 
        font-size:15pt; 
        letter-spacing:1pt;
        font-family: AvenirLTStd-Book;
    }
`

const EditProfileButton = styled.div`
    text-decoration: underline;
    text-underline-position: under;
    text-align: center;
    cursor: pointer;
`

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
    return (
        <EditProfileFieldDiv>
            <EditProfileLabel>
                {label}
            </EditProfileLabel>
            <EditProfileInput {...props} />
        </EditProfileFieldDiv>
    )
}

const EditProfile2 = ({ user, closeModal }) => {
    const { addToast } = useToasts();

    // We want the initial values of form elements to be the current user values that are not _id, typename, token, recentUpdate, and netid
    let { _id, __typename, token, recentUpdate, netid, ...initialValues } = user;
    
    
    // Check if any initialValues are null/undefined
    for (let fieldName of Object.keys(initialValues)) {
        if (!initialValues[fieldName]) {
            initialValues[fieldName] = "";
        }
    }

    // console.log(initialValues);

    const [getInputs, setInputs] = useState(initialValues);

    // Create mutation which we'll use to update the user fields
    const [updateUser, { data, loading }] = useMutation(UPDATE_USER);

    const handleFormChange = (event) => {
        // If value is empty, remove from object
        if (event.target.value == "") {
            // Nice little syntactic sugar to remove property from object: https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90
            let { [event.target.name]: propertyToRemove, ...rest } = getInputs;            
            setInputs(rest);
        } else {
            setInputs({...getInputs, [event.target.name]: event.target.value});
        }
    }

    const handleSubmit = () => {
        // Use mutation
        console.log("GETINPUTSSSSS!!!!!");
        console.log(getInputs);
        if (!getInputs.firstName) {
            addToast("First name required.", { appearance: 'error' });
            return;
        }
        if (!getInputs.lastName) {
            addToast("Last name required.", { appearance: 'error' });
            return;
        }
        if (getInputs.firstName.length < 2 || getInputs.lastName.length < 2) {
            addToast("Too short!", { appearance: 'error' });
            return;
        }
        if (getInputs.firstName.length > 30 || getInputs.lastName.length > 30) {
            addToast("Too long!", { appearance: 'error' });
            return;
        }
        
        if (getInputs.phone.length < 11) {
            addToast("Invalid phone number!", { appearance: 'error' });
            return;
        }
        updateUser({ 
            variables: getInputs 
        })
        .then(() => {
            closeModal();
        })
        .catch((error) => {
            console.log("Oh no.");
        });
    }

    console.log("INIT VALS");
    console.log(initialValues);

    if (loading) return <p>Submitting...</p>;
    if (data) closeModal(); // if we're successful, then close the edit screen

    return (
        <EditProfileDiv>
            <EditProfileHeader>Edit Profile</EditProfileHeader>
            <EditProfileField 
                name="firstName"
                type="text"
                label="First Name"
                defaultValue={initialValues["firstName"]}
                onChange={handleFormChange}
            />
            <EditProfileField
                name="lastName"
                type="text"
                label="Last Name"
                defaultValue={initialValues["lastName"]}
                onChange={handleFormChange}
            />
            <EditProfileFieldDiv>
                <EditProfileLabel>
                    Phone Number
                </EditProfileLabel>
                <PhoneInput
                    country={"us"}
                    // style={customStyles}
                    // defaultValue = {initialValues["phone"]}
                    value = {initialValues["phone"]}
                    onChange={(phone, rawPhone) => setInputs({...getInputs, phone: phone, rawPhone: rawPhone})}
                />
            </EditProfileFieldDiv>
            <EditProfileButton onClick={()=>handleSubmit()} type="submit" >Submit</EditProfileButton>
        </EditProfileDiv>
    )
}

export default EditProfile2;