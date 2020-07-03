import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";

import Modal from "react-modal";

import EditProfile from "./EditProfile";

import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'

Modal.setAppElement("#app");

const customStyles = {
    content : {
        background: '#223244',
    }
};

const PageDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-left: 5vh;
    margin-right: 5vh;
    width: 95vw;
    height: auto;
    padding-bottom: .5vh;
`
const Button = styled.div`
    text-decoration: underline;
    text-underline-position: under;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
`

const ProfileCardDiv = styled.div`
    padding-top: 5vh;
    padding-bottom: 5vh;
    background: #223244;
    color: white;
    font-family: Avenir;
`

const ProfileCardName = styled.a`
    font-size: 9vh;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
`
const ProfileContactDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 19vh;
    font-size: 3vh;
`

const ProfileCardPhone = styled.a`
`

const ProfileCardEmail = styled.a`
`

const ProfileImage = styled.img`
    max-width: 8em; 
    max-height: 8em;
    padding: 2em 0 0 0;
`

const ContainerDiv = styled.div `
    margin: 0;
    padding: 0;
`;

const ProfileDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

/**
 * TODO: MOVE TO FRAGMENTS FOLDER; this is the SAME call we make in Routes.js because that call is cached...
 */
const GET_USER_INFO = gql`
    query GetUserInfo {
        user @client {
            _id
            firstName
            lastName
            netid
            phone
        }
    }
`

// const Button = styled.div`
//     margin-top: 10px;
//     background-color: #359d99;
//     border: none;
//     color: white;
//     min-width: 150px;
//     min-height: 50px;
//     text-align: center;
//     vertical-align: middle;
//     line-height: 2.7;
//     transition: background-color .2s linear;
//     &:hover {
//         background-color: #4ec2bd;
//     }
// `

const Profile = ({}) => {
    // For the modal
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Get user info by running cached operation
    const { data, loading, error } = useQuery(GET_USER_INFO);

    if (error) return <p>Error...</p>;
    if (loading) return <p>Wait...</p>;
    if (!data) return <p>No data...</p>;

    const { user } = data;

    function sendEmail() {
        window.location = "mailto:" + user.netid + "@rice.edu";
    }

    return (
        <ContainerDiv>
        <ProfileDiv>
            <ProfileCardDiv user={user}>
                <PageDiv>
                    <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                    <ProfileContactDiv>
                        <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                        <Button onClick={sendEmail}>
                            <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                        </Button>
                        <Button onClick={openModal}>
                            Edit
                        </Button>
                    </ProfileContactDiv>
                </PageDiv>
            </ProfileCardDiv>
            
            <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
                <EditProfile 
                closeModal={closeModal} 
                user={user}
                />
            </Modal>
        </ProfileDiv>
        </ContainerDiv>
    )
}

export default Profile;