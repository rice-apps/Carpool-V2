import styled, { css } from "styled-components";
import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation} from "@apollo/client";
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faLongArrowAltDown,
    faTrash
} from '@fortawesome/free-solid-svg-icons'
import moment from "moment";



const RideLocations = styled.div`
    grid-column: 2 / 9;
    display: flex;
    flex-direction: column;
`

const RideBox = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1.5px;
    border-color: #223244;
    margin-top: 5vh;
    padding: 1vh 1vw;
    width: 20vw;
    line-height: 3.5vh;
    color:white;
`;


const IllusColumn = styled.div`
    display: grid;
    grid-template-columns:repeat(10,10%);
`

const Time = styled.a`
    font-weight: bold;
`

const StyledIcon = styled.div`
    grid-column: 1 / 2;
    margin-right: .5vw;
    margin-top: 1.25vh;
    font-size: 2em;
`
const StyledIcon2 = styled.div`
    grid-column: 10 / 11;
    margin-right: .5vw;
    margin-left: 1.7vw;
    margin-top: 3vh;
    font-size: 1em;
    &:hover {
        font-size: 1.3em;
    }
`


const GET_RIDE = gql`
    query GetRide($_id: MongoID!) {
        rideOne (filter: {_id: $_id}) { 
            departureDate
            departureLocation {
                title
            }
            arrivalLocation {
                title
            }
            spots
            riders{
                firstName
                lastName
                phone
            }
            note
            _id
        }
    }
`
const DELETE_RIDE = gql`
    mutation DeleteRide($_id: MongoID!) {
        rideDeleteOne(_id: $_id) {
            recordId
            record {
                _id
                __typename
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

const RideCard2 = ({ ride }) => {
    let { arrivalLocation, departureDate, departureLocation, spots, _id } = ride;
    let departureMoment = moment(departureDate);

    const [deleteRide, { data, loading, error }] = useMutation(DELETE_RIDE);  
        
    const handleDelete = () => {
        console.log("ride", ride)
        deleteRide({
            variables: {_id: _id}
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <RideBox>
            <Time>
                {departureMoment.format("DD").toString()} {departureMoment.format("MMM").toString()} {departureMoment.format("YYYY").toString()}, {departureMoment.format("hh:mm a")}
            </Time>
            <a> # of spots: {spots}</a>
            <IllusColumn>
                <StyledIcon>
                    <FontAwesomeIcon icon={faLongArrowAltDown}/>
                </StyledIcon>
                <RideLocations>
                    <a>{departureLocation.title}</a>
                    <a>{arrivalLocation.title}</a>
                </RideLocations>
                <StyledIcon2>
                    <FontAwesomeIcon 
                    icon={faTrash}
                    onClick={()=>handleDelete()}
                    />
                </StyledIcon2>
            </IllusColumn>
        </RideBox>
    );
}


const RideCardInfo = ({ }) => {
    let { id } = useParams();
    const rideID = id;
    
    const { data, loading, error } = useQuery(GET_RIDE, {
        variables: { _id: rideID },
      });
    ;
    if (error) return <p>Error...</p>;
    if (loading) return <p>loading...</p>;

    let { rideOne: RideInfo } = data;
    // console.log(RideInfo.departureLocation.title)
    
    return (
    <RideCard2 ride={RideInfo}/>
    )
}

export default RideCardInfo



// /**
// * Helper Functions
// */

// /**
// * Check whether a user is already part of the ride.
// * @param {*} userID 
// * @param {*} ride 
// */
// const checkJoined = (userID, ride) => {
//     if (userID == ride.owner._id) return true; // saves us some computational power from executing the next line
//     if (ride.riders.map(rider => rider._id).includes(userID)) return true;
//     return false;
// }

// /**
// * Checks whether the ride is full
// * @param {*} ride 
// */
// const checkFull = (ride) => {
//     if (ride.riders.length == ride.spots) {
//         return true;
//     }
//     return false;
// }

// console.log(ride)
    // // Get properties from ride object
    // let { owner, riders, departureDate, departureLocation, arrivalLocation, spots } = ride;
    // // Get UserID from our local state management in apollo
    // let { userID } = useQuery(GET_USER_INFO);

    // // Transform departure date object into a moment object so we can use it easily
    // let departureMoment = moment(departureDate);

    // // Check if the current user is already part of this ride
    // let joined = checkJoined(userID, ride);

    // // If the ride is full, disable ability to join
    // let rideFull = checkFull(ride);