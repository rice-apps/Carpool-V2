import React, { useState, createContext, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import MomentUtils from '@material-ui/pickers/adapter/moment';
import { MuiPickersUtilsProvider, DateTimePicker, LocalizationProvider, DatePicker,  } from "@material-ui/pickers";
import Select from "react-select";
import { transformToRSOptions, getSelectionDummy } from "../../utils/RideUtils";
import { Button, TextField } from "@material-ui/core";
import {Link} from "react-router-dom";

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
    box-shadow: 0 6px 12px 0 rgba(0,0,0,0.2);

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

const StyledLink = styled(Link)`
    // display: flex;
    text-align: center;
    font-size:3.5vh;
    color: white;
    background-color: black;
    color: #E8CA5A;
    text-decoration: none;
    border-style: solid;
    border-color: #E8CA5A;
    border-radius: 10px;
    display: inline-block;
    margin-top: 4vh;
    padding-left: 2vh;
    padding-right: 2vh;
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

const SelectDiv = styled(Select)`
    color: black;
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

const ADD_RIDER = gql`

    mutation AddRider(
        $owner: MongoID!, $deptLoc: MongoID!, $arrLoc: MongoID!, $deptDate: Date, 
        $spots: Float, $note: String, $ownerDriving: Boolean, $riders: [MongoID!]) {
        addRider(record: {
            spots: $spots,
            riders: $riders
        }) {
            recordId
            record {
                _id
                __typename
            }
        }
    }


`

const UPDATE_RIDE = gql`

    mutation UpdateRide(
        $owner: MongoID!, $deptLoc: MongoID!, $arrLoc: MongoID!, $deptDate: Date, 
        $spots: Float, $note: String, $ownerDriving: Boolean, $riders: [MongoID!]) {
        rideUpdateOne(record: {
            owner: $owner,
            departureLocation: $deptLoc,
            arrivalLocation: $arrLoc,
            departureDate: $deptDate,
            spots: $spots,
            note: $note,
            ownerDriving: $ownerDriving,
            riders: $riders
        }) {
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

    const [addRider, { data, loading, error }] = useMutation(
        ADD_RIDER
    );  

    const handleJoin = ( ride ) => {
        console.log("HANDLE JOIN");
        console.log(ride);
        addRider({
            variables: ride
        })
        .catch((error) => {
            console.log("Oh no.");
        });
    }

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
                { rideFull ? "Sorry, this ride is full." : 
                <RideJoinButton 
                joined={joined}
                disabled={rideFull}
                onClick={handleJoin( {ride} )}
                >
                    {joined ? "Leave this ride" : "Join this ride" }
                </RideJoinButton>
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
    justify-content: space-around;
    max-width: 100%;
`

const styles = {
    helper: {
         color: '#FFFFFF',
    }
    
}

const DateFilter = ({ label, getDate, setDate }) => {
    return (
        <LocalizationProvider dateAdapter={MomentUtils}>
            {label}
            <DatePicker
                name="deptDate"
                OpenPickerButtonProps={{ style: styles.helper }}
                renderInput={props => 
                    <TextField 
                        variant="outlined" {...props} 
                        FormHelperTextProps={{ style: styles.helper }} 
                        onFocus={{}}
                    />}
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
            styles={{ container: (styles) => ({ ...styles, width: "150px" }) }}
            />
        </LocationFilterDiv>
    )
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
            // Reset
            setDepartureSelection(getSelectionDummy());
        }
        if (getArrivalSelection.value != selectionDummy.value) {
            newVariables.arrLoc = getArrivalSelection.value;
            setArrivalSelection(getSelectionDummy());
        }
        if (getDate != null) {
            newVariables.deptDate = getDate;
            setDate(null);
        }
        setVariables({...newVariables});
    }

    return (
        <FilterDiv>
            <LocationFilter 
            label="Departing To" 
            options={transformToRSOptions(locations)} 
            getSelection={getDepartureSelection}
            setSelection={setDepartureSelection}
            />
            <LocationFilter 
            label="Arriving To" 
            options={transformToRSOptions(locations)} 
            getSelection={getArrivalSelection}
            setSelection={setArrivalSelection}
            />
            <DateFilter 
            label="Departure Date" 
            getDate={getDate}
            setDate={setDate}
            />
            <StyledLink type="submit" onClick={handleSearch} >Search</StyledLink>
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

    const upcomingrides = rides.filter(ride => moment(ride.departureDate) >= new Date())
    upcomingrides.sort((a, b) => moment(b.departureDate) - moment(a.departureDate))

    return (
        <RideCardList>
            <FilterOptions getVariables={getVariables} setVariables={setVariables} />
            <br/>
            {upcomingrides.map(ride => <RideCard ride={ride} />)}
        </RideCardList>
    )
}

export default RidesList;