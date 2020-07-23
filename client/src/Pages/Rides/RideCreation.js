// import React, { useState, createContext, useEffect} from "react";
// import styled from "styled-components";
// import Select, { components } from 'react-select';
// import { gql, useQuery, useMutation } from "@apollo/client";
// import DateTimePicker from 'react-datetime-picker';
// import { useToasts } from "react-toast-notifications";
// import Illustration from '../../assets/illus_new_ride_page.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// const MainDiv = styled.div`
//     font-family: acari-sans.light;
// `

// const IllustrationDiv = styled.div`
//     position: relative;
//     top: 68vh;
//     left: 15vw;
// `

// const RideCreateDiv = styled.div`
//     width: 70vw;
//     height:30vh;
//     display: flex;
//     align-items: space-between;
//     justify-content: space-between;
//     font-size:20pt;
//     letter-spacing: 0.1vw;
//     position: fixed;
//     top: 15vw;
//     left: 15vw;
//     z-index:1;
// `


// const RideCreateInputDiv = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;
//     align-items: flex-start;
//     color : white;
// `

// const RideCreateInputDivLast = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;
//     align-items: flex-end;
//     color : white;
// `

// const RideCreateLabel = styled.label`
// `

// const RideCreateInput = styled.input`
//     font-size:15pt;
//     font-family: inherit;
//     letter-spacing: 0.1vw;
//     background-color:#FFFFFF2B;
//     border-radius: 2vh;
//     color:white;
//     border: none;
//     width: 15vw;
//     height:4.5vh;
//     outline: none;
//     padding-left: 2vh;
//     padding-right: 2vh;
//     text-align:left;
//     ::-webkit-input-placeholder { 
//         font-size:15pt; 
//         letter-spacing:1pt;
//         font-family: acari-sans.normal;
//     }
// `

// const RideCreateButton = styled.button`
// `

// const RideCreateSelect = styled.div`
//     display:flex;
//     justify-content:row;
// `

// /**
//  * This simply fetches from our cache whether a recent update has occurred
//  * TODO: MOVE TO FRAGMENT FOLDER; THIS IS ALSO IN ROUTES.JS
//  */
// const GET_USER_INFO = gql`
//     query GetUserInfo {
//         user @client {
//             _id
//             recentUpdate
//         }
//     }
// `

// const CREATE_RIDE = gql`
//     mutation CreateRide(
//         $owner: MongoID!, $deptLoc: MongoID!, $arrLoc: MongoID!, $deptDate: Date, 
//         $spots: Float, $note: String, $ownerDriving: Boolean) {
//         rideCreateOne(record: {
//             owner: $owner,
//             departureLocation: $deptLoc,
//             arrivalLocation: $arrLoc,
//             departureDate: $deptDate,
//             spots: $spots,
//             note: $note,
//             ownerDriving: $ownerDriving
//         }) {
//             recordId
//             record {
//                 _id
//                 __typename
//             }
//         }
//     }
// `

// /**
//  * A mutation which will allow for the creation of new locations on the frontend
//  */
// const CREATE_LOCATION = gql`
//     mutation CreateLocation( $title: String ) {
//         locationCreateOne(record: { title: $title } ) {
//             recordId
//             record {
//                 title
//             }
//         }
//     }
// `

// /**
//  * React-Select requires all options to be formatted as { label: "", value: "" }
//  * @param {*} locations: locations to be reformatted for use with react-select
//  */
// const transformToRSOptions = (locations) => {
//     return locations.map(location => {
//         return { label: location.title, value: location._id };
//     });
// }

// const RideCreate = ({ closeModal, locations }) => {
//     const { addToast } = useToasts();
//     const [getInputs, setInputs] = useState({});

//     // Transform locations into options for react-select
//     locations = transformToRSOptions(locations);

//     // We also need to get the user info
//     const { data: userData } = useQuery(GET_USER_INFO);
    
//     const { user } = userData;

//     // Create a mutation to handle location creation
//     // const [ createLocation, { data: createLocData, error: createLocError, loading: createLocLoading }] = useMutation(CREATE_LOCATION);

//     // Set defaults for required inputs
//     useEffect(() => {
//         setInputs({
//             owner: user._id,
//             deptDate: new Date(),
//             spots: 4,
//             ownerDriving: false,
//             note: "None"
//         });
//     }, []);

//     const [createRide, { data, loading, error }] = useMutation(
//         CREATE_RIDE,
//     );

//     useEffect(() => {
//         if (error) {
//             addToast("Sorry, an error occurred processing your new ride. Please try again later.", { appearance: 'error' });
//         }
//     }, [error]);

//     const handleSubmit = () => {
//         console.log("get inputs!!!!", getInputs)
//         createRide({
//             variables: getInputs
//         })
//         .then(() => {
//             closeModal();
//         })
//         .catch((error) => {
//             console.log("Oh no.");
//         });
//     };

//     // Followed this for inspiration: https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
//     const handleFormChange = (event) => {
//         // If value is empty, remove from object
//         if (event.target.value == "") {
//             // Nice little syntactic sugar to remove property from object: https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90
//             let { [event.target.name]: propertyToRemove, ...rest } = getInputs;            
//             setInputs(rest);
//         } else {
//             if (event.target.name == "spots") {
//                 // Need to parse the float value
//                 setInputs({ ...getInputs, [event.target.name]: parseInt(event.target.value) });
//             } else {
//                 setInputs({...getInputs, [event.target.name]: event.target.value});
//             }
//         }
//     }

//     /**
//      * Use this in the future to enable users to create their own locations
//      * @param {} inputValue 
//      */
//     const handleCreateLocation = (inputValue) => {
//         // Clean it up
//         // let title = inputValue;
//         // Use mutation to create it on the backend
//         // createLocation({ variables: { title: title } });
//         // If the option already exists or is a close match to something else, show a toast notification

//     }
    
//     // These 3 properties MUST be present before a user can submit the new ride
//     let readyToSubmit = ["deptLoc", "arrLoc", "deptDate"].every(requiredElem => getInputs.hasOwnProperty(requiredElem));

//     const Rideroptions = [
//         { value: '1', label: '1' },
//         { value: '2', label: '2' },
//         { value: '3', label: '3' },
//         { value: '4', label: '4' } 
//       ];

//       const Luggageoptions = [
//         { value: '1', label: '1' },
//         { value: '2', label: '2' },
//         { value: '3', label: '3' },
//         { value: '4', label: '4' },
//         { value: '5', label: '5' }
//       ];

//     const customStyles = {
//         control: (base) => ({
//             ...base,
//             width: '13vw',
//             height:'4.5vh',
//             background:'#FFFFFF2B',
//             borderRadius: '2vh',
//             border: 'none',
//             boxShadow: 'none',
//         }),
//         indicatorSeparator: (provided) => ({
//             ...provided,
//             display:'none',
//           }),
//         option: (base) => ({
//             ...base,
//             color:'#142538',
//         }),
//         singleValue: (provided) => ({
//             ...provided,
//             paddingBottom:'0.8vh',
//             paddingLeft:'1vh',
//             paddingRight:'1vh',
//             display: 'flex',
//             color:'#FFFFFF',
//           }),
       
//       }
    
      

//     return (
//         <MainDiv>
//             <RideCreateDiv>
//                 <RideCreateInputDiv>    
//                     <RideCreateLabel>*Departing from:</RideCreateLabel>
//                     <RideCreateLabel>*Arriving at:</RideCreateLabel>
//                     <RideCreateLabel>*Number of Luggages:</RideCreateLabel>
//                 </RideCreateInputDiv>
                        
//                 {/* 
//             spots: $spots,
//             note: $note,
//             ownerDriving: $ownerDriving */}
//                 <RideCreateInputDiv>
//                         <Select
//                         name="deptLoc"
//                         options={locations}
//                         onChange={(selected) => setInputs({...getInputs, deptLoc: selected.value })}
//                         placeholder=""
//                         styles={customStyles}
//                         />
                        
//                         <Select
//                         name="arrLoc"
//                         options={locations.filter(location => location.value != getInputs.deptLoc)}
//                         onChange={(selected) => setInputs({...getInputs, arrLoc: selected.value })}
//                         placeholder=""
//                         isDisabled={getInputs.hasOwnProperty("deptLoc") ? false : true }
//                         styles={customStyles}
//                         />
                
//                         <Select
//                         name="luggage"
//                         options={Luggageoptions}
//                         onChange={(selected) => setInputs({...getInputs, luggage: selected.value })}
//                         placeholder=""
//                         styles={customStyles}
//                         />
//                 </RideCreateInputDiv>

//                 <RideCreateInputDiv>
//                     <RideCreateLabel>*Max number of Riders:</RideCreateLabel>
//                     <RideCreateLabel>*Departure Date & Time:</RideCreateLabel>
//                     <RideCreateLabel>Invite Others:</RideCreateLabel>
//                     {/* <RideCreateLabel>Extra Notes:</RideCreateLabel> */}
//                 </RideCreateInputDiv>

//                 <RideCreateInputDivLast>
                    
//                     {/* <Select
//                     options={Rideroptions}
//                     onChange={(selected) => setInputs({...getInputs, arrLoc: selected.value })}
//                     placeholder=""
//                     styles={customStyles}
//                     /> */}
                    
//                     <Select
//                     name="rider"
//                     options={Rideroptions}
//                     onChange={(selected) => setInputs({...getInputs, rider: selected.value })}
//                     placeholder=""
//                     styles={customStyles}
//                     />
//                     {/* Please find a better date & time picker */}
//                     <DateTimePicker
//                     onChange={value => setInputs({ ...getInputs, deptDate: value })}
//                     value={getInputs.deptDate}
//                     />
//                     {/* <RideCreateInput onChange={handleFormChange} type="text" name="spots" placeholder='Email Address'/> */}
//                     <RideCreateInput onChange={handleFormChange} type="paragraph" name="note" /> 
//                     <RideCreateButton 
//                         onClick={handleSubmit} 
//                         disabled={!readyToSubmit}
//                         >Submit</RideCreateButton>
        
//                     {/* <RideCreateInput onChange={event => setInputs({...getInputs, ownerDriving: event.target.checked })} type="checkbox" name="ownerDriving" /> */}
//                 </RideCreateInputDivLast>
//             </RideCreateDiv>
//             <IllustrationDiv>
//                 <img src={Illustration} />
//             </IllustrationDiv>
//         </MainDiv>
//         )
        
// }

// export default RideCreate;