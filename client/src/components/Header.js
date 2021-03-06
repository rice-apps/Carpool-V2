import React from 'react';
import styled, { css } from 'styled-components';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import Icon from '../assets/icon_top_left.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome,
    faPencilAlt,
    faSearch,
    faUser,
    faCommentAlt,
    faGift
} from '@fortawesome/free-solid-svg-icons'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Redirect } from "react-router";

export const Header = () => {

    const MainHeader = styled.header`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 17vh;
        padding-right: 17vh;
        flex-wrap: wrap;
        background-color: #142537;
        color: white;
        height: 14vh;
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
        font-size: 1.6vw;
        font-family: Copperplate Gothic Light;
        text-decoration: none;
        width: 8em;

        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none;
        }
    `
    
    const UL = styled.ul`
        display: flex;
        flex-direction: row;
        textDecoration: 'none';
        // padding: 0 1.4em 0 0;
        text-align: center;
        font-family: AvenirLTStd-Book;
    `

    const LI = styled.li`
        padding: .6vh 1vh .6vh 1vh;
        background-color: transparent;
        vertical-align: middle;
        font-size: 1.2vw;
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

    const StyledA = styled.a` 
        display: box;
        text-decoration: none;
        color: white;
        padding-right: .2vh;
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
    `

    let token = localStorage.getItem('token') != null ? localStorage.getItem('token') : '';

    let client = useApolloClient();

    let { data, loading, error } = useQuery(
        VERIFY_USER,
        { variables: { token: token }, errorPolicy: 'none' }
    );

    let btn;
    let gift;
    if (!data || !data.verifyUser) {
        btn = <StyledLink to="/login">Login </StyledLink>
    } else {
        btn = <StyledLink to="/profile">Profile </StyledLink>
        gift = <LI>
                    <StyledA href='https://docs.google.com/forms/d/e/1FAIpQLScgTWnH6Opj5KlR1StDhQbRhPIZ7Om-UqFZjbS4K-XDr4ieYg/viewform'>
                        Free Sticker &nbsp;
                        <StyledIcon to='https://docs.google.com/forms/d/e/1FAIpQLScgTWnH6Opj5KlR1StDhQbRhPIZ7Om-UqFZjbS4K-XDr4ieYg/viewform'>
                            <FontAwesomeIcon icon={faGift} />
                        </StyledIcon>
                    </StyledA>
                </LI>;
    }

    return (
        <div>
            <MainHeader>
                <div>
                    <H2Link to="/">
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
                        <StyledLink to="/newride">New Ride </StyledLink>
                        <StyledIcon to="/newride">
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
                        {btn}
                        <StyledIcon>
                            <FontAwesomeIcon icon={faUser} />
                        </StyledIcon>
                    </LI>
                    <LI>
                        <StyledA href='https://forms.gle/RTo5zf4v6aVXBKAGA'>
                            Feedback &nbsp;
                            <StyledIcon to='https://forms.gle/RTo5zf4v6aVXBKAGA'>
                                <FontAwesomeIcon icon={faCommentAlt} />
                            </StyledIcon>
                        </StyledA>
                    </LI>
                    {gift}
                </UL>
            </MainHeader>
        </div>
    )
}

export default Header;