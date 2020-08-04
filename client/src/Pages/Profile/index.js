import styled, { css } from "styled-components";
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import moment from "moment";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faLongArrowAltDown,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

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

const Button = styled.div`
    text-decoration: underline;
    text-underline-position: under;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
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



const GET_RIDES = gql`
    query GetRides($_id: MongoID) {
        userOne (filter: {_id: $_id}) {
            rides {
                departureDate
                departureLocation {
                    title
                }
                arrivalLocation {
                    title
                }
                spots
                _id
                owner{
                    netid
                    _id
                }
                riders{
                    firstName
                    lastName
                    phone
                }
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

/**
* This simply fetches from our cache whether a recent update has occurred
* TODO: MOVE TO FRAGMENT FOLDER; THIS IS ALSO IN ROUTES.JS
*/
// const GET_USER_INFO = gql`
//     query GetUserInfo {
//         recentUpdate @client
//         userID @client
//     }
// `

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
    font-family: acari-sans.light;
`

const ProfileCardPhone = styled.a`
`

const ProfileCardEmail = styled.a`
`

const ProfileCardEdit = styled.a`
    cursor: pointer;
`


const Time = styled.a`
    font-weight: bold;
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

const BottomContainerDiv = styled.div `
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-left: 5vw;
    margin-right: 5vw;
    width: 90vw;
    justify-items: center;
    height: auto;
    padding-bottom: .5vh;
    font-family: acari-sans.light;
    color: white;
`;

const RideDiv = styled.div `
    border-right: 0.3vh solid #E8CA5A;
    padding-left:9.5vw;
    padding-right:9.5vw;
    margin-top:4vh;
    margin-bottom:4vh;
`

const RideDiv2 = styled.div `
    margin-top:4vh;
    margin-bottom:4vh;
`;



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
`;

const RideLocations = styled.div`
    grid-column: 2 / 9;
    display: flex;
    flex-direction: column;
`

const IllusColumn = styled.div`
    display: grid;
    grid-template-columns:repeat(10,10%);
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



const RideHeader = styled.div`
    padding-left: 1vh;
    text-align: left;
    color: white;
    font-size: 3vh;
    font-weight: bold;
    letter-spacing:0.08vh;
    margin-bottom:-2vh;
`
const RideJoinButton = styled.button`
    grid-column: 9 / 12;
    text-align: center;
    font-size: 2vh;
    color: white;
    background-color: #142538;
    color: #FFFFFF4D;
    text-decoration: none;
    border-style: solid;
    border-color: #FFFFFF4D;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
    height:5vh;
`

const StyledLink = styled(Link)`
        color: white;
        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
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


const RideCard1 = ({ ride }) => {
    let { arrivalLocation, departureDate, departureLocation, spots, _id } = ride;
    let departureMoment = moment(departureDate);

    const [deleteRide, { data, loading, error }] = useMutation(
        DELETE_RIDE,
    );  

    
    const handleDelete = () => {
        console.log("ride", ride)
        deleteRide({
            variables: {_id: ride._id}
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
                <RideJoinButton>
                    {"Leave ride"}
                </RideJoinButton>
            </IllusColumn>
        </RideBox>
    );
}

const RideCard2 = ({ ride }) => {
    let { arrivalLocation, departureDate, departureLocation, spots, _id } = ride;
    let departureMoment = moment(departureDate);

    const [deleteRide, { data, loading, error }] = useMutation(
        DELETE_RIDE,
    );  
        
    const handleDelete = () => {
        console.log("ride", ride)
        deleteRide({
            variables: {_id: ride._id}
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



const Profile = ({}) => {
    console.log("HELLLOOOOO");

    // For the modal
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [getVariables, setVariables] = useState({});

    // Get user info by running cached operation
    const { data, loading, error } = useQuery(GET_USER_INFO);

    const { user } = data;

    // if (error2) return <p>Error.</p>;
    // if (loading2) return <p>Loading...</p>;
    // if (!data2) return <p>No data...</p>;

    // const { rideMany: rides } = data2;

    console.log(user._id);
    const [fetchRides, { called, loading: rideLoading, data: rideData }] = useLazyQuery(GET_RIDES);

    useEffect(() => {
        if (user._id) {
            fetchRides({ variables: {_id: user._id}});
        }
    }, [rideData]);

    // console.log("called");
    // console.log(called);
    // console.log("loading");
    // console.log(rideLoading);
    // console.log("data");
    // console.log(rideData);

    if (error) return <p>Error...</p>;
    if (loading) return <p>Wait...</p>;
    if (!data) return <p>No data...</p>;
    if (called && rideLoading) return <p>Loading ...</p>
    if (!rideData) return <p>No data...</p>;

    const rides = rideData["userOne"]["rides"];
    console.log("rides");
    console.log(rides);

    const previousrides = rides.filter(ride => moment(ride.departureDate) < new Date())
    previousrides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))
    // console.log('previousrides')
    // console.log(previousrides)
    const upcomingrides = rides.filter(ride => moment(ride.departureDate) >= new Date())
    upcomingrides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))
    // console.log('upcomingrides')
    // console.log(upcomingrides)

    return (
        <ContainerDiv>
            <ProfileDiv>
                <ProfileCardDiv user={user}>
                    <PageDiv>
                        <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                        <ProfileContactDiv>
                            <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                            <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                            <ProfileCardEdit>
                                <Button onClick={openModal}>
                                    Edit
                                </Button>
                            </ProfileCardEdit>
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
            <BottomContainerDiv>
                <RideDiv>
                    <RideHeader>Upcoming Rides</RideHeader>
                    {upcomingrides.map(ride => <RideCard1 ride={ride} />)}
                </RideDiv>
                <RideDiv2>
                    <RideHeader>Previous Rides</RideHeader>
                    {previousrides.map(ride => <StyledLink to={`/rides/${ride._id}`}><RideCard2 ride={ride} /></StyledLink>)}
                </RideDiv2>
            </BottomContainerDiv>
            
        </ContainerDiv>
        
    )
}

export default Profile;