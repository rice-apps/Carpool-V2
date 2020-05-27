import React, { useState, createContext, useEffect } from "react";
import styled from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";

const RideCardList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const RideCardItem = styled.div`
    display: flex;
    flex-direction: row;
    height: 10em;
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

const RideCardDate = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const RideCardText = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 3;
    align-items: center;
`

const Day = styled.h1`
    font-size: 3em;
    margin-bottom: 0px;
`

const Month = styled.p`
    flex-grow: 1;
    margin-bottom: 0px;
`

const Year = styled.p`
    flex-grow: 1;
    margin-top: 0px;
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
            <RideCardDate>
                <Day>{departureMoment.format("DD").toString()}</Day>
                <Month>{departureMoment.format("MMM").toString()}</Month>
                <Year>{departureMoment.format("YYYY").toString()}</Year>
            </RideCardDate>
            <RideCardText>
                <p>{departureLocation.title} -> {arrivalLocation.title}</p>
                <p>{departureMoment.format("hh:mm a")}</p>
                <p>{spots - riders.length} spots</p>
                { rideFull ? "Sorry, this ride is full." : 
                    <RideJoinButton joined={joined} disabled={rideFull}>
                        {joined ? "Leave this ride." : "Join this ride!" }
                    </RideJoinButton>
                }
            </RideCardText>
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

export default RidesList;