import React, { useState, createContext, useEffect} from "react";
import styled from "styled-components";
import Select, { components } from 'react-select';
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
// import DateTimePicker from 'react-datetime-picker';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { DateTimePicker, LocalizationProvider } from '@material-ui/pickers';
import { TextField, FormHelperText } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import Illustration from '../../assets/illus_new_ride_page.svg';
import {Link} from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { yellow } from "@material-ui/core/colors";


const HiddenInput = styled.input`
    display:none;
    visibility:hidden;
`


const MainDiv = styled.form`
    font-family: acari-sans.light;
    display:grid;
    grid-template-rows:repeat(20,5%);
    grid-template-columns:repeat(20,5%);
    width:100vw;
    height:100vh;
`

const IllustrationDiv = styled.div`
    grid-area: 11 / 3 / 19/ 8;
    color: white;
`

const RideCreateDiv = styled.div`
    grid-area:4/3/10/18;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    font-size:2.8vh;
    letter-spacing: 0.1vw;
    z-index:1;
`
const ExtraNotes = styled.textarea`
    grid-area:11/13/20/18;
    font-size:2.8vh;
    font-family: inherit;
    letter-spacing: 0.03vw;
    background-color:#FFFFFF2B;
    border-radius: 2vh;
    color:white;
    border: none;
    width: 22.8vw;
    height:16vh;
    outline: none;
    padding-left:2vh;
    padding-right:2vh;
    text-align:left;
    resize: none;
`

const RideCreateInputDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    color : white;
`
const RideCreateInputDivText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    color : white;
    margin-top:-0.2vh;
    margin-bottom:0.3vh;
`

const RideCreateInputDivLast = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    color : white;
`

const RideCreateLabel = styled.label`
`
const ExtraNotesLabel = styled.label`
    grid-area:11/10/12/14;
    font-size:2.8vh;
    letter-spacing: 0.1vw;
    color:white;
    padding-left:1.7vw;
    padding-top:1.7vw;
`

const RideCreateInput = styled.input`
    font-size:2.8vh;
    font-family: inherit;
    letter-spacing: 0.03vw;
    background-color:#FFFFFF2B;
    border-radius: 2vh;
    color:white;
    border: none;
    width: 15vw;
    height:4.5vh;
    outline: none;
    padding-left: 2vh;
    padding-right: 2vh;
    padding-bottom:0.5vh;
    text-align:left;
    ::-webkit-input-placeholder { 
        font-size:2.1vh; 
        letter-spacing:0.14;
        font-family: acari-sans.normal;
    }
`

const Illus = styled.img`
    
`;

const Slogan = styled.div `
    font-size: 3.5vw;
    margin-left: 2vw;
    margin-right: 2vw;
    text-align: center;
    text-decoration: underline;
    text-decoration-color: #E8CA5A;
    color:white;
    grid-area: 1/7/3/13; 
`;

const StyledLinkDiv = styled.div`
    grid-area:15/13/18/18;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size:2.8vh;
    letter-spacing: 0.1vw;
    z-index:1;
`
        
    
const StyledLink = styled(Link)`
font-size:3.5vh;
display: box;
color: white;
text-decoration: underline;
text-decoration-color: white;
padding-right: .75vh;
`


const customStyles = {
    content : {
        background: '#142538',
    }
};

const GET_LOCATIONS = gql`
    query GetLocations {
        locationMany {
            _id
            title
        }
    }
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




const RideCreate = ({locations}) => {
    const { addToast } = useToasts();
    const [getInputs, setInputs] = useState({});

    // These 3 properties MUST be present before a user can submit the new ride
    let readyToSubmit = ["deptLoc", "arrLoc", "deptDate"].every(requiredElem => getInputs.hasOwnProperty(requiredElem))


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
            ownerDriving: false,
            note: "None",
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
        console.log("getInputs!!!", getInputs)
        createRide({
            variables: getInputs
        })
        .catch((error) => {
            console.log("Oh no.");
        });
    };

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


    const handleClear = () => {
        document.getElementById("res").click();
        let { luggage: propertyToRemove1, deptLoc: propertyToRemove2, arrLoc: propertyToRemove3,rider: propertyToRemove4, deptDate:propertyToRemove5,  ...rest } = getInputs; 
        setInputs(rest);
        // setInputs({...getInputs, luggage: null, deptLoc:null, arrLoc:null,rider:null,deptDate:new Date()})
    }


    const handleToast = () => {
        if (readyToSubmit){
            addToast("Congratulations! Your ride has been successfully created.", { appearance: 'success'});
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
    
 

    

    const Rideroptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' } 
  ];

  
  const Luggageoptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' }
  ];

const customStyles = {
    control: (base) => ({
        ...base,
        width: '13vw',
        height:'4.5vh',
        background:'#FFFFFF2B',
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
        cursor:'pointer'
    }),
    singleValue: (provided) => ({
        ...provided,
        paddingBottom:'0.4vh',
        paddingLeft:'1vh',
        display: 'flex',
        color:'#FFFFFF',
      }),
    placeholder:(provided) => ({
        ...provided,
        display:'none',
    }),
  }

  const defaultMaterialTheme = createMuiTheme({
    palette: {
        primary: yellow,
    },
    overrides: {
        MuiOutlinedInput: {
          input: {
            cursor:'pointer',
            color:'#FFFFFF',
            paddingLeft:'1vw',
        },
        root: {
            width: '13vw',
            height:'4.5vh',
            background:'#FFFFFF2B',
            borderRadius: '2vh',
            border: 'none',
            boxShadow: 'none',
          },
        }
    }
});

const styles = {
    helper: {
         color: '#FFFFFF',
    }
    
}



//   const [selectedDate, handleDateChange] = useState(new Date());

    return (
        <MainDiv>
            <Slogan>
                Initiate A Ride
            </Slogan>
            <RideCreateDiv>
                <RideCreateInputDivText>    
                    <RideCreateLabel>*Departing from:</RideCreateLabel>
                    <RideCreateLabel>*Arriving at:</RideCreateLabel>
                    <RideCreateLabel>*Number of Luggages:</RideCreateLabel>
                </RideCreateInputDivText>
                        
                <RideCreateInputDiv>
                        <Select
                        name="deptLoc"
                        options={locations}
                        onChange={(selected) => setInputs({...getInputs, deptLoc: selected.value })}
                        styles={customStyles}
                        isSearchable={false}
                        value={locations.find(obj => obj.value === getInputs.deptLoc) ? locations.find(obj => obj.value === getInputs.deptLoc):null}
                        />
                        
                        <Select
                        name="arrLoc"
                        options={locations.filter(location => location.value != getInputs.deptLoc)}
                        onChange={(selected) => setInputs({...getInputs, arrLoc: selected.value })}    
                        isDisabled={getInputs.hasOwnProperty("deptLoc") ? false : true }                               
                        styles={customStyles}
                        isSearchable={false}
                        value={locations.find(obj => obj.value === getInputs.arrLoc) ? locations.find(obj => obj.value === getInputs.arrLoc) : null}
                        />
                
                        <Select
                        name="luggage"
                        options={Luggageoptions}  
                        onChange={(selected) => setInputs({...getInputs, luggage: selected.value })}                 
                        styles={customStyles}
                        isSearchable={false}
                        value={Luggageoptions.find(obj => obj.value === getInputs.luggage) ? Luggageoptions.find(obj => obj.value === getInputs.luggage) : null}
                        />
                </RideCreateInputDiv>

                <RideCreateInputDivText>
                    <RideCreateLabel>*Max number of Riders:</RideCreateLabel>
                    <RideCreateLabel>*Departure Date & Time:</RideCreateLabel>
                    <RideCreateLabel>Invite Others:</RideCreateLabel>
                </RideCreateInputDivText>

                <RideCreateInputDivLast>   
                    <Select
                    name="rider"
                    options={Rideroptions} 
                    onChange={(selected) => setInputs({...getInputs, rider: selected.value })}                
                    styles={customStyles}
                    isSearchable={false}
                    value={Rideroptions.find(obj => obj.value === getInputs.rider) ? Rideroptions.find(obj => obj.value === getInputs.rider) : null}
                    />
                    
                    {/* Please find a better date & time picker */}
                    <LocalizationProvider dateAdapter={DateFnsAdapter}>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <DateTimePicker 
                            name="deptDate"
                            OpenPickerButtonProps={{ style: styles.helper }}
                            renderInput={props => 
                            <TextField {...props} variant="outlined" FormHelperTextProps={{ style: styles.helper }} onFocus={{}}
                            />
                            }
                            onChange={value => setInputs({ ...getInputs, deptDate: value })}
                            value={getInputs.deptDate}
                            />
                        </ThemeProvider>
                    </LocalizationProvider>

                    <RideCreateInput onChange={handleFormChange} type="email" name="invite" placeholder='Email Address'/>
                    {/* <RideCreateInput onChange={handleFormChange} type="paragraph" name="note" /> */}
        
                    {/* <RideCreateInput onChange={event => setInputs({...getInputs, ownerDriving: event.target.checked })} type="checkbox" name="ownerDriving" /> */}
                </RideCreateInputDivLast>
            </RideCreateDiv>
            <IllustrationDiv>
                <Illus src={Illustration}/>
            </IllustrationDiv>
            <ExtraNotesLabel>
                Extra Notes:
            </ExtraNotesLabel>
            <ExtraNotes type="text" rows="10" onChange={handleFormChange} name = 'notes'>
            </ExtraNotes>
            <StyledLinkDiv>
                <StyledLink onClick = {handleClear}>Clear Form </StyledLink>
                <StyledLink
                type="submit" 
                onClick={() => {handleSubmit(); handleClear();handleToast()}} 
                >Submit</StyledLink>
            </StyledLinkDiv>
            <HiddenInput id="res" name="res" type="reset"/>
        </MainDiv>
        )
        
}

export default RideCreate;