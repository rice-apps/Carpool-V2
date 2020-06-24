import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import Modal from "react-modal";
import RideCreate from "./RideCreation";
import RidesList from "./RidesList";

Modal.bind("#app");

const ContainerDiv = styled.div `
    ${props => `background: #142538;`}
`;

const GET_LOCATIONS = gql`
    query GetLocations {
        locationMany {
            _id
            title
        }
    }
`

const Rides = ({ }) => {
    const [modalOpen, setModalOpen] = useState(false);
    
    // Load it up here so we can use it in multiple places later
    const { data: locationData, 
        loading: locationLoading, 
        error: locationError } = useQuery(GET_LOCATIONS);

    if (locationError) return <p>Error.</p>;
    if (locationLoading) return <p>Loading...</p>;
    if (!locationData) return <p>No data...</p>;

    // Gets the locationMany property from the query
    const { locationMany: locations } = locationData;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <button onClick={openModal}>Create Ride</button>
            <RidesList />
            <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            >
                <RideCreate 
                closeModal={closeModal} 
                locations={locations}
                />
            </Modal>
        </div>
    )
}

export default Rides;