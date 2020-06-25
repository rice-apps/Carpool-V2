import React from 'react';
import styled, { css } from 'styled-components';
import carpoolll from '../carpoolll.png';
import AboutUs from '../assets/about_us.svg';
import NewRide from '../assets/new_ride.svg';
import FindRide from '../assets/find_ride.svg';
import Profile from '../assets/profile.svg';
import Login from '../assets/log_in.svg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export const Header = () => {

    const MainHeader = styled.header`
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        background-color: #142537;
        color: white;
        padding: .5em 0 .5em 0;
    `

    const A = styled.a`
        color: white;
        text-decoration: none !important;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
        border-bottom-style: none !important;
    `

    const H2Link = styled(Link)`
        font-weight: normal;
        vertical-align: middle;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;

        text-decoration: none;

        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `

    const Nav = styled.nav`
        margin: 1.5em 0 0 5%;
    `

    const UL = styled.ul`
        textDecoration: 'none';
        padding: 0 1.4em 0 0;
        text-align: center;
        font-family: acari-sans.light;
    `

    const LI = styled.li`
        // padding: .6em 1em .6em 1em;
        border-style: none;
        background-color: transparent;
        transition: background-color .2s linear;
        vertical-align: middle;
        display: inline;
        &:hover {
            background-color: #359d99;
        }
    `
    const StyledLink = styled(Link)`
        text-decoration: none;

        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `

    const IMG = styled.img`
        max-width: 6em;
        height: 3em;
    `

    return (
        <div>
            <MainHeader>
                <div>
                    <H2Link to="/about">
                        Carpool &nbsp; <img src={carpoolll} alt="Carpool Logo" width="30" height="50"/>
                    </H2Link>
                </div>
                <UL>
                    {/* <LI>
                        <StyledLink to="/home"><A>Home</A></StyledLink>
                    </LI> */}
                    <LI>
                        <StyledLink to="/about"><IMG src={AboutUs} /></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/rides"><IMG src={NewRide} /></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/rides"><IMG src={FindRide} /></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/profile"><IMG src={Profile} /></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/login"><IMG src={Login} /></StyledLink>
                    </LI>
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;