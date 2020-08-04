import React, { Component, useEffect } from "react"
import styled from "styled-components";
import { Switch, Route, Redirect } from 'react-router'
import { gql, useQuery, useApolloClient } from '@apollo/client';
import App from '../App';
import Login from '../Pages/Login';
import Auth from '../Pages/Auth';
import Home from '../Pages/Home';
import Rides from '../Pages/Rides';
import Profile from '../Pages/Profile';
import About from '../Pages/About';
import NewRide from '../Pages/NewRides';
import LandingPage from '../Pages/LandingPage';

/**
 * Requests to verify the user's token on the backend
 */
const VERIFY_USER = gql`
    query VerifyQuery($token: String!) {
        verifyUser(token:$token) {
            _id
            __typename
            firstName
            lastName
            netid
            phone
            token
            recentUpdate
        }
    }
`;

/**
 * This simply fetches from our cache whether a recent update has occurred
 */
const GET_USER_INFO = gql`
    query GetUserInfo {
        user @client {
            _id
            recentUpdate
            firstName
            lastName
            netid
            phone
        }
    }
`

/**
 * Defines a private route - if the user is NOT logged in or has an invalid token, 
 * then we redirect them to the login page.
 */
const PrivateRoute = ({ component, ...rest }) => {
    let token = localStorage.getItem('token') != null ? localStorage.getItem('token') : '';

    let client = useApolloClient();

    // Verify that the token is valid on the backend
    let { data, loading, error } = useQuery(
        VERIFY_USER,
        { variables: { token: token }, errorPolicy: 'none' }
    );

    if (error) {
        // Clear the token because something is wrong with it
        localStorage.removeItem('token');
        // Redirect the user to the login page
        return (<Redirect to="login" />);
    }
    if (loading) return <p>Waiting...</p>;
    if (!data || !data.verifyUser) {
        // Clear the token
        localStorage.removeItem('token');
        // Redirect the user
        return (<Redirect to="login" />);
    }

    // Check whether any recent updates have come in
    // let { _id, netid, recentUpdate } = data.verifyUser;

    // Upon verification, store the returned information
    client.writeQuery({
        query: GET_USER_INFO,
        data: { user: data.verifyUser }
    });

    // Everything looks good! Now let's send the user on their way
    return (
        <Route {...rest} component={component} />
    );
}

const routesArray = [
    {
        path: "/login",
        component: Login,
        privateRoute: false
    },
    {
        path: "/auth",
        component: Auth,
        privateRoute: false
    },
    {
        path: "/home",
        component: Home,
        privateRoute: true
    },
    {
        path: "/rides",
        component: Rides,
        privateRoute: true,
    },
    {
        path: "/profile",
        component: Profile,
        privateRoute: true
    },
    {
        path: "/about",
        component: About,
        privateRoute: false
    },
    {
        path: "/newride",
        component: NewRide,
        privateRoute: true
    },
    {
        path: "/",
        component: LandingPage,
        privateRoute: false
    },
];

/**
 * Defines all the routes for our system.
 * @param {*} param0 
 */
export const Routes = ({ }) => {
    // const client = useApolloClient();
    
    // Initially, we need to get the "serviceURL" (used for IDP authentication) from the backend
    // useEffect(
    //     () => {
    //         fetch(backendURL + "/deploy/service")
    //         .then(response => {
    //             response.text().then(service => {
    //                 // Directly writes the service url to the cache
    //                 client.writeQuery({
    //                     query: gql`query GetService { service }`,
    //                     data: { service: service }
    //                 });
    //             });
    //         });
    //     }, []
    // );


    return (
        <Switch>
            {/* <Route path={"/login"}>
                <Login />
            </Route>
            <Route path={"/auth"}>
                <Auth />
            </Route>
            <PrivateRoute path={"/home"}>
                <Home />
            </PrivateRoute>
            <PrivateRoute path={"/"}>
                <Home />
            </PrivateRoute> */}
            {routesArray.map(routeObject => {
                let { path, component, privateRoute } = routeObject;
                if (privateRoute) {
                    return (<PrivateRoute path={path} component={component} />);
                } else {
                return (<Route path={path} component={component} />);
                }
            })}
        </Switch>
    )
}