import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import Modal from "react-modal";
import RidesList from "./RidesList";
import { Link } from "react-router-dom";

const GET_LOCATIONS = gql`
    query GetLocations {
        locationMany {
            _id
            title
        }
    }
`


const Rides = ({ }) => {
    
    // Load it up here so we can use it in multiple places later
    const { data: locationData, 
        loading: locationLoading, 
        error: locationError } = useQuery(GET_LOCATIONS);

    if (locationError) return <p>Error.</p>;
    if (locationLoading) return <p>Loading...</p>;
    if (!locationData) return <p>No data...</p>;

    // Gets the locationMany property from the query
    const { locationMany: locations } = locationData;
    

    return (
        <div>
            <RidesList />
        </div>
    )
}

export default Rides;