import React, { useState, createContext, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { MuiPickersUtilsProvider, DateTimePicker, LocalizationProvider, DatePicker,  } from "@material-ui/pickers";
import Select from "react-select";
import { getSelectionDummy } from "../../utils/RideUtils";
import { Button, TextField, Input } from "@material-ui/core";
import {Link} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { useToasts } from "react-toast-notifications";

const RideCardList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: Avenir;
`

const RideCardItem = styled.div`
    position: relative;
    height: 10em;
    width: 40em;
    overflow: hidden; /* need this to ensure no weird text transform effect */
    box-shadow: 0 1vw 2vw 0 rgba(0,0,0,0.4);

    // :hover {
    //     box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);

    //     & > div:first-of-type { // frontside of the card
    //         height: 0px;
    //         transform: perspective(1000px) rotateX(-180deg);
    //     }

    //     & > div:last-of-type { // backside of the card
    //         transform: perspective(1000px) rotateX(0deg);
    //     }
    // }
`

const RideCardFront = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: white;
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

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`

const StyledLink = styled(Link)`
    display: inline-block;
    text-align: center;
    font-size:3vh;
    color: white;
    background-color: black;
    color: #E8CA5A;
    text-decoration: none;
    border-style: solid;
    border-color: #E8CA5A;
    border-radius: 10px;
    margin-top: 4vh;
    padding-left: 2vh;
    padding-right: 2vh;
    width: 10 vw;
`

const RideJoinButton = styled.button`
    text-align: center;
    font-size: 2.4vh;
    color: white;
    background-color: black;
    color: #E8CA5A;
    text-decoration: none;
    border-style: solid;
    border-color: #E8CA5A;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
`

const RideLeaveButton = styled.button`
    text-align: center;
    font-size: 2.4vh;
    color: white;
    background-color: #142538;
    color: #FFFFFF4D;
    text-decoration: none;
    border-style: solid;
    border-color: #FFFFFF4D;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
`

const RideDeleteButton = styled.button`
    text-align: center;
    font-size: 2.4vh;
    color: white;
    background-color: #142538;
    color: #FFFFFF4D;
    text-decoration: none;
    border-style: solid;
    border-color: #FFFFFF4D;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
`

const SelectDiv = styled(Select)`
    color: black;
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
    query GetRides($deptLoc:MongoID, $arrLoc:MongoID) {
        rideMany( 
        filter:{
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
// const GET_USER_INFO = gql`
//     query GetUserInfo {
//         recentUpdate @client
//         userID @client
//     }
// `

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

const GET_LOCATIONS = gql`
    query GetLocations {
        locationMany {
            _id
            title
        }
    }
`

const ADD_RIDER = gql`
    mutation AddRider($_id: ID!) {
        addRider(rideID: $_id) {
            _id
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
* Helper Functions
*/

/**
* Check whether a user is already part of the ride.
* @param {*} userID 
* @param {*} ride 
*/
const checkJoined = (userID, ride) => {
    console.log(userID);
    console.log(ride);
    console.log(ride.owner._id);
    console.log(ride.riders.map(rider => rider._id));
    if (userID == ride.owner.netid) return true; // saves us some computational power from executing the next line
    if (ride.riders.map(rider => rider.netid).includes(userID)) return true;
    return false;
}

/**
* Checks whether the ride is full
* @param {*} ride 
*/
const checkFull = (ride) => {
    if (ride.riders.length+1 == ride.spots) {
        return true;
    }
    return false;
}

const RideCard = ({ ride }) => {
    const { addToast } = useToasts();
    // Get properties from ride object
    let { owner, riders, departureDate, departureLocation, arrivalLocation, spots } = ride;
    // Get UserID from our local state management in apollo
    const userData = useQuery(GET_USER_INFO);
    const userNetID = userData.data.user.netid;
    
    // Transform departure date object into a moment object so we can use it easily
    let departureMoment = moment(departureDate);

    // Check if the current user is already part of this ride
    let joined = checkJoined(userNetID, ride);
    let isOwner = ride.owner.netid == userNetID;

    const [addRider, { data, loading, error }] = useMutation(
        ADD_RIDER
    );  

    const [removeRider, { data2, loading2, error2 }] = useMutation(
        REMOVE_RIDER
    );  

    const [deleteRide, { data3, loading3, error3 }] = useMutation(DELETE_RIDE);  

    const handleDelete = () => {
        deleteRide({
            variables: {_id: ride._id}
        })
        .catch((error) => {
            console.log("Oh no.");
        });
        window.location.reload(true);
    };

    const handleDeleteButton = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popupdiv>
                    <h1>Are you sure?</h1>
                    <P>Do you want to delete this Ride?</P>
                    <Buttondiv>
                    <ConfirmButton onClick={onClose}>No, Keep it!</ConfirmButton>
                    <ConfirmButton
                        onClick={() => {
                            handleDelete();
                            onClose();
                        }}
                        >
                            Yes, Delete this ride!
                    </ConfirmButton>
                    </Buttondiv>
                </Popupdiv>
              );
            }
          });
    };

    const handleLeave = () => {
        removeRider({
            variables: {_id: ride._id}
        })
        .catch((error) => {
            console.log("Oh no.");
        });
        window.location.reload(true);
    };

    const handleLeaveButton = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Popupdiv>
                    <h1>Are you sure?</h1>
                    <P>Do you want to leave this Ride?</P>
                    <Buttondiv>
                    <ConfirmButton onClick={onClose}>No, Keep it!</ConfirmButton>
                    <ConfirmButton
                        onClick={() => {
                            handleLeave();
                            onClose();
                        }}
                        >
                            Yes, Leave this ride!
                    </ConfirmButton>
                    </Buttondiv>
                </Popupdiv>
              );
            }
          });
    };

    const handleJoin = () => {
        addRider({
            variables: {_id: ride._id}
        }).catch((error) => {
            console.log("Oh no.");
        });
        window.location.reload(true);
    };

    const handleToast = () => {
        if (joined) {
            addToast("Go to your Profile to view ride details.", { appearance: 'info'});
        } else {
            addToast("Join a ride to view rider information.", { appearance: 'info'});
        }
    };

    // If the ride is full, disable ability to join
    let rideFull = checkFull(ride);
    return (
        <RideCardItem onClick={()=>handleToast()}>
            <RideCardFront>
                <RideCardDate>
                    <Day>{departureMoment.format("DD").toString()}</Day>
                    <Month>{departureMoment.format("MMM").toString()}</Month>
                    <Year>{departureMoment.format("YYYY").toString()}</Year>
                </RideCardDate>
                <RideCardText>
                    <p>{departureLocation.title} -> {arrivalLocation.title}</p>
                    <p>{departureMoment.format("hh:mm a")}</p>
                    <p>{spots - riders.length - 1} spot(s) left</p>
                </RideCardText>            
                    { rideFull ? "This ride is full." : 
                        <div>
                        { isOwner ? 
                            <RideDeleteButton 
                                joined={joined} 
                                onClick={()=>handleDeleteButton()}
                            >
                                Delete this Ride
                            </RideDeleteButton> 
                            : <div>
                            { joined ? 
                                <RideLeaveButton 
                                    joined={joined} 
                                    onClick={()=>handleLeaveButton()}
                                >
                                    Leave this Ride
                                </RideLeaveButton>
                                : <RideJoinButton 
                                    joined={joined} 
                                    disabled={rideFull}
                                    onClick={()=> handleJoin()}
                                >
                                    Join this Ride
                                </RideJoinButton>
                            }
                            </div>
                        }
                        </div>
                    }
            </RideCardFront>
        </RideCardItem>
        
    )
}

const FilterDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 25vw;
`

const LocationFilterDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    max-width: 100%;
    font-size: 1.2vw;
`

const DateDiv = styled.div`
    margin-left: 4vw;
`

const customStyles = {
    helper: {
        color: '#FFFFFF',
    },
    datefield: {
        background:'#FFFFFF',
    },
    control: (base) => ({
        ...base,
        width: '13vw',
        height:'4.5vh',
        background:'#FFFFFF',
        borderRadius: '2vh',
        border: 'none',
        boxShadow: 'none',
        cursor:'pointer'
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display:'none',
      }),
    option: (base) => ({
        ...base,
        color:'#142538',
        cursor:'pointer',
        fontSize:'2.5vh',
        letterSpacing:'0.03vw'
    }),
    singleValue: (provided) => ({
        ...provided,
        paddingBottom:'0.4vh',
        paddingLeft:'1vh',
        display: 'flex',
        color:'#FFFFFF',
        fontSize:'2.5vh',
        letterSpacing:'0.03vw'
      }),
    placeholder:(provided) => ({
        ...provided,
        display:'none',
    }),
    
}

const DateFilter = ({ label, getDate, setDate }) => {
    return (
        <LocalizationProvider dateAdapter={MomentUtils}>
            {label}
            <DatePicker
                name="deptDate"
                styles={customStyles}
                // OpenPickerButtonProps={{ style: customStyles.helper }}
                InputProps={{style: customStyles.datefield}}
                renderInput={props => 
                    <div>
                    <TextField 
                        styles={customStyles.datefield}
                        variant="outlined" {...props} 
                        TextFieldProps={{style: customStyles.datefield}}
                        FormHelperTextProps={{ style: customStyles.helper }} 
                        variant="outlined"
                        color="#FFFFFF"
                    />
                    </div>}
                disablePast
                clearable
                autoOk
                value={getDate}
                onChange={setDate}
            />
        </LocalizationProvider>
    )
}

const LocationFilter = ({ label, options, getSelection, setSelection }) => {
    const handleChange = (selected, triggeredAction) => {
        if (triggeredAction.action == "clear") {
            setSelection({});
        }
        setSelection(selected);
    }
    return (
        <LocationFilterDiv>
            <p>{label}</p>
            <SelectDiv
            name={label}
            options={options}
            value={getSelection}
            isClearable={true}
            onChange={handleChange}
            styles={{ container: (styles) => ({ ...styles, width: "200px" }) }}
            />
        </LocationFilterDiv>
    )
}

const defaultLocations = [
    "5eca36b008d82d5e82aaba10",
    "5f0faaae8043fe8db20d7b2f",
    "5f0fab90e021e829d49be5f7",
    "5f104e94bd33f13b6c1b66d8",
    "5f104ed2bd33f13b6c1b66d9",
    "5f104f49bd33f13b6c1b66da"
]

const transformToRSOptions = (locations) => {
    return locations
        .filter(location1 => defaultLocations.includes(location1._id))
            .map(location => {
                return { label: location.title, value: location._id };
            }
        );
}

const FilterOptions = ({ getVariables, setVariables }) => {
    // Manages filters
    const [getDepartureSelection, setDepartureSelection] = useState(getSelectionDummy());
    const [getArrivalSelection, setArrivalSelection] = useState(getSelectionDummy());
    const [getDate, setDate] = useState(null);

    const { data, loading, error } = useQuery(GET_LOCATIONS);
    if (error || loading) return <p>Waiting...</p>;
    let { locationMany: locations } = data;

    const handleSearch = () => {
        let selectionDummy = getSelectionDummy();
        let newVariables = {};
        // Check that at least one filter is active
        if (getDepartureSelection.value != selectionDummy.value) {
            newVariables.deptLoc = getDepartureSelection.value;
            setDepartureSelection(getSelectionDummy());
        }
        if (getArrivalSelection.value != selectionDummy.value) {
            newVariables.arrLoc = getArrivalSelection.value;
            setArrivalSelection(getSelectionDummy());
        }
        if (getDate != null) {
            newVariables.deptDate = getDate;
            // setDate(null);
        }
        setVariables({...newVariables});
    }

    return (
        <FilterDiv>
            <LocationFilter 
            label="Departing From:" 
            options={transformToRSOptions(locations)} 
            getSelection={getDepartureSelection}
            setSelection={setDepartureSelection}
            />
            <LocationFilter 
            label="Arriving To:" 
            options={transformToRSOptions(locations)} 
            getSelection={getArrivalSelection}
            setSelection={setArrivalSelection}
            />
            <DateDiv>
                <DateFilter 
                label="Departure Date" 
                getDate={getDate}
                setDate={setDate}
                />
            </DateDiv>
            <Buttons>
                <StyledLink type="submit" onClick={() => handleSearch()} >Search</StyledLink>
                <StyledLink onClick={() => window.location.reload(true)} >Show All Rides</StyledLink>
            </Buttons>
        </FilterDiv>
    )
}

const RidesList = ({ }) => {
    const [getVariables, setVariables] = useState({});
    console.log(getVariables);
    const { data, loading, error } = useQuery(
        GET_RIDES,
        { variables: getVariables }
    );

    if (error) return <p>Error.</p>;
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data...</p>;

    const { rideMany: rides } = data;

    const upcomingRides = rides.filter(ride => moment(ride.departureDate) >= new Date())
    upcomingRides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))

    const updateSearch = (upcomingRides) => {
        console.log("GETDATE");
        console.log(getVariables.deptDate);
        if (getVariables.deptDate) {
            return upcomingRides.filter(ride => moment(ride.departureDate).isSame(getVariables.deptDate, 'day'));
        }
        return upcomingRides;
    }

    return (
        <RideCardList>
            <FilterOptions getVariables={getVariables} setVariables={setVariables} />
            <br/>
            {updateSearch(upcomingRides).map(ride => <RideCard ride={ride} />)}
        </RideCardList>
    )
}

export default RidesList;