import React from 'react';
import styled, { css } from 'styled-components';
import carpoolll from '../carpoolll.png';
import Icon from '../assets/icon_top_left.svg';
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
        padding: .1em 0 .1em 0;
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
        word-wrap: break-word;
        color: white;
        font-size: 24px;
        font-family: Copperplate Gothic Light;
        text-decoration: none;
        width: 8em;

        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `

    const Nav = styled.nav`
        margin: 1.5em 0 0 5%;
    `

    const UL = styled.ul`
        display: flex;
        flex-direction: row;
        textDecoration: 'none';
        // padding: 0 1.4em 0 0;
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

    const ImgWrapper1 = styled.div`
        width: 8.8em;
        height: 2.9em;
    `

    const ImgWrapper3 = styled.div`
        width: 6em;
        height: 2.9em;
    `

    const IMG = styled.img`
        width: auto;
        height: 100%;
    `

    return (
        <div>
            <MainHeader>
                <div>
                    <H2Link to="/about">
                        <img src={Icon} alt="Carpool Logo" width="30" height="50"/>
                        &nbsp;
                        <p>
                            Rice
                            Carpool
                        </p>
                    </H2Link>
                </div>
                <UL>
                    {/* <LI>
                        <StyledLink to="/home"><A>Home</A></StyledLink>
                    </LI> */}
                    <LI>
                        <ImgWrapper1>
                            <StyledLink to="/about"><IMG src={AboutUs} /></StyledLink>
                        </ImgWrapper1>
                    </LI>
                    <LI>
                        <ImgWrapper1>
                            <StyledLink to="/rides"><IMG src={NewRide} /></StyledLink>
                        </ImgWrapper1>
                    </LI>
                    <LI>
                        <ImgWrapper1>
                            <StyledLink to="/rides"><IMG src={FindRide} /></StyledLink>
                        </ImgWrapper1>
                    </LI>
                    <LI>
                        <ImgWrapper1>
                            <StyledLink to="/profile"><IMG src={Profile} /></StyledLink>
                        </ImgWrapper1>
                    </LI>
                    <LI>
                        <ImgWrapper1>
                            <StyledLink to="/login"><IMG src={Login} /></StyledLink>
                        </ImgWrapper1>
                    </LI>
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;