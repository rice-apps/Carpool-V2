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
import EditProfile from "./EditProfile2";

import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'
import Logo from "../../assets/destination_linkage_vertical.svg"
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

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


const Logout = styled.div`
    background-color: black;
    color: #E8CA5A;
    text-align: center;
    text-decoration: none;
    border-style: solid;
    border-color: #E8CA5A;
    border-radius: 10px;
    display: inline-block;
    font-size: 3.5vh;
    cursor: pointer;
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

const ConfirmButton = styled.button`
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

const P = styled.p`
    margin-bottom:4vh;
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
    font-family: AvenirLTStd-Book;
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
    justify-content: space-around;
    height: 19vh;
    font-size: 3vh;
    font-family: AvenirLTStd-Book;
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
const HeaderDiv = styled.div `
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin:5vh 5vw;
    margin-bottom:0;
    width: 90vw;
    justify-items: center;
    height: 3vh;
    padding-bottom: .5vh;
    font-family: AvenirLTStd-Book;
    color: white;
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
    font-family: AvenirLTStd-Book;
    color: white;
`;

const RideDiv = styled.div `
    border-right: 0.3vh solid #E8CA5A;
    padding-left:11.5vw;
    padding-right:11.5vw;
    width:22vw;
    margin-bottom:4vh;
`

const RideDiv2 = styled.div `
    margin-bottom:4vh;
    width:22vw;
`;



const RideBox = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0 1vw 2vw 0 rgba(0,0,0,0.4);
    margin-top: 5vh;
    padding: 1vh 2vw;
    padding-right:0;
    width: 20vw;
    line-height: 3.5vh;
`;

const RideLocations = styled.div`
    grid-column: 2 / 9;
    display: flex;
    flex-direction: column;
    margin-left:-0.5vw;
`

const IllusColumn = styled.div`
    display: grid;
    grid-template-columns:repeat(10,10%);
`

const StyledIcon = styled.div`
    grid-column: 1 / 2;
    margin-left: -.8vw;
    margin-top: 1.25vh;
    font-size: 2em;
    opacity:30%;
`



const RideHeader = styled.div`
    text-align: center;
    color: white;
    font-size: 3vh;
    font-weight: bold;
    letter-spacing:0.08vh;
    margin-bottom:-2vh;
`


const StyledLink = styled(Link)`
        color: white;
        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `

const GET_USER_INFO = gql`
    query GetUserInfo {
        user {
            _id
            firstName
            lastName
            netid
            phone
        }
    }
`


const RideCard = ({ ride }) => {
    let { arrivalLocation, departureDate, departureLocation, spots, _id } = ride;
    let departureMoment = moment(departureDate);

    return (
        <RideBox>
            <Time>
                {departureMoment.format("DD").toString()} {departureMoment.format("MMM").toString()} {departureMoment.format("YYYY").toString()}, {departureMoment.format("hh:mm a")}
            </Time>
            {/* <a> # of spots: {spots}</a> */}
            Click me for more info!
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
    );
}





const Profile = ({}) => {
    // console.log("HELLLOOOOO");

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

    // console.log(user._id);
    // console.log(user);
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
    // console.log("rides");
    // console.log(rides);

    const previousrides = rides.filter(ride => moment(ride.departureDate) < new Date())
    previousrides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))
    // console.log('previousrides')
    // console.log(previousrides)
    const upcomingrides = rides.filter(ride => moment(ride.departureDate) >= new Date())
    upcomingrides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))
    // console.log('upcomingrides')
    // console.log(upcomingrides)

    const handleLogout = () => {
        confirmAlert({
        customUI: ({ onClose }) => {
            return (
            <Popupdiv>
                <h1>Are you sure?</h1>
                <P>Do you want to logout?</P>
                <Buttondiv>
                <ConfirmButton onClick={onClose}>Keep me logged in!</ConfirmButton>
                <ConfirmButton
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload(true);
                    }}
                    >
                        Yes, logout!
                </ConfirmButton>
                </Buttondiv>
            </Popupdiv>
            );
        }
        });
    }

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
                        <Logout onClick={()=>handleLogout()}>
                            Logout
                        </Logout>
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
            <HeaderDiv>
                <RideHeader>Upcoming Rides</RideHeader>
                <RideHeader>Past Rides</RideHeader>
            </HeaderDiv>
            <BottomContainerDiv>
                <RideDiv>
                    {upcomingrides.sort((a, b) => moment(a.departureDate) - moment(b.departureDate)).map(ride => <StyledLink to={`/rides/${ride._id}`}><RideCard ride={ride} /></StyledLink>)}
                </RideDiv>
                <RideDiv2>
                    {previousrides.map(ride => <StyledLink to={`/rides/${ride._id}`}><RideCard ride={ride} /></StyledLink>)}
                </RideDiv2>
            </BottomContainerDiv>
            
        </ContainerDiv>
        
    )
}

export default Profile;