import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import moment from "moment";
import Modal from "react-modal";
import Linkage from "../../assets/destination_linkage_vertical.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faLongArrowAltDown
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
const Button = styled.div`
    text-decoration: underline;
    text-underline-position: under;
    min-width: 150px;
    min-height: 50px;
    text-align: center;
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

const ProfileImage = styled.img`
    max-width: 8em; 
    max-height: 8em;
    padding: 2em 0 0 0;
`

const Date = styled.a`
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
    margin-left: 5vh;
    margin-right: 5vh;
    width: 95vw;
    justify-items: center;
    height: auto;
    padding-bottom: .5vh;
    font-family: acari-sans.light;
    color: white;
`;

const RideColumn = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1.5px;
    border-color: #223244;
    margin-top: 5vh;
    padding: 1vh 3vw;
    width: 20vw;
    line-height: 3.5vh;
`;

const RideLocations = styled.div`
    display: flex;
    flex-direction: column;
`

const IllusColumn = styled.div`
    display: flex;
    flex-direction: row;
    align-items: left;
`

const StyledIcon = styled.div`
    margin-right: .5vw;
    margin-top: 1.25vh;
    font-size: 2em;
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
            }
        }
    }
`

// const Button = styled.div`
//     margin-top: 10px;
//     background-color: #359d99;
//     border: none;
//     color: white;
//     min-width: 150px;
//     min-height: 50px;
//     text-align: center;
//     vertical-align: middle;
//     line-height: 2.7;
//     transition: background-color .2s linear;
//     &:hover {
//         background-color: #4ec2bd;
//     }
// `

const RideCard = ({ ride }) => {
    let { arrivalLocation, departureDate, departureLocation, spots } = ride;
    let departureMoment = moment(departureDate);

    return (
        <BottomContainerDiv>
            <RideColumn>
                <Date>
                    {departureMoment.format("DD").toString()} {departureMoment.format("MMM").toString()} {departureMoment.format("YYYY").toString()}, {departureMoment.format("hh:mm z")}
                </Date>
                <a> # of spots {spots}</a>
                <IllusColumn>
                    <StyledIcon>
                        <FontAwesomeIcon icon={faLongArrowAltDown}/>
                    </StyledIcon>
                    <RideLocations>
                        <a>{departureLocation.title}</a>
                        <a>{arrivalLocation.title}</a>
                    </RideLocations>
                </IllusColumn>
            </RideColumn>
            <RideColumn>
                Hello
            </RideColumn>
        </BottomContainerDiv>
    );
}

const Profile = ({}) => {
    // For the modal
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Get user info by running cached operation
    const { data, loading, error } = useQuery(GET_USER_INFO);

    const { user } = data;

    function sendEmail() {
        window.location = "mailto:" + user.netid + "@rice.edu";
    }

    console.log(user._id);
    const [fetchRides, { called, loading: rideLoading, data: rideData }] = useLazyQuery(GET_RIDES);

    useEffect(() => {
        if (user._id) {
            fetchRides({ variables: {_id: user._id}});
        }
    }, [rideData]);

    console.log("called");
    console.log(called);
    console.log("loading");
    console.log(rideLoading);
    console.log("data");
    console.log(rideData);

    if (error) return <p>Error...</p>;
    if (loading) return <p>Wait...</p>;
    if (!data) return <p>No data...</p>;
    if (called && rideLoading) return <p>Loading ...</p>
    if (!rideData) return <p>No data...</p>;

    // const { userOne: rides } = rideData;
    const rides = rideData["userOne"]["rides"];
    console.log("rides");
    console.log(rides);

    return (
        <ContainerDiv>
            <ProfileDiv>
                <ProfileCardDiv user={user}>
                    <PageDiv>
                        <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                        <ProfileContactDiv>
                            <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                            <Button onClick={sendEmail}>
                                <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                            </Button>
                            <Button onClick={openModal}>
                                Edit
                            </Button>
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
            <div>
                {rides.map(ride => <RideCard ride={ride} />)}
            </div>
        </ContainerDiv>
    )
}

export default Profile;