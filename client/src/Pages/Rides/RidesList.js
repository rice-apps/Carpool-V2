import React, { useState, createContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import Select from "react-select";
import { transformToRSOptions } from "../../utils/RideUtils";

const RideCardList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const RideCardItem = styled.div`
    position: relative;
    height: 10em;
    width: 30em;
    overflow: hidden; /* need this to ensure no weird text transform effect */
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.2s;

    :hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);

        & > div:first-of-type { // frontside of the card
            height: 0px;
            transform: perspective(1000px) rotateX(-180deg);
        }

        & > div:last-of-type { // backside of the card
            transform: perspective(1000px) rotateX(0deg);
        }
    }
`

// Card sides
const CardSide = css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: all .2s ease;
`

const RideCardFront = styled.div`
    ${CardSide}
`

const RideCardBack = styled.div`
    ${CardSide}
    transform: rotateX(-180deg);
    background-color: ${props => props.joined ? "red" : "green"};
`

const RideJoinButton = styled.button`
    height: 15px;
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
            <RideCardFront>
                <RideCardDate>
                    <Day>{departureMoment.format("DD").toString()}</Day>
                    <Month>{departureMoment.format("MMM").toString()}</Month>
                    <Year>{departureMoment.format("YYYY").toString()}</Year>
                </RideCardDate>
                <RideCardText>
                    <p>{departureLocation.title} -> {arrivalLocation.title}</p>
                    <p>{departureMoment.format("hh:mm a")}</p>
                    <p>{spots - riders.length} spots</p>
                </RideCardText>
            </RideCardFront>
            <RideCardBack 
            joined={joined}
            >
            { rideFull ? "Sorry, this ride is full." : 
                <RideJoinButton joined={joined} disabled={rideFull}>
                    {joined ? "Leave this ride." : "Join this ride!" }
                </RideJoinButton>
            }
            </RideCardBack>
        </RideCardItem>
    )
}

const FilterDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 15vw;
`

const LocationFilterDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    max-width: 100%;
`

const LocationFilter = ({ label, options }) => {

    return (
        <LocationFilterDiv>
            <p>{label}</p>
            <Select
            name={label}
            options={options}
            onChange={(selected) => console.log("Hello!")}
            styles={{ container: (styles) => ({ ...styles, width: "100px" }) }}
            />
        </LocationFilterDiv>
    )
}

const FilterOptions = ({ }) => {
    const { data, loading, error } = useQuery(GET_LOCATIONS);

    if (error || loading) return <p>Waiting...</p>;

    let { locationMany: locations } = data;

    return (
        <FilterDiv>
            <LocationFilter label="Departing to" options={transformToRSOptions(locations)} />
            <LocationFilter label="Arriving at" options={transformToRSOptions(locations)} />
            <LocationFilter label="Departure date" />
        </FilterDiv>
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
            <FilterOptions />
            {rides.map(ride => <RideCard ride={ride} />)}
        </RideCardList>
    )
}

export default RidesList;