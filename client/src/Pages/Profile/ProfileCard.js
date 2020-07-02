import React from "react";
import styled from "styled-components";
import '@availity/yup';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input'

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

const RideJoinButton = styled(Button)`
    height: 100%;
    width: 100%;
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

const GET_RIDES = gql`
    query GetRides($deptDate:Date, $deptLoc:MongoID, $arrLoc:MongoID) {
        rideMany( 
        filter:{
            departureDate:$deptDate, 
            departureLocation:$deptLoc, 
            arrivalLocation:$arrLoc
        }) {
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
    console.log(ride)
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
                <RideJoinButton 
                outlined 
                disabled={rideFull}
                >
                    {joined ? "Leave this ride." : "Join this ride!" }
                </RideJoinButton>
            }
            </RideCardBack>
        </RideCardItem>
    )
}

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
    font-size: 55px;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
`
const ProfileContactDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 19vh;
`

const ProfileCardPhone = styled.a`
    font-size: 20px;
`

const ProfileCardEmail = styled.a`
    font-size: 18px;
`

const ProfileImage = styled.img`
    max-width: 8em; 
    max-height: 8em;
    padding: 2em 0 0 0;
`

const GET_UPCOMING_RIDES = gql`
    query GetUpcomingRides($owner: MongoID!) {
        {
            rideMany (filter: {owner: $owner}) {
              _id
              owner {
                _id
                netid
              }
              departureDate
                  departureLocation {
                    address
                  }
                  arrivalLocation {
                    address
                  }
            }
        }
    }
`

const [getUpcomingRides, { data, loading, error }] = useMutation(
    GET_UPCOMING_RIDES,
);

const ProfileCard = ({ user }) => {
    console.log("HELLLOOOOO");
    const [getVariables, setVariables] = useState({});
    console.log(getVariables);
    const { data, loading, error } = useQuery(
        GET_UPCOMING_RIDES,
        { variables: getVariables }
    );

    if (error) return <p>Error.</p>;
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data...</p>;


    const { rideMany: rides } = data;

    console.log(rides)

    function sendEmail() {
        window.location = "mailto:" + user.netid + "@rice.edu";
    }

    return (
        <ProfileCardDiv>
            <PageDiv>
                <ProfileCardName>{user.firstName} {user.lastName}</ProfileCardName>
                <ProfileContactDiv>
                    <ProfileCardPhone type='tel'>{formatPhoneNumber("+"+user.phone)}</ProfileCardPhone>
                    <Button onClick={sendEmail}>
                        <ProfileCardEmail>{user.netid}@rice.edu</ProfileCardEmail>
                    </Button>
                </ProfileContactDiv>
                {rides.map(ride => <RideCard ride={ride} />)}
            </PageDiv>
            
            
        </ProfileCardDiv>
    )
}

export default ProfileCard;