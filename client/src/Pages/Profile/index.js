import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";

import Modal from "react-modal";

import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";

Modal.setAppElement("#app");

const ContainerDiv = styled.div `
    margin: 0;
    padding: 0;
    ${props => `background: #142538;`}
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

const Button = styled.div`
    margin-top: 10px;
    background-color: #359d99;
    border: none;
    color: white;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
    vertical-align: middle;
    line-height: 2.7;
    transition: background-color .2s linear;
    &:hover {
        background-color: #4ec2bd;
    }
`

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

    return (
        <ContainerDiv>
        <ProfileDiv>
            <ProfileCard user={user} />
            <Button onClick={openModal}>
                Edit
            </Button>
            <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
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