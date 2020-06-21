import React from 'react';
import styled, { css } from 'styled-components';
import carpoolll from '../carpoolll.png'
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
        background-color: #1b474b;
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

    const H2 = styled(Link)`
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
    `

    const LI = styled.li`
        text-decoration: none;
        padding: .6em 1em .6em 1em;
        border-style: solid;
        border-width: thin;
        border-right: none;
        background-color: transparent;
        transition: background-color .2s linear;
        display: inline;
        &:last-child {
            border-right: solid;
            border-width: thin;
        }
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

    return (
        <div>
            <MainHeader>
                <div>
                    <H2 to="/about">
                        Carpool &nbsp; <img src={carpoolll} alt="Carpool Logo" width="30" height="50"/>
                    </H2>
                </div>
                <UL>
                    <LI>
                        <StyledLink to="/home"><A>Home</A></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/about"><A>About</A></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/login"><A>Login</A></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/rides"><A>Rides</A></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to="/profile"><A>Profile</A></StyledLink>
                    </LI>
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;