import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";

import Modal from "react-modal";

import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";

Modal.setAppElement("#app");

const ProfileDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

/**
 * TODO: MOVE TO FRAGMENTS FOLDER; this is the SAME call we make in Routes.js because that call is cached...
 */
const VERIFY_USER = gql`
    query VerifyQuery($token: String!) {
        verifyUser(token:$token) {
            _id
            firstName
            lastName
            netid
            phone
            token
            recentUpdate
        }
    }
`;

const ProfileCardEditButton = styled.button`
    width: 30px;
`

const Profile = ({}) => {
    // For the modal
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Get user info by running cached operation
    const { data, loading, error } = useQuery(VERIFY_USER, { variables: { token: localStorage.getItem('token') } });

    if (error) return <p>Error...</p>;
    if (loading) return <p>Wait...</p>;
    if (!data) return <p>No data...</p>;

    const { verifyUser: user } = data;

    return (
        <ProfileDiv>
            <ProfileCard user={user} />
            <ProfileCardEditButton onClick={openModal}>
                Edit
            </ProfileCardEditButton>
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
    )
}

export default Profile;