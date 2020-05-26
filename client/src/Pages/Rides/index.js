import React, { useState, createContext, useEffect } from "react";
import styled from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import Modal from "react-modal";
import RideCreate from "./RideCreation";

Modal.bind("#app");

const RideCardList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const RideCardItem = styled.div`
    height: 15em;
    width: 30em;
    flex-grow: 2;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    :hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
`

const RideJoinButton = styled.button`
    background-color: ${props => props.joined ? "red" : "green"};
`

const GET_ALL_RIDES = gql`
    query GetAllRides {
        rideMany(limit:10) {
            _id
            departureDate
            spots
            departureLocation {
                title
            }
            arrivalLocation {
                title
            }
            owner {
                netid
            }
            riders {
                netid
            }
        }
    }
`

/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: MOVE TO FRAGMENT FOLDER; THIS IS ALSO IN ROUTES.JS
 */
const GET_USER_INFO = gql`
    query GetUserInfo {
        recentUpdate @client
        userID @client
    }
`

const GET_LOCATIONS = gql`
    query GetLocations {
        locationMany {
            _id
            title
        }
    }
`

/**
 * Helper Functions
 */

/**
 * Check whether a user is already part of the ride.
 * @param {*} userID 
 * @param {*} ride 
 */
const checkJoined = (userID, ride) => {
    if (userID == ride.owner._id) return true; // saves us some computational power from executing the next line
    if (ride.riders.map(rider => rider._id).includes(userID)) return true;
    return false;
}

/**
 * Checks whether the ride is full
 * @param {*} ride 
 */
const checkFull = (ride) => {
    if (ride.riders.length == ride.spots) {
        return true;
    }
    return false;
}

const RideCard = ({ ride }) => {
    // Get properties from ride object
    let { owner, riders, departureDate, departureLocation, arrivalLocation, spots } = ride;
    // Get UserID from our local state management in apollo
    let { userID } = useQuery(GET_USER_INFO);

    // Transform departure date object into a moment object so we can use it easily
    let departureMoment = moment(departureDate);

    // Check if the current user is already part of this ride
    let joined = checkJoined(userID, ride);

    // If the ride is full, disable ability to join
    let rideFull = checkFull(ride);
    return (
        <RideCardItem>
            <p>Owner: {owner.netid}</p>
            <p>Departing from: {departureLocation.title}</p>
            <p>Arriving at: {arrivalLocation.title}</p>
            <p>Departing at: {departureMoment.format("MM/DD/YYYY")}</p>
            <p>Spots Left: {spots - riders.length}</p>
            { rideFull ? "Sorry, this ride is full." : 
                <RideJoinButton joined={joined} disabled={rideFull}>
                    {joined ? "Leave this ride." : "Join this ride!" }
                </RideJoinButton>
            }
        </RideCardItem>
    )
}

const RidesList = ({ }) => {
    const { data, loading, error } = useQuery(GET_ALL_RIDES);

    if (error) return <p>Error.</p>;
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data...</p>;

    const { rideMany: rides } = data;

    return (
        <RideCardList>
            {rides.map(ride => <RideCard ride={ride} />)}
        </RideCardList>
    )
}

const Rides = ({ }) => {
    const [modalOpen, setModalOpen] = useState(false);
    // Load it up here so we can use it in multiple places later
    const { data: locationData, 
        loading: locationLoading, 
        error: locationError } = useQuery(GET_LOCATIONS);

    if (locationError) return <p>Error.</p>;
    if (locationLoading) return <p>Loading...</p>;
    if (!locationData) return <p>No data...</p>;

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
                <RideCreate closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default Rides;