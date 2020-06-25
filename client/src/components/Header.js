import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../assets/icon_top_left.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome,
    faPencilAlt,
    faSearch,
    faUser
} from '@fortawesome/free-solid-svg-icons'
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
        padding: .6vh 1vh .6vh 1vh;
        background-color: transparent;
        vertical-align: middle;
        font-size: 18px;
        position: relative;
        display: flex;
        &:before {
            content: "";
            position: absolute;
            margin: 0 1vh 0 0.9vh;
            width: 90%;
            height: .2vh;
            bottom: 0;
            left: 0;
            background-color: white;
            visibility: hidden;
            transform: scaleX(0);
            transition: all 0.3s ease-in-out 0s;
        }
        &:hover::before {
            visibility: visible;
            transform: scaleX(1);
        }
    `
    const StyledLink = styled(Link)`
        display: box;
        text-decoration: none;
        color: white;
        padding-right: .75vh;
        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `

    const StyledIcon = styled(Link)`
        text-decoration: none;
        color: white;
        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
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
                        <StyledLink to="/about">About Us  </StyledLink>
                        <StyledIcon to="/about">
                            <FontAwesomeIcon icon={faHome} />
                        </StyledIcon>
                    </LI>
                    <LI>
                        <StyledLink to="/rides">New Ride </StyledLink>
                        <StyledIcon to="/rides">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </StyledIcon>
                    </LI>
                    <LI>
                        <StyledLink to="/rides">Find Ride </StyledLink>
                        <StyledIcon to='/rides'>
                            <FontAwesomeIcon icon={faSearch} />
                        </StyledIcon>
                    </LI>
                    <LI>
                        <StyledLink to="/profile">Profile </StyledLink>
                        <StyledIcon to="/profile">
                            <FontAwesomeIcon icon={faUser} />
                        </StyledIcon>
                    </LI>
                    <LI>
                        <StyledLink to="/login">Login </StyledLink>
                        <StyledIcon>
                            <FontAwesomeIcon icon={faUser} />
                        </StyledIcon>
                    </LI>
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;