import React from 'react';
import styled, { css } from 'styled-components';
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
        text-decoration: none!important;
        -webkit-box-shadow: none!important;
        box-shadow: none!important;
    `

    const H2 = styled.h2`
        font-weight: normal;
        vertical-align: middle;
    `

    const Nav = styled.nav`
        margin: 1.5em 0 0 5%;
    `

    const UL = styled.ul`
        padding: 0 1.4em 0 0;
        text-align: center;
    `

    const LI = styled.li`
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

    return (
        <div>
            <MainHeader>
                <span>
                    <H2>
                        Carpool
                    </H2>
                </span>
                <UL>
                    <LI>
                        <Link to="/home"><A>Home</A></Link>
                    </LI>
                    <LI>
                        <Link to="/about"><A>About</A></Link>
                    </LI>
                    <LI>
                        <Link to="/login"><A>Login</A></Link>
                    </LI>
                    <LI>
                        <Link to="/rides"><A>Rides</A></Link>
                    </LI>
                    <LI>
                        <Link to="/profile"><A>Profile</A></Link>
                    </LI>
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;