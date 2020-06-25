import React, { useState, createContext, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import { gql, useQuery, useMutation } from "@apollo/client";
import DateTimePicker from 'react-datetime-picker';
import { useToasts } from "react-toast-notifications";

const customStyles = {
    content : {
        background: '#142538',
    }
  };

const RideCreateDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: #142538;
`;

const RideCreateInputDiv = styled.div`
    width: 50em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`

const RideCreateLabel = styled.label`
    justify-self: flex-start;
`

const RideCreateInput = styled.input`
    justify-self: flex-end;
`

const RideCreateButton = styled.button`
    justify-self: center;
`

const RideCreateSelect = styled.div`
    width: 15em;
`

/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: MOVE TO FRAGMENT FOLDER; THIS IS ALSO IN ROUTES.JS
 */
const GET_USER_INFO = gql`
    query GetUserInfo {
        user @client {
            _id
            recentUpdate
        }
    }
`

const CREATE_RIDE = gql`
    mutation CreateRide(
        $owner: MongoID!, $deptLoc: MongoID!, $arrLoc: MongoID!, $deptDate: Date, 
        $spots: Float, $note: String, $ownerDriving: Boolean) {
        rideCreateOne(record: {
            owner: $owner,
            departureLocation: $deptLoc,
            arrivalLocation: $arrLoc,
            departureDate: $deptDate,
            spots: $spots,
            note: $note,
            ownerDriving: $ownerDriving
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
 * A mutation which will allow for the creation of new locations on the frontend
 */
const CREATE_LOCATION = gql`
    mutation CreateLocation( $title: String ) {
        locationCreateOne(record: { title: $title } ) {
            recordId
            record {
                title
            }
        }
    }
`

/**
 * React-Select requires all options to be formatted as { label: "", value: "" }
 * @param {*} locations: locations to be reformatted for use with react-select
 */
const transformToRSOptions = (locations) => {
    return locations.map(location => {
        return { label: location.title, value: location._id };
    });
}

const RideCreate = ({ closeModal, locations }) => {
    const { addToast } = useToasts();
    const [getInputs, setInputs] = useState({});

    // Transform locations into options for react-select
    locations = transformToRSOptions(locations);

    // We also need to get the user info
    const { data: userData } = useQuery(GET_USER_INFO);

    const { user } = userData;

    // Create a mutation to handle location creation
    // const [ createLocation, { data: createLocData, error: createLocError, loading: createLocLoading }] = useMutation(CREATE_LOCATION);

    // Set defaults for required inputs
    useEffect(() => {
        setInputs({
            owner: user._id,
            deptDate: new Date(),
            spots: 4,
            ownerDriving: false
        });
    }, []);

    const [createRide, { data, loading, error }] = useMutation(
        CREATE_RIDE,
    );

    useEffect(() => {
        if (error) {
            addToast("Sorry, an error occurred processing your new ride. Please try again later.", { appearance: 'error' });
        }
    }, [error]);

    const handleSubmit = () => {
        createRide({
            variables: getInputs
        })
        .then(fulfilled => {
            closeModal();
        })
        .catch((error) => {
            console.log("Oh no.");
        });
    };

    // Followed this for inspiration: https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
    const handleFormChange = (event) => {
        // If value is empty, remove from object
        if (event.target.value == "") {
            // Nice little syntactic sugar to remove property from object: https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90
            let { [event.target.name]: propertyToRemove, ...rest } = getInputs;            
            setInputs(rest);
        } else {
            if (event.target.name == "spots") {
                // Need to parse the float value
                setInputs({ ...getInputs, [event.target.name]: parseInt(event.target.value) });
            } else {
                setInputs({...getInputs, [event.target.name]: event.target.value});
            }
        }
    }

    /**
     * Use this in the future to enable users to create their own locations
     * @param {} inputValue 
     */
    const handleCreateLocation = (inputValue) => {
        // Clean it up
        // let title = inputValue;
        // Use mutation to create it on the backend
        // createLocation({ variables: { title: title } });
        // If the option already exists or is a close match to something else, show a toast notification

    }
    
    // These 3 properties MUST be present before a user can submit the new ride
    let readyToSubmit = ["deptLoc", "arrLoc", "deptDate"].every(requiredElem => getInputs.hasOwnProperty(requiredElem));

    return (
        <RideCreateDiv>
            <RideCreateInputDiv>
                <RideCreateLabel>Departure Location</RideCreateLabel>
                <RideCreateSelect>
                    <Select
                    name="deptLoc"
                    options={locations}
                    onChange={(selected) => setInputs({...getInputs, deptLoc: selected.value })}
                    placeholder="Select a Departure Location"
                    />
                </RideCreateSelect>
                <RideCreateLabel>Arrival Location</RideCreateLabel>
                <RideCreateSelect>
                    <Select
                    name="arrLoc"
                    options={locations.filter(location => location.value != getInputs.deptLoc)}
                    onChange={(selected) => setInputs({...getInputs, arrLoc: selected.value })}
                    placeholder="Select an Arrival Location"
                    isDisabled={getInputs.hasOwnProperty("deptLoc") ? false : true }
                    />
                </RideCreateSelect>
            </RideCreateInputDiv>
            <RideCreateInputDiv>
                <RideCreateLabel>Departure Date & Time</RideCreateLabel>
                {/* Please find a better date & time picker */}
                <DateTimePicker
                onChange={value => setInputs({ ...getInputs, deptDate: value })}
                value={getInputs.deptDate}
                />
            </RideCreateInputDiv>
            <RideCreateInputDiv>
                <RideCreateLabel>Spots</RideCreateLabel>
                <RideCreateInput onChange={handleFormChange} type="number" name="spots" />
            </RideCreateInputDiv>
            <RideCreateInputDiv>
                <RideCreateLabel>Comments</RideCreateLabel>
                <RideCreateInput onChange={handleFormChange} type="paragraph" name="note" />
            </RideCreateInputDiv>
            <RideCreateInputDiv>
                <RideCreateLabel>Will you be driving?</RideCreateLabel>
                <RideCreateInput onChange={event => setInputs({...getInputs, ownerDriving: event.target.checked })} type="checkbox" name="ownerDriving" />
            </RideCreateInputDiv>
            <RideCreateButton 
            onClick={handleSubmit} 
            disabled={!readyToSubmit}
            >Create Ride!</RideCreateButton>
        </RideCreateDiv>
    )
}

export default RideCreate;