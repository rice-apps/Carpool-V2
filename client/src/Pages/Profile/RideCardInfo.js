import styled, { css } from "styled-components";
import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation} from "@apollo/client";
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { useParams } from 'react-router'
import moment from "moment";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Logo from "../../assets/destination_linkage_vertical.svg"
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css



const RideDiv = styled.div`
    margin-left:37vw;
    margin-right:37vw;
    margin-top:5vh;
`
const RideLocations = styled.div`
    grid-column: 2 / 9;
    display: flex;
    flex-direction: column;
    margin-left:-0.5vw;
`

const RideBox = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1.5px;
    border-color: #223244;
    padding: 1vh 2vw;
    padding-right:0;
    line-height: 3.5vh;
    color:white;
`;
const NoteBox = styled.div`
    border-style: solid;
    border-width: 1.5px;
    border-top:0px;
    border-color: #223244;
    padding: 1vh 2vw;
    padding-right:1vw;
    line-height: 2.5vh;
    color:white;
    word-wrap: break-word
`;

const NameCard = styled.div`
    display:flex;
    justify-content:space-between;
    align-items: center;
    height:10vh;
    margin-top:3vh;
    border-style: solid;
    border-width: 1.5px;
    border-color: #223244;
    border-radius: 3vh;
    padding: 0vh 1.5vw;
    line-height: 3.5vh;
    color:white;
    background-color:#223244
`;

const ProfileContactDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 2vh;
    font-family: acari-sans.light;
`

const ProfileCardName = styled.a`
    font-size: 3vh;
`

const ProfileCardPhone = styled.a`
    
`

const ProfileCardEmail = styled.a`
   
`


const IllusColumn = styled.div`
    display: grid;
    grid-template-columns:repeat(10,10%);
`

const Time = styled.a`
    font-weight: bold;
`

const StyledIcon = styled.div`
    grid-column: 1 / 2;
    margin-left: -.8vw;
    margin-top: 1.25vh;
    font-size: 2em;
    opacity:30%;
`


const RideDeleteButton = styled.button`
    text-align: center;
    font-size: 2vh;
    color: white;
    background-color: #142538;
    color: #FFFFFF4D;
    text-decoration: none;
    border-style: solid;
    border-color: #FFFFFF4D;
    border-radius: 10px;
    border-width: 0.1vh;
    display: inline-block;
    cursor: pointer;
    height:4vh;
    outline:none;
    &:focus, &:hover, &:visited, &:link, &:active {
        background-color: #FFFFFF4D;
    }
    margin-left:9vw;
    margin-right:8vw;
    margin-top:3vh;
`

const RideLeaveButton = styled.button`
    text-align: center;
    font-size: 2vh;
    color: white;
    background-color: #142538;
    color: #FFFFFF4D;
    text-decoration: none;
    border-style: solid;
    border-color: #FFFFFF4D;
    border-radius: 10px;
    border-width: 0.1vh;
    display: inline-block;
    cursor: pointer;
    height:4vh;
    outline:none;
    &:focus, &:hover, &:visited, &:link, &:active {
        background-color: #FFFFFF4D;
    }
    margin-left:9vw;
    margin-right:8vw;
    margin-top:3vh;
`

const Button = styled.button`
text-align: center;
font-size: 2vh;
color: white;
background-color: #142538;
color: white;
text-decoration: none;
border-style: solid;
border-color: white;
border-radius: 10px;
border-width: 0.1vh;
display: inline-block;
cursor: pointer;
height:4vh;
width:10vw;
outline:none;
&:focus, &:hover, &:visited, &:link, &:active {
    background-color: #FFFFFF4D;
}
    `

const Popupdiv = styled.div `
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    background-color:white;
    width:25vw;
    height:20vh;
    border-radius:2vh;
    text-align:center;
    padding-bottom:5vh;
    background-color:#142538;
    color:white;
`
const Buttondiv = styled.div `
    display:flex;
    justify-content:space-evenly;
`

const P = styled.p`
    margin-bottom:4vh;
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
                netid
            }
            note
            _id
            owner{
                firstName
                lastName
                phone
                netid
            }
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

const REMOVE_RIDER = gql`
    mutation RemoveRider($_id: ID!) {
        removeRider(rideID: $_id) {
            _id
        }
    }
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

const checkPast = (depatureMoment) => {
    if (depatureMoment < new Date()) {
        return true;
    }
    return false
}

const ProfileCard = ({person}) => {
    return (
        <NameCard>
            <ProfileCardName>{person.firstName} {person.lastName}</ProfileCardName>
            <ProfileContactDiv>
                <ProfileCardPhone>{formatPhoneNumber("+"+person.phone)}</ProfileCardPhone>
                <ProfileCardEmail>{person.netid}@rice.edu</ProfileCardEmail>
            </ProfileContactDiv>
        </NameCard>
    )
    
}



const RideCardInfo = ({ }) => {
    let { id } = useParams();
    const rideID = id;
    
    const { data, loading, error } = useQuery(GET_RIDE, {
        variables: { _id: rideID },
      });
    ;

   

    const [deleteRide, { data2, loading2, error2 }] = useMutation(DELETE_RIDE);  
        
    const handleDelete = () => {
        deleteRide({
            variables: {_id: rideID}
        })

        .catch((error2) => {
            console.log(error2);
        });
    };

    const handleDeleteButton = (departureLocation,arrivalLocation,departureDate) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popupdiv>
                    <h1>Are you sure?</h1>
                    <P>You want to delete this Ride?</P>
                    <Buttondiv>
                    <Button onClick={onClose}>No, Keep it!</Button>
                        <Button
                            onClick={() => {
                                handleDelete();
                                fetch(`http://localhost:3000/send-text?departureLoc=${departureLocation.title}&arrivalLoc=${arrivalLocation.title}&departureDate=${departureDate}`)
                                .catch(err => console.error(err))
                                onClose();
                                window.location="../profile";
                            }}
                            >
                                Yes, Delete it!
                        </Button>
                    </Buttondiv>
                </Popupdiv>
              );
            }
          });
    }

    const [removeRider, { data3, loading3, error3 }] = useMutation(
        REMOVE_RIDER
    );  

    const handleLeave = () => {
            removeRider({
                variables: {_id: rideID}
            })
            .catch((error3) => {
                console.log("Oh no.");
            });
    }

    const handleLeaveButton = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popupdiv>
                    <h1>Are you sure?</h1>
                    <P>You want to leave this Ride?</P>
                    <Buttondiv>
                    <Button onClick={onClose}>No, Keep it!</Button>
                    <Button
                        onClick={() => {
                            handleLeave();
                            onClose();
                            window.location="../profile";
                        }}
                        >
                            Yes, Leave this ride!
                    </Button>
                    </Buttondiv>
                </Popupdiv>
              );
            }
          });
    }

    // Get UserID from our local state management in apollo
    const userData = useQuery(GET_USER_INFO);
    const userNetID = userData.data.user.netid;
    // console.log(userData)

    if (error) return <p>Error...</p>;
    if (loading) return <p>loading...</p>;
    

    let { rideOne: ride } = data;

    let { arrivalLocation, departureDate, departureLocation, spots, _id, note, owner,riders } = ride;
    
    
    // Transform departure date object into a moment object so we can use it easily
    let departureMoment = moment(departureDate);

    // Check if the ride is a past ride
    let past = checkPast(departureMoment);
    // Check if the current user is already part of this ride
    let joined = checkJoined(userNetID, ride);
    // If the ride is full, disable ability to join
    let rideFull = checkFull(ride);
    let isOwner = ride.owner.netid == userNetID;

    let canleave = !past && !isOwner
    let candelete = !past && isOwner

    let CorrectButton

    if (canleave) {
        CorrectButton = <RideLeaveButton onClick={()=>handleLeaveButton()}>Leave this Ride</RideLeaveButton>
    } else if (candelete) {
        CorrectButton = <RideDeleteButton onClick={()=>handleDeleteButton(departureLocation,arrivalLocation,departureDate)}>Delete this Ride</RideDeleteButton>
    }

    return (
        <RideDiv>
            <RideBox>
                <Time>
                    {departureMoment.format("DD").toString()} {departureMoment.format("MMM").toString()} {departureMoment.format("YYYY").toString()}, {departureMoment.format("hh:mm a")}
                </Time>
                <a> # of spots: {spots}</a>
                <IllusColumn>
                    <StyledIcon>
                        <img src={Logo} width="40vw" height="40vh"/>
                    </StyledIcon>
                    <RideLocations>
                        <a>{departureLocation.title}</a>
                        <a>{arrivalLocation.title}</a>
                    </RideLocations>
                </IllusColumn>
            </RideBox>
            <NoteBox>
                Note: {note}
            </NoteBox>
            {CorrectButton}
            <ProfileCard person={owner}></ProfileCard>
            {riders.map(rider => <ProfileCard person={rider}/>)}
        </RideDiv>
    )
    
}

export default RideCardInfo





