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

import Autocomplete from 'react-google-autocomplete';
import { Redirect } from "react-router";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';


const HiddenInput = styled.input`
    display:none;
    visibility:hidden;
`


const MainForm = styled.form`
    font-family: acari-sans.light;
    display:grid;
    grid-template-rows:repeat(20,5%);
    grid-template-columns:repeat(20,5%);
    width: 100vw;
    height: 100vh;
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
    font-size:2.5vh;
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
    font-size:2.5vh;
    font-family: inherit;
    letter-spacing: 0.03vw;
    background-color:#FFFFFF2B;
    border-radius: 2vh;
    color:white;
    border: none;
    width: 15vw;
    height: 4.5vh;
    outline: none;
    padding-left: 2vh;
    padding-right: 2vh;
    padding-bottom:0.5vh;
    padding-top: 0;
    text-align:left;
    ::placeholder { 
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

const StyledCheckbox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

const GET_LOCATION = gql`
    query GetLocation {
        locationOne (filter: {title: $title}) {
            _id
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

const CHECK_LOCATION = gql`
    query CheckLocation($address: String) {
        locationOne (filter: {address: $address}) {
            title
            address
        }
    }
`

/**
 * A mutation which will allow for the creation of new locations on the frontend
 */
const CREATE_LOCATION = gql`
    mutation CreateLocation( $title: String, $address: String ) {
        locationCreateOne(record: { title: $title, address: $address } ) {
            recordId
            record {
                title
                address
            }
        }
    }
`

const defaultLocations = [
    "5eca36b008d82d5e82aaba10",
    "5f0faaae8043fe8db20d7b2f",
    "5f0fab90e021e829d49be5f7",
    "5f104e94bd33f13b6c1b66d8",
    "5f104ed2bd33f13b6c1b66d9",
    "5f104f49bd33f13b6c1b66da"
]


/**
 * React-Select requires all options to be formatted as { label: "", value: "" }
 * @param {*} locations: locations to be reformatted for use with react-select
 */
const transformToRSOptions = (locations) => {
    return locations
        .filter(location1 => defaultLocations.includes(location1._id))
            .map(location => {
                return { label: location.title, value: location._id };
            }
        );
}

const RideCreate = ({locations}) => {
    const { addToast } = useToasts();
    const [getInputs, setInputs] = useState({});
    const [newDeptLocation, setNewDeptLocation] = useState(null);
    const [newArrLocation, setNewArrLocation] = useState(null);

    // These 3 properties MUST be present before a user can submit the new ride
    let readyToSubmit = ["deptLoc", "arrLoc", "deptDate"].every(requiredElem => getInputs.hasOwnProperty(requiredElem))


    // Transform locations into options for react-select
    locations = transformToRSOptions(locations);
    console.log('locations', locations);

    // We also need to get the user info
    const { data: userData } = useQuery(GET_USER_INFO);
    const [fetchLocation, { called, loading: locationLoading, data: locationData }] = useLazyQuery(GET_LOCATION);
    
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
            luggage: null
        });
    }, []);


    const [createRide, { data, loading, error }] = useMutation(
        CREATE_RIDE,
    );
    
    const [ createLocation, { data2, loading2, error2 } ] = useMutation(
        CREATE_LOCATION
    );

    useEffect(() => {
        if (error) {
            addToast("Sorry, an error occurred processing your new ride. Please try again later.", { appearance: 'error' });
        } 
    }, [error]);

    const { data: checkData } = useQuery(CHECK_LOCATION, {
        variables: {address: newDeptLocation},
        skip: newDeptLocation === null
    });

    function addCreateCustomRide() {
        createRide({
            variables: getInputs
        })
        .catch((error) => {
            console.log("Oh no.");
        });
        addToast("Congratulations! Your custom ride has been successfully created.", { appearance: 'success'});
    }

    const handleSubmit = () => {
        console.log("getInputs!!!", getInputs);
        console.log(newDeptLocation);
        if (newDeptLocation) {
            console.log("preparing to create new departure location");
            // fetchCheck(
            //     { variables: {address: newDeptLocation.formatted_address}}
            // ).then(({ data }) => {
            //     console.log("checkData", data);
            // });
            console.log("checkData", checkData);
            createLocation({
                variables: {title: newDeptLocation.name, address: newDeptLocation.formatted_address}
            }).then(({ data }) => {
                const recordId = data["locationCreateOne"]["recordId"];
                setInputs({...getInputs, deptLoc: recordId });
                getInputs["deptLoc"] = recordId;
                if (newArrLocation) {
                    createLocation({
                        variables: {title: newArrLocation.name, address: newArrLocation.formatted_address}
                    }).then(({ data }) => {
                        const recordId = data["locationCreateOne"]["recordId"];
                        setInputs({...getInputs, arrLoc: recordId });
                        getInputs["arrLoc"] = recordId;
                        addCreateCustomRide();
                    });
                } else {
                    addCreateCustomRide();
                }
            })
        } else if (newArrLocation) {
            createLocation({
                variables: {title: newArrLocation.name, address: newArrLocation.formatted_address}
            }).then(({ data }) => {
                const recordId = data["locationCreateOne"]["recordId"];
                setInputs({...getInputs, arrLoc: recordId });
                getInputs["arrLoc"] = recordId;
                addCreateCustomRide();
            });
        } else {
            createRide({
                variables: getInputs
            })
            .catch((error) => {
                console.log("Oh no.");
            });
        }
        // if (newArrLocation) {
        //     createLocation({
        //         variables: {title: newArrLocation.name, address: newArrLocation.formatted_address}
        //     })
        // }
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

  
//   const Luggageoptions = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' },
//     { value: '4', label: '4' },
//     { value: '5', label: '5' }
//   ];

const customStyles = {
    control: (base) => ({
        ...base,
        width: '13vw',
        height:'4.5vh',
        background:'#FFFFFF2B',
        borderRadius: '2vh',
        border: 'none',
        boxShadow: 'none',
        cursor:'pointer',
        fontSize:'2.5vh',
        letterSpacing:'0.03vw'
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
        fontSize:'2.5vh',
        letterSpacing:'0.03vw'
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

    const [checked, setChecked] = React.useState(true);

    const autocompleteStyle = {
        fontSize: "2.8vh",
        fontFamily: "inherit",
        letterSpacing: "0.03vw",
        backgroundColor: "#FFFFFF2B",
        borderRadius: "2vh",
        color: "white",
        border: "none",
        width: "11.1vw",
        height: "4.5vh",
        outline: "none",
        paddingLeft: "2vh",
        paddingRight: "2vh",
        paddingBottom: "0.5vh",
        display: "none",
        textAlign: "left"
    };

    const toggleVisible = function(item){
        if (item.style.display === 'none'){
            return item.style.display = 'block';
        } else {
            return item.style.display = 'none';
        }
    };

    const handleDeptChange = (event) => {
        setChecked(event.target.checked);
        let select = document.getElementById("deptSelect");
        let custom = document.getElementById("customDept");
        toggleVisible(select);
        toggleVisible(custom);
    };

    const handleArrChange = (event) => {
        setChecked(event.target.checked);
        let select = document.getElementById("arrSelect");
        let custom = document.getElementById("customArr");
        toggleVisible(select);
        toggleVisible(custom);
    };

    // if (error) return <p>Error...</p>;
    // if (loading) return <p>Wait...</p>;
    // if (error2) return <p>Error...</p>;
    // if (loading2) return <p>Wait...</p>;

    
    return (
        <MainForm>
            <Slogan>
                Initiate A Ride
            </Slogan>
            <RideCreateDiv>
                <RideCreateInputDivText>    
                    <RideCreateLabel>*Departing from:</RideCreateLabel>
                    <RideCreateLabel>*Arriving at:</RideCreateLabel>
                    {/* <RideCreateLabel>Add Custom Location:</RideCreateLabel> */}
                    {/* <RideCreateLabel>*Number of Luggages:</RideCreateLabel> */}
                </RideCreateInputDivText>
                        
                <RideCreateInputDiv>
                        <StyledCheckbox>
                            <Tooltip title="Enable custom departure location">
                                <Checkbox
                                    // checked={checked}
                                    onChange={handleDeptChange}
                                    color="primary"
                                    style ={{
                                        color: "#FFFFFF",
                                    }}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Tooltip>
                            <Select
                                name="deptLoc"
                                options={locations}
                                onChange={(selected) => setInputs({...getInputs, deptLoc: selected.value })}
                                styles={customStyles}
                                isSearchable={false}
                                value={locations.find(obj => obj.value === getInputs.deptLoc) ? locations.find(obj => obj.value === getInputs.deptLoc):null}
                                id="deptSelect"
                                iconStyle={{fill: 'white'}}
                            />
                            <Autocomplete
                                apiKey={'AIzaSyBOCL15Ohl-LcqazTFxXgoGAlB86N2miJE'}
                                style={autocompleteStyle}
                                fields={["name", "formatted_address"]}
                                onPlaceSelected={(place) => {
                                    console.log(place.name);
                                    console.log(place.formatted_address);
                                    setNewDeptLocation(place);
                                    console.log("newDeptLocation", newDeptLocation); 
                                    // setInputs({...getInputs, deptLoc: selected.value });
                                    // return <CustomRide place={place}/>;
                                }}
                                types={['establishment']}
                                id="customDept"
                            />
                        </StyledCheckbox>
                        
                        <StyledCheckbox>
                            <Tooltip title="Enable custom arrival location">
                                <Checkbox
                                    // checked={checked}
                                    onChange={handleArrChange}
                                    color="primary"
                                    style ={{
                                        color: "#FFFFFF",
                                    }}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Tooltip>
                            <Select
                                name="arrLoc"
                                id="arrSelect"
                                options={locations.filter(location => location.value != getInputs.deptLoc)}
                                onChange={(selected) => setInputs({...getInputs, arrLoc: selected.value })}    
                                //isDisabled={getInputs.hasOwnProperty("deptLoc") ? false : true }                               
                                styles={customStyles}
                                isSearchable={false}
                                value={locations.find(obj => obj.value === getInputs.arrLoc) ? locations.find(obj => obj.value === getInputs.arrLoc) : null}
                            />
                            <Autocomplete
                                apiKey={'AIzaSyBOCL15Ohl-LcqazTFxXgoGAlB86N2miJE'}
                                style={autocompleteStyle}
                                fields={["name", "formatted_address"]}
                                onPlaceSelected={(place) => {
                                    console.log(place.name);
                                    console.log(place.formatted_address);
                                    setNewArrLocation(place);
                                    console.log("newArrLocation", newArrLocation); 
                                    // return <CustomRide place={place}/>;
                                }}
                                types={['establishment']}
                                id="customArr"
                            />
                        </StyledCheckbox>
                
                        {/* <Select
                        name="luggage"
                        options={Luggageoptions}  
                        onChange={(selected) => setInputs({...getInputs, luggage: selected.value })}                 
                        styles={customStyles}
                        isSearchable={false}
                        value={Luggageoptions.find(obj => obj.value === getInputs.luggage) ? Luggageoptions.find(obj => obj.value === getInputs.luggage) : null}
                        /> */}
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
        </MainForm>
        )
        
}

export default RideCreate;